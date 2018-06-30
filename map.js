
// This sample uses the Place Autocomplete widget to allow the user to search
// for and select a place. The sample then displays an info window containing
// the place ID and other information about the place that the user has
// selected.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
// Below are the global variables used in this application
robertskey = "AIzaSyBedSxVEt6C9NFK1btkL4H26iM1tUgUSd8"
mykey = "AIzaSyBookB9C0GkXdMO2WOVkvv2ayvf7MAwz48"
var latt;
var map;
var long;
var queryURL = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAX8feEcKAYX6Eo1RyDlHiv_7rGhYuTAyc";
var newPlaceID;
var drivingDistances;
var mileConverter = 0.000621371192;
var infowindow;
var directionsDisplay;
var directionsService;
var lastBrewLat;
var lastBrewLong;
var markerArr = [];
var rankReverse = false;
var nameReverse = false;
var styleReverse = false;
var breweryReverse = false;
var distanceReverse = false;
var newData = data;
var currentBrewery;

//=======================================================================================
//Creates a grid of cards with the beer data
function populateTable(arr) {
  for (var i = 0; i < arr.length; i++) {
    var blankcard = $("<div></div>"); //creating a div INSIDE the for loop because I want each one to be an individual card
    blankcard.addClass("card"); //adding the class of card to the div above, this allows each one to be recognised as a card via bootstrap
    var ranknumber = arr[i].rank; //creating a variable and giving it the beer rank for each iteration
    var ranknumberdata = $("<h5 class='number-circle'>" + ranknumber + "</h5>");  //putting the rank variable within the appropriate elements
    //++++++++++++++++++++++++++++++++++++++++++
    var beerName = arr[i].name; //creating a variable and giving it the name of the beer for each iterariont
    var beerNameData = ("<h6 class='card-title'>" + beerName + "</h6>");  //putting the name variable within the appropriate HTML elements
    //++++++++++++++++++++++++++++++++++++++++++
    var brewery = arr[i].brewloc; //creating a variable to hold the brewery name of each beer
    var breweryData = ("<a class='btn btn-primary' style='color: #fff' latt='" + data[i].latt + "' brew-data='" + data[i].brewloc + "' >" + brewery + "</a>");
    //++++++++++++++++++++++++++++++++++++++++++
    var style = arr[i].style; //creating a variable to hold the style of each beer
    var style = style.toLowerCase();  //this was done from an aesthetics point of view, I thought it looked better in lowercase
    var styleData = ("<p class='card-text'>" + style + "</p>"); //putting the style variable in a <p> tag
    //++++++++++++++++++++++++++++++++++++++++++
    var drivingTimeHTML;  //one of the API's allows for us to find driving distance and using the calculation below store it where we 
    for (var x = 0; x < coordsArr.length; x++) {  //can output it into the cards on the front end
      if (brewery == breweryArr[x]) {  //looking for the specific brewery is in the beer array
        if (drivingDistances.rows[0].elements[x].status == "OK") {
          var drivingDistData = Math.round((drivingDistances.rows[0].elements[x].distance.value) * mileConverter)
          var drivingTimeData = (drivingDistances.rows[0].elements[x].duration.text)
          drivingDistHTML = ("<td>" + drivingDistData + "</td>");
          drivingTimeHTML = drivingTimeData
          arr[i].drivingDistance = drivingDistData
        } else {
          drivingTimeHTML = ("no driving info");
          arr[i].drivingDistance = 100000000;
          drivingDistHTML = ("no driving info");
        }
      }
    }
    var drive = ("<p class='card-text cardin'>" + drivingTimeHTML + "</p>"); //putting the driving distance in a <p> tag
    $(blankcard).append(ranknumberdata, drive, beerNameData, styleData, breweryData); //all of the variables are appended to the CARD DIV
    $("#cards").append(blankcard);  //all the card divs are appended to a container div with the id of "cards"
  }
}
//=======================================================================================
function documentReadyFunction() {
  $(document).ready(function () {
    populateTable(data);
    $(".col-header").on("click", "#name", function () {
      if ($(this).attr("id") == "name") {
      }
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
//console.log(response);
drivingDistances = response;
//console.log("distanceresponse");
//console.log(drivingDistances.rows[0].elements)
//console.log(drivingDistances)
documentReadyFunction()
});

});
function calculateDistance(){
  $("#cards").empty();
var queryURL4 = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + latt + "," + long + "&destinations=enc:" + encoded+ ":&key=" + mykey;
$.ajax({
  url: queryURL4,
  method: "GET"
}).done(function (response) {
  console.log(response + "teste");
drivingDistances = response;
//console.log("distanceresponse");
//console.log(drivingDistances)
populateTable(data);
});
}
//var queryURL3 = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + latt + "," + long + "&destinations=enc:" + encoded+ ":&key="+ mykey;

function recaculateDistance(placeID){
  $("#cards").empty();
  var queryURL3 = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=place_id:"+placeID+ "&destinations=enc:" + encoded+ ":&key="+ mykey;
  $.ajax({
    url: queryURL3,
    method: "GET"
  }).done(function (response) {
  console.log(response + "teste");
  drivingDistances = response;
  //console.log("distanceresponse2");
  //console.log(drivingDistances)
  populateTable(data);
  });

}



//==================================================================
// AJAX Call
function calcRoute() {
  var start = new google.maps.LatLng(latt, long);
  //var end = new google.maps.LatLng(38.334818, -181.884886);
  var endlat;
  var endlong;
  for(var i=0; i<data.length; i++){
    if (data[i].latt == lastBrewLat)
    {
      endlat = data[i].latt;
      endlong = data[i].long
    }

  }
  var end = new google.maps.LatLng(endlat, endlong);
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      directionsDisplay.setMap(map);
    } else {
      //alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
    }
  });
}

