$(document).ready(function (){




var queryURL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=47.6918452,-122.2226413&key=AIzaSyDdvw2hFiNIZk1rOhBqAPO36tCt8I8gogo";
   $.ajax({
       url: queryURL,
       method: "GET"
   }).done(function(response) {
console.log(response);

});



//========================================================================
//Rank,Name,Brewery,Style,Geo
for (var i = 0; i < data.length; i++) {

    $("tbody");
    // Create and save a reference to new empty table row
    var newrow = $("<tr></tr>");
    // Create and save references to 3 td elements containing the Title, Year, and Actors from the AJAX response object
    var title = data[i].rank;
    var titledata = ("<td>" + title + "</td>");
    //++++++++++++++++++++++++++++++++++++++++++
    var year = data[i].name;
    console.log(year);
    var yeardata = ("<td>" + year + "</td>");
    //++++++++++++++++++++++++++++++++++++++++++
    var genre = data[i].brewloc;
    
    var genredata = ("<td>" + genre + "</td>");
    //++++++++++++++++++++++++++++++++++++++++++
    var tomato = data[i].style;
    var tomatodata = ("<td>" + tomato + "</td>");
    //++++++++++++++++++++++++++++++++++++++++++

    // Append the td elements to the new table row
    $(newrow).append(titledata, yeardata, genredata, tomatodata);
    
    
    // Append the table row to the tbody element
    $("tbody").append(newrow);
    

    

}


// This sample uses the Place Autocomplete widget to allow the user to search
      // for and select a place. The sample then displays an info window containing
      // the place ID and other information about the place that the user has
      // selected.

      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13
        });

        var input = document.getElementById('pac-input');

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        var marker = new google.maps.Marker({
          map: map
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });

        autocomplete.addListener('place_changed', function() {
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
            location: place.geometry.location
          });
          marker.setVisible(true);

          infowindowContent.children['place-name'].textContent = place.name;
          infowindowContent.children['place-id'].textContent = place.place_id;
          infowindowContent.children['place-address'].textContent =
              place.formatted_address;
          infowindow.open(map, marker);
        });
      }


});
