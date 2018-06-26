
// This sample uses the Place Autocomplete widget to allow the user to search
// for and select a place. The sample then displays an info window containing
// the place ID and other information about the place that the user has
// selected.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

robertskey = "AIzaSyBedSxVEt6C9NFK1btkL4H26iM1tUgUSd8"
mykey = "AIzaSyBookB9C0GkXdMO2WOVkvv2ayvf7MAwz48"
var latt;
var long;
var queryURL = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAX8feEcKAYX6Eo1RyDlHiv_7rGhYuTAyc";
var newPlaceID;
var drivingDistances;
var mileConverter = 0.000621371192;


function populateTable(arr){
  //var blankRow = $("<tr></tr>");
 // $(".table-body").append(blankRow);
  for (var i = 0; i < arr.length; i++) {
   console.log("populating")
    var newrow = $("<tr></tr>");
    var beerRank = arr[i].rank;
    var beerRankData = ("<td>" + beerRank + "</td>");
    //++++++++++++++++++++++++++++++++++++++++++
    var beerName = arr[i].name;
    var beerNameData = ("<td>" + beerName + "</td>");
    //++++++++++++++++++++++++++++++++++++++++++
    var brewery = arr[i].brewloc;
    var breweryData = ("<td>" + brewery + "</td>");
    //++++++++++++++++++++++++++++++++++++++++++
    var style= arr[i].style;
    var style = style.toLowerCase();
    var styleData = ("<td>" + style + "</td>");
    //++++++++++++++++++++++++++++++++++++++++++
    var lat1 = latt;
    var lon1 = long;
    var lat2 = arr[i].latt;
    var lon2 = arr[i].long;
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos((lat2-lat1) * p);
    var d = Math.cos(lat1 * p);
    var e = Math.cos(lat2 * p);
    var f = Math.cos((lon2 - lon1) * p);
    var a = 0.5 - c/2 + d * e * (1 - f)/2;

    var dist1 = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    
    var dist2 = dist1 * 0.621371
    var dist3 = dist2.toFixed(2)
    
    var distdata = ("<td>" + dist3 + " miles</td>")
    var drivingDistHTML;
    
    for(var x = 0; x < coordsArr.length; x++) {
      if (brewery == breweryArr[x]){
        if (drivingDistances.rows[0].elements[x].status =="OK"){
        var drivingDistData =  Math.round((drivingDistances.rows[0].elements[x].distance.value)* mileConverter)
        
        drivingDistHTML =("<td>" + drivingDistData + " miles </td>")
        
      }
      else{
        var drivingDistHTML = ("<td> no driving info</td>")
      }
    }
  }
    // Append the td elements to the new table row
    $(newrow).append(beerRankData, beerNameData, breweryData, styleData, distdata, drivingDistHTML);
    // Append the table row to the tbody element
    $(".table-body").append(newrow);
  }



  
  function calcCrow(lat1, lon1, lat2, lon2) 
  {
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  function toRad(Value) 
  {
      return Value * Math.PI / 180;
  }
  
}
/*
 data.sort(function(a, b) {
          var textA = a.rank
          var textB = b.rank
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
*/
function documentReadyFunction(){
  $(document).ready(function () {
    console.log(latt);
    console.log(long); 
    console.log(data)
    console.log(drivingDistances)
    populateTable(data);
    $(".col-header").on("click", function() {
sortTable(1);    
  });


  });

  }
//==================================================================
// AJAX Call
$.ajax({
  url: queryURL,
  method: "POST"
}).done(function (response) {
  latt = response.location.lat;
  long = response.location.lng;
  initMap();

var queryURL2 = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + latt + "," + long + "&destinations=enc:" + encoded+ ":&key="+ mykey;
$.ajax({
  url: queryURL2,
  method: "GET"
}).done(function (response) {
console.log(response);
drivingDistances = response;
console.log("distanceresponse");
console.log(drivingDistances)
documentReadyFunction()
});

});
function calculateDistance(){
  document.getElementById("table-body2").innerHTML = "";
var queryURL4 = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + latt + "," + long + "&destinations=enc:" + encoded+ ":&key=" + mykey;
$.ajax({
  url: queryURL4,
  method: "GET"
}).done(function (response) {
console.log(response);
drivingDistances = response;
console.log("distanceresponse");
console.log(drivingDistances)
populateTable(data);
});
}
var queryURL3 = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + latt + "," + long + "&destinations=enc:" + encoded+ ":&key="+ mykey;

function recaculateDistance(placeID){
  document.getElementById("table-body2").innerHTML = "";
  var queryURL2 = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=place_id:"+placeID+ "&destinations=enc:" + encoded+ ":&key="+ mykey;
  $.ajax({
    url: queryURL2,
    method: "GET"
  }).done(function (response) {
  console.log(response);
  drivingDistances = response;
  console.log("distanceresponse2");
  console.log(drivingDistances)
  populateTable(data);
  });

}
//==================================================================
// AJAX Call

//==================================================================
//Map Initialization Function
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: latt, lng: long },
    zoom: 12
  });

  var input = document.getElementById('pac-input'); //takes the value you type in the searc box
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
 

  infowindow.setContent("your current location");
  var marker = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(latt, long),
    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
  });
  marker.addListener('click', function () {
    infowindow.open(map, marker);
  });

  google.maps.event.addListener(map, 'click', function(event) {
    infowindow.close();
    infowindow.setContent("your chosen location");
    marker.setPlace(null);
    latt = event.latLng.lat();
    long  = event.latLng.lng()
    console.log(latt, long)
    marker.setPosition(new google.maps.LatLng(latt, long),)
   
    map.panTo(new google.maps.LatLng(latt, long),)
    calculateDistance()
    //alert( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() ); 
    console.log(event.latlng);
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
        map.panTo(markers.getPosition());
        infowindow.setContent(data[i].brewloc);
        infowindow.open(map, markers);
      }
    })(markers, i));
  }
