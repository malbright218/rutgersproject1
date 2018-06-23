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
      
      $.ajax({
        url: queryURL,
        method: "POST"
      }).done(function(response) {
      latt = response.location.lat;
      long = response.location.lng;
      initMap();
      });
      



      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: latt, lng: long},
          zoom: 13
        });

        var input = document.getElementById('pac-input');
        console.log(input);
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        
        
        var marker = new google.maps.Marker({
          map: map,
          
          

        });
        marker.addListener('click', function() {
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

      google.maps.event.addListener(markers, 'click', (function(markers, i) {
        return function() {
          infowindow.setContent(data[i].name);
          infowindow.open(map, marker);
        }
      })(markers, i));}
//=======================================================================================
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
            location: place.geometry.location,
            
          });
          marker.setVisible(true);

          infowindowContent.children['place-name'].textContent = place.name;
          infowindowContent.children['place-id'].textContent = place.place_id;
          infowindowContent.children['place-address'].textContent =
              place.formatted_address;
          infowindow.open(map, marker);

          console.log(place);
        });
      }
      
      