
// This sample uses the Place Autocomplete widget to allow the user to search
// for and select a place. The sample then displays an info window containing
// the place ID and other information about the place that the user has
// selected.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">


//=======================================================================================
//declares global variables
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
console.log("there is a very rare bug that makes the site not load because there isnt a google response yet.  You need a browser extension for CORS. Refresh the page if this happens. ")
//=================================================================================================
//=================================================================================================
//Creates a table of the beer data by taking in the data array and parsing through the properties to add them to the html cards
//this function is called each time the location is changed or the data is sorted so that the table can be repopulated with the- 
//-correct data
function populateTable(arr) {
  for (var i = 0; i < arr.length; i++) {
    var blankcard = $("<div></div>");   //BEER INFO BLANK CARD, empty DIV
    blankcard.addClass("card");
    var ranknumber = arr[i].rank;
    var ranknumberdata = $("<h5 class='number-circle'>" + ranknumber + "</h5>");  //CREATES THE FIRST ELEMENT WHICH IS BEER RANK
    var beerName = arr[i].name;
    var beerNameData = ("<h6 class='card-title'>" + beerName + "</h6>");  //CREATES AN ELEMENT FOR THE BEER NAME
    var brewery = arr[i].brewloc;
    var breweryData = ("<a class='btn btn-primary' style='color: #fff' latt='" + data[i].latt + "' brew-data='" + data[i].brewloc + "' >" + brewery + "</a>");    //CREATES AN ELEMENT FOR THE BREWERY NAME
    var style = arr[i].style;
    var style = style.toLowerCase();    //CREATES AN ELEMENT FOR THE BEER STYLE AND CONVERTS TO lowercase BECAUSE I LIKED THE AESTHETIC OF IT
    var styleData = ("<p class='card-text'>" + style + "</p>");
    var drivingTimeHTML;
    //this for loop loops through the coordinates of the breweries if the correct brewery is found, it compares it to the name from-
    //-the API request to get the distance from the original coordinates to the brewery coordinates from the data
    for (var x = 0; x < coordsArr.length; x++) {
      if (brewery == breweryArr[x]) {
        // console.log(drivingDistances.rows[0].elements[x]);
        if (drivingDistances.rows[0].elements[x].status == "OK") {
          //converts meters to miles and then rounds to wholenumber
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
    var drive = ("<p class='card-text cardin'>" + drivingTimeHTML + "</p>");
    //ABOVE IT TAKES THE DRIVING TIME AND PUTS IT IN A <P> ELEMENT
    //BELOW WE APPEND ALL THAT INFORMATION TO A BLANK CARD
    $(blankcard).append(ranknumberdata, drive, beerNameData, styleData, breweryData);
    //THEN WE APPEND ALL THE INDIVIDUAL CARDS TO AN EMPTY DIV
    $("#cards").append(blankcard);
  }
}
//=================================================================================================
//=================================================================================================
//document ready function for populate table otherwise it tries to populate before it loads data from beerapi.js
function documentReadyFunction() {
  $(document).ready(function () {
    populateTable(data);
  });
}
//=================================================================================================
//=================================================================================================
// AJAX Calls
$.ajax({
  url: queryURL,
  method: "POST"
}).done(function (response) {
  latt = response.location.lat;
  long = response.location.lng;
  initMap();
  var queryURL2 = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + latt + "," + long + "&destinations=enc:" + encoded + ":&key=" + mykey;
  $.ajax({
    url: queryURL2,
    method: "GET"
  }).done(function (response) {
    drivingDistances = response;
    documentReadyFunction()
  });
});
//=================================================================================================
//=================================================================================================
//calls for distance between current lat and long and the encoded polyline which includes all lats and longs from the beerdata
function calculateDistance() {
  $("#cards").empty();
  var queryURL4 = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + latt + "," + long + "&destinations=enc:" + encoded + ":&key=" + mykey;
  $.ajax({
    url: queryURL4,
    method: "GET"
  }).done(function (response) {
    drivingDistances = response;
    populateTable(data);
  });
}
//=================================================================================================
//=================================================================================================
//var queryURL3 = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + latt + "," + long + "&destinations=enc:" + encoded+ ":&key="+ mykey;
//this call is the same as above but uses place ID as a query instead of the latt and long
function recaculateDistance(placeID) {
  $("#cards").empty();
  var queryURL3 = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=place_id:" + placeID + "&destinations=enc:" + encoded + ":&key=" + mykey;
  $.ajax({
    url: queryURL3,
    method: "GET"
  }).done(function (response) {
    drivingDistances = response;
    populateTable(data);
  });
}
//=================================================================================================
//=================================================================================================
// Calculates the route between the users current latt and long and the latt and long of the last clicked brewery
function calcRoute() {
  var start = new google.maps.LatLng(latt, long);
  //var end = new google.maps.LatLng(38.334818, -181.884886);
  var endlat;
  var endlong;
  //for loop to determine the last clicked brewery location
  for (var i = 0; i < data.length; i++) {
    if (data[i].latt == lastBrewLat) {
      endlat = data[i].latt;
      endlong = data[i].long
    }
  }
  var end = new google.maps.LatLng(endlat, endlong);
  //creates a new directions service request for the api
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  //routes between the two points using a fuction to call the directions service api
  directionsService.route(request, function (response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      directionsDisplay.setMap(map);
    } else {
      //alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
    }
  });
}
//simple button that calls calcRoute() on click
$(document).on("click", "#routebtn", function () {
  //console.log("stsuff")
  calcRoute();
});
var marker2;
//=================================================================================================
//=================================================================================================
//Map Initialization Function
function initMap() {
  //establish new map with current coordinates
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: latt, lng: long },
    zoom: 12
  });
  //establish new directionsservice
  directionsService = new google.maps.DirectionsService();
  //takes input value and uses google autocomplete search API to suggest a list of possible responses
  var input = document.getElementById('pac-input'); //takes the value you type in the searc box
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  //creates a new info window for markers
  infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  //sets the directions display to render the response from directions service
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  //sets infowindow to current location as well as a new marker
  infowindow.setContent("Your Current Location");
  var marker = new google.maps.Marker({
    map: map,
    position: new google.maps.LatLng(latt, long),
    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
  });
  //marker click funtion to open the new infowindow
  marker.addListener('click', function () {

    console.log(marker.getPlace())
    if (marker.getPlace() == null) {
      console.log("looks like excel but scarier")
      infowindow.setContent("Your Chosen Location")
    }
    infowindow.open(map, marker);
  });
  //marker2 = marker
  //click function on the map to set a new location, pans map to new location and runs calculate distance function to recalculate the distances
  google.maps.event.addListener(map, 'click', function (event) {
    infowindow.close();
    infowindow.setContent("Your Chosen Location");
    marker.setPlace(null);
    latt = event.latLng.lat();
    long = event.latLng.lng()

    marker.setPosition(new google.maps.LatLng(latt, long), )

    map.panTo(new google.maps.LatLng(latt, long), )
    calculateDistance()
    console.log(latt, long)
  });