$(document).on("click", "#routebtn", function() {
  //console.log("stsuff")
calcRoute();
});
var marker2;
//==================================================================
//Map Initialization Function
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: latt, lng: long },
    zoom: 12
  });
  directionsService = new google.maps.DirectionsService();
  var input = document.getElementById('pac-input'); //takes the value you type in the searc box
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  infowindow.setContent("your current location");
  var marker = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(latt, long),
    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
  });
  marker.addListener('click', function () {
    infowindow.open(map, marker);
  });
   marker2 = marker
  google.maps.event.addListener(map, 'click', function(event) {
    infowindow.close();
    infowindow.setContent("your chosen location");
    marker.setPlace(null);
    latt = event.latLng.lat();
    long  = event.latLng.lng()
    
    marker.setPosition(new google.maps.LatLng(latt, long),)
   
    map.panTo(new google.maps.LatLng(latt, long),)
    calculateDistance()
    console.log(latt, long)
    //alert( "Latitude: "+event.latLng.lat()+" "+", longitude: "+event.latLng.lng() ); 
    //console.log(event.latlng);
 });
 

 
  //=======================================================================================
  //Create multiple markers on the map
  var markers, i;
var currentBeers = []
  for (i = 0; i < data.length; i++) {
    markers = new google.maps.Marker({
      position: new google.maps.LatLng(data[i].latt, data[i].long),
      map: map
    });
//markerArr.push(markers);
    google.maps.event.addListener(markers, 'click', (function (markers, i) {
      return function () {
        map.panTo(markers.getPosition());
        //console.log(markers.getPosition().lat());
        lastBrewLat = markers.getPosition().lat();
        //console.log(markers.getPosition().lng());
        lastBrewLong = markers.getPosition().lng();
        //var b = data[i].brewloc;
        //var bsm = b.toLowerCase();
        //var n = data[i].name;
        //infowindow.setContent(bsm + "<br>" + "<h6>" + n + "</h6>");
        currentBeers = []
  for (i = 0; i < data.length; i++) {
    if (lastBrewLat == data[i].latt){
currentBrewery = data[i].brewloc
if (currentBeers.includes(data[i].name) == false){
currentBeers.push(" "+ data[i].name)
}
    }
  }
        console.log(currentBeers)
        console.log(data)
        infowindowContent.children['place-name'].textContent = currentBrewery;
        
        infowindowContent.children['place-address'].textContent = currentBeers;
        infowindow.setContent(infowindowContent);
        infowindow.open(map, markers);
        marker2= markers
        //infowindow.open(map, markers);
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
    //console.log(place.geometry.location)
    long = place.geometry.viewport.b.b
    latt = place.geometry.viewport.f.f
    infowindow.setContent(infowindowContent);
  
    //console.log("it works")
  
    //console.log("it works2");
    //data.sort(function(a, b) {
      //var textA = a.style;
      //var textB = b.style.toUpperCase();
      //return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    //});
  
    marker.setVisible(true);
    newPlaceID = place.place_id;
    recaculateDistance(newPlaceID);
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent = place.formatted_address;
    infowindow.open(map, marker);

    
  });

  
  //=======================================================================================


   
        
    

}

$(document).on('click','.btn-primary', map, function() {
 
  //console.log($(this).attr("brew-data"));
    console.log("stuff")
   var brewlat = ($(this).attr("brew-lat"));
 //console.log(brewlat)
 //for (i = 0; i < markerArr.length; i++) {
   ////console.log(markerArr[i].getPosition())
 //}
   for (var i = 0; i < data.length; i++) {
     //console.log(data[i.brewloc])
     if(data[i].brewloc==($(this).attr("brew-data"))){
       currentBrewery = $(this).attr("brew-data");
       console.log(currentBrewery)
       //console.log("workingstuff")
       var latLng = new google.maps.LatLng(data[i].latt, data[i].long); //Makes a latlng
       map.panTo(new google.maps.LatLng(data[i].latt, data[i].long))
       lastBrewLat = data[i].latt,
       lastBrewLong = data[i].long;
         infowindow.setContent(currentBrewery);
         //infowindow.open(map, markers);
       
     }
 }
  
   });
   var tableArray = [];
   var headers = [];
   $('#caltbl th').each(function(index, item) {
       headers[index] = $(item).html();
   });
   $('#caltbl tr').has('td').each(function() {
       var arrayItem = {};
       $('td', $(this)).each(function(index, item) {
           arrayItem[headers[index]] = $(item).html();
       });
       tableArray.push(arrayItem);
   });

   //console.log(tableArray);
//code below here was mostly from stackoverflow and google documentation.
function sortTable() {
  var tbl = document.getElementById("caltbl").tBodies[0];
    var store = [];
    for(var i=0, len=tbl.rows.length; i<len; i++){
        var row = tbl.rows[i];
        var sortnr = parseFloat(row.cells[0].textContent || row.cells[0].innerText);
        if(!isNaN(sortnr)) store.push([sortnr, row]);
    }
    store.sort(function(x,y){
        return x[0] - y[0];
    });
    for(var i=0, len=store.length; i<len; i++){
        tbl.appendChild(store[i][1]);
    }
    store = null;
}



var encoded = createEncodings(coordsArr);//the encoded polyline
//console.log(encoded);
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

$(document).on("click", "li", function() {
  $("#cards").empty();
  console.log("navtest")
  if ($(this).attr("id") == "name"){
  console.log("name")
  if (nameReverse == true){
    data.reverse(function(a, b) {
      var textA = a.name
      var textB = b.name
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  nameReverse = false;
  }
   else if (nameReverse == false){
   data.sort(function(a, b) {
      var textA = a.name
      var textB = b.name
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  nameReverse = true;
}
  
  populateTable(data);
  }
  if ($(this).attr("id") == "rank"){
    console.log("rank")
    if (rankReverse == true){
      data.reverse(function(a, b) {
        var textA = a.rank
        var textB = b.rank
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    rankReverse = false;
    }
     else if (rankReverse == false){
     data.sort(function(a, b) {
        var textA = a.rank
        var textB = b.rank
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    rankReverse = true;
  }
  console.log(data)
    populateTable(data);
    }
    if ($(this).attr("id") == "brewery"){
      console.log("brewery")
      if (breweryReverse == true){
        data.reverse(function(a, b) {
          var textA = a.brewloc
          var textB = b.brewloc
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      breweryReverse = false;
      }
       else if (breweryReverse == false){
       data.sort(function(a, b) {
          var textA = a.brewloc
          var textB = b.brewloc
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      breweryReverse = true;
    }
    console.log(data)
      populateTable(data);
      }
      if ($(this).attr("id") == "style"){
        console.log("style")
        if (styleReverse == true){
          data.reverse(function(a, b) {
            var textA = a.style
            var textB = b.style
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        styleReverse = false;
        }
         else if (styleReverse == false){
         data.sort(function(a, b) {
            var textA = a.style
            var textB = b.style
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        styleReverse = true;
      }
      console.log(data)
        populateTable(data);
        }

        if ($(this).attr("id") == "distance"){
          console.log("distance")
          if (distanceReverse == true){
            data.reverse(function(a, b) {
              var textA = a.drivingDistance
              console.log(textA)
              var textB = b.drivingDistance
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
          distanceReverse = false;
          }
           else if (distanceReverse == false){
           data.sort(function(a, b) {
              var textA = a.drivingDistance
              var textB = b.drivingDistance
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
          distanceReverse = true;
        }
        console.log(data)
          
          populateTable(data);
          }
  
  
//sortTable();    
});

//=======================================================================================




$(document).on("click", "#clearroute", function() {
  //console.log("stsuff")
  directionsDisplay.setMap(null);
 });