var marker2;



 
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
      map.panTo(place.geometry.location);
      map.setZoom(17);
    }

    // Set the position of the marker using the place ID and location.
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location,

    });
    console.log(place.geometry.location)
    long = place.geometry.viewport.b.b
  latt = place.geometry.viewport.f.f

  
  console.log("it works")
  
    console.log("it works2");
    //data.sort(function(a, b) {
      //var textA = a.style;
      //var textB = b.style.toUpperCase();
      //return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    //});
  
    marker.setVisible(true);
    newPlaceID = place.place_id;
    recaculateDistance(newPlaceID);
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-id'].textContent = place.place_id;
    infowindowContent.children['place-address'].textContent = place.formatted_address;
    infowindow.open(map, marker);

    
  });

  
  //=======================================================================================

  //=======================================================================================
  //Creates a table of the beer data
  

   
        
    

}

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc"; 
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;      
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}



var encoded = createEncodings(coordsArr);//the encoded polyline
console.log(encoded);
//these next 3 functions create an encoded polyline out of the coordinate array. it adds the coordinates together and then turns it into an ASCII string which allows us to request-
//-all the coordinates at once
function createEncodings(coords) {
	var i = 0;
 
	var plat = 0;
	var plng = 0;
 
	var encoded_points = "";
 
	for(i = 0; i < coords.length; ++i) {
	    var lat = coords[i][0];				
		var lng = coords[i][1];		
 
		encoded_points += encodePoint(plat, plng, lat, lng);
 
	    plat = lat;
	    plng = lng;
	}
 
	// close polyline
	encoded_points += encodePoint(plat, plng, coords[0][0], coords[0][1]);
 
	return encoded_points;
}
 
function encodePoint(plat, plng, lat, lng) {
	var late5 = Math.round(lat * 1e5);
    var plate5 = Math.round(plat * 1e5)    
 
	var lnge5 = Math.round(lng * 1e5);
    var plnge5 = Math.round(plng * 1e5)
 
	dlng = lnge5 - plnge5;
	dlat = late5 - plate5;
 
    return encodeSignedNumber(dlat) + encodeSignedNumber(dlng);
}
 
function encodeSignedNumber(num) {
  var sgn_num = num << 1;
 
  if (num < 0) {
    sgn_num = ~(sgn_num);
  }
 
  return(encodeNumber(sgn_num));
}
 
function encodeNumber(num) {
  var encodeString = "";
 
  while (num >= 0x20) {
    encodeString += (String.fromCharCode((0x20 | (num & 0x1f)) + 63));
    num >>= 5;
  }
 
  encodeString += (String.fromCharCode(num + 63));
  return encodeString;
}

//=======================================================================================