//=================================================================================================
//=================================================================================================
  //Create multiple markers on the map
  var markers, i;
  var currentBeers = []
  for (i = 0; i < data.length; i++) {
    markers = new google.maps.Marker({
      position: new google.maps.LatLng(data[i].latt, data[i].long),
      map: map
    });
    //markerArr.push(markers)
    //multiple markers click function which compares marker location to brewery data points so that it can display correctly in the infowindow
    //map also pans to click
    google.maps.event.addListener(markers, 'click', (function (markers, i) {
      return function () {
        map.panTo(markers.getPosition());
        //console.log(markers.getPosition().lat());
        lastBrewLat = markers.getPosition().lat();
        //console.log(markers.getPosition().lng());
        lastBrewLong = markers.getPosition().lng();
        
        currentBeers = []
        for (i = 0; i < data.length; i++) {
          if (lastBrewLat == data[i].latt) {
            currentBrewery = data[i].brewloc
            if (currentBeers.includes(data[i].name) == false) {
              currentBeers.push(" " + data[i].name)
            }
          }
        }
        console.log(currentBeers)
        console.log(data)
        infowindowContent.children['place-name'].textContent = currentBrewery;

        infowindowContent.children['place-address'].textContent = currentBeers;
        infowindow.setContent(infowindowContent);
        infowindow.open(map, markers);
        marker2 = markers
        //infowindow.open(map, markers);
      }
    })(markers, i));
  }
  var marker2;
