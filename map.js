
// This sample uses the Place Autocomplete widget to allow the user to search
// for and select a place. The sample then displays an info window containing
// the place ID and other information about the place that the user has
// selected.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">



var latt;
var long;
var queryURL = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAX8feEcKAYX6Eo1RyDlHiv_7rGhYuTAyc";

//==================================================================
// AJAX Call
$.ajax({
  url: queryURL,
  method: "POST"
}).done(function (response) {
  latt = response.location.lat;
  long = response.location.lng;
  initMap();
  
});
//==================================================================
//Map Initialization Function
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: latt, lng: long },
    zoom: 13
  });

  var input = document.getElementById('pac-input'); //takes the value you type in the searc box
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(latt, long),
    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
  });
  marker.addListener('click', function () {
    infowindow.open(map, marker);
  });
  //=======================================================================================
  //Create multiple markers on the map
  var markers, i;

  for (i = 0; i < data.length; i++) {
    markers = new google.maps.Marker({
      position: new google.maps.LatLng(data[i].latt, data[i].long),
      map: map
    });

    google.maps.event.addListener(markers, 'click', (function (markers, i) {
      return function () {
        infowindow.setContent(data[i].name);
        infowindow.open(map, marker);
      }
    })(markers, i));
  }
  //=======================================================================================
  //Adds a marker based on what was typed into the search box
  autocomplete.addListener('place_changed', function () {
    infowindow.close();
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location,

    });
    marker.setVisible(true);

    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-id'].textContent = place.place_id;
    infowindowContent.children['place-address'].textContent =
      place.formatted_address;
    infowindow.open(map, marker);

    
  });
  //=======================================================================================

  //=======================================================================================
  //Creates a table of the beer data
  $(document).ready(function () {

    console.log(latt);
    console.log(long);
    
    for (var i = 0; i < data.length; i++) {
      $("tbody");
      var newrow = $("<tr></tr>");
      var title = data[i].rank;
      var titledata = ("<td>" + title + "</td>");
      //++++++++++++++++++++++++++++++++++++++++++
      var year = data[i].name;
      var yeardata = ("<td>" + year + "</td>");
      //++++++++++++++++++++++++++++++++++++++++++
      var genre = data[i].brewloc;
      var genredata = ("<td>" + genre + "</td>");
      //++++++++++++++++++++++++++++++++++++++++++
      var tomato = data[i].style;
      var style = tomato.toLowerCase();
      var tomatodata = ("<td>" + style + "</td>");
      //++++++++++++++++++++++++++++++++++++++++++
      var lat1 = latt;
      var lon1 = long;
      var lat2 = data[i].latt;
      var lon2 = data[i].long;
      var p = 0.017453292519943295;    // Math.PI / 180
      var c = Math.cos((lat2-lat1) * p);
      var d = Math.cos(lat1 * p);
      var e = Math.cos(lat2 * p);
      var f = Math.cos((lon2 - lon1) * p);
      var a = 0.5 - c/2 + d * e * (1 - f)/2;

      var dist1 = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
      
      var dist2 = dist1 * 0.621371
      var dist3 = dist2.toFixed(2)
      
      var distdata = ("<td>" + dist3 + "</td>")
      // Append the td elements to the new table row
      $(newrow).append(titledata, yeardata, genredata, tomatodata, distdata);
      // Append the table row to the tbody element
      $("tbody").append(newrow);
    }
    
  });
}


//=======================================================================================