//=================================================================================================
//=================================================================================================
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
    long = place.geometry.viewport.b.b
    latt = place.geometry.viewport.f.f
    infowindow.setContent(infowindowContent);
    marker.setVisible(true);
    newPlaceID = place.place_id;
    recaculateDistance(newPlaceID);
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent = place.formatted_address;
    infowindow.open(map, marker);
  });
}
//this is the click function for the buttons on each of the cards
//function will loop through beer data to find the right coordinates and then set the coordinates to the current position on the map
//also saves coordinates for routing pusposes
$(document).on('click', '.btn-primary', map, function () {

  
  console.log("stuff")
  var brewlat = ($(this).attr("brew-lat"));
  
  for (var i = 0; i < data.length; i++) {
    
    if (data[i].brewloc == ($(this).attr("brew-data"))) {
      currentBrewery = $(this).attr("brew-data");
      console.log(currentBrewery)
      
      var latLng = new google.maps.LatLng(data[i].latt, data[i].long); //Makes a latlng
      map.panTo(new google.maps.LatLng(data[i].latt, data[i].long))
      lastBrewLat = data[i].latt,
        lastBrewLong = data[i].long;
      infowindow.setContent(currentBrewery);
          
    }
  }

});
var tableArray = [];
var headers = [];



//code below here was mostly from stackoverflow and google documentation.
var encoded = createEncodings(coordsArr);//the encoded polyline

//these next 3 functions create an encoded polyline out of the coordinate array. it adds the coordinates together and then turns it into an ASCII string which allows us to request-
//-all the coordinates at once
function createEncodings(coords) {
  var i = 0;

  var plat = 0;
  var plng = 0;

  var encoded_points = "";

  for (i = 0; i < coords.length; ++i) {
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

  return (encodeNumber(sgn_num));
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


//This is the sort function which will sort the array of data based on object properties when the user clicks on the specific sort button
//the table is repopulated with the sorted array after each sort
//there is a very rare bug where I believe populateTable() runs before the sort function is finished so you get the array that was previously sorted
$(document).on("click", "li", function () {
  $("#cards").empty();
  
  if ($(this).attr("id") == "name") {
    
    if (nameReverse == true) {
      data.reverse(function (a, b) {
        var textA = a.name
        var textB = b.name
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      nameReverse = false;
    }
    else if (nameReverse == false) {
      data.sort(function (a, b) {
        var textA = a.name
        var textB = b.name
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      nameReverse = true;
    }

    populateTable(data);
  }
  if ($(this).attr("id") == "rank") {
    
    if (rankReverse == true) {
      data.reverse(function (a, b) {
        var textA = a.rank
        var textB = b.rank
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      rankReverse = false;
    }
    else if (rankReverse == false) {
      data.sort(function (a, b) {
        var textA = a.rank
        var textB = b.rank
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      rankReverse = true;
    }
    
    populateTable(data);
  }
  if ($(this).attr("id") == "brewery") {
    
    if (breweryReverse == true) {
      data.reverse(function (a, b) {
        var textA = a.brewloc
        var textB = b.brewloc
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      breweryReverse = false;
    }
    else if (breweryReverse == false) {
      data.sort(function (a, b) {
        var textA = a.brewloc
        var textB = b.brewloc
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      breweryReverse = true;
    }
    
    populateTable(data);
  }
  if ($(this).attr("id") == "style") {
    
    if (styleReverse == true) {
      data.reverse(function (a, b) {
        var textA = a.style
        var textB = b.style
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      styleReverse = false;
    }
    else if (styleReverse == false) {
      data.sort(function (a, b) {
        var textA = a.style
        var textB = b.style
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      styleReverse = true;
    }
    
    populateTable(data);
  }

  if ($(this).attr("id") == "distance") {
    
    if (distanceReverse == true) {
      data.reverse(function (a, b) {
        var textA = a.drivingDistance
        
        var textB = b.drivingDistance
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      distanceReverse = false;
    }
    else if (distanceReverse == false) {
      data.sort(function (a, b) {
        var textA = a.drivingDistance
        var textB = b.drivingDistance
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      distanceReverse = true;
    }
    

    populateTable(data);
  }


  
});

//=======================================================================================




$(document).on("click", "#clearroute", function () {
  //console.log("stsuff")
  directionsDisplay.setMap(null);
});