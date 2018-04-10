'use strict';
//================Endpoints================
const geoCodingEndpoint='https://maps.googleapis.com/maps/api/geocode/json';
const mtbProjectEndpoint='https://www.mtbproject.com/data/get-trails';
const openWeatherMapEndpoint='https://api.openweathermap.org/data/2.5/forecast?';
//================API Keys================
const geoCodingApiKey='AIzaSyB05Gh-VXpXhypmBg4R3hzZl8zFxJJYLGQ';
const mtbProjectApiKey='7039473-9cbb333b7351c6704d04a854df751159';
const openWeatherMapApiKey='a1681d336327b175de2ba24ee228b8c5';
//================APP STATE================
const STATE={
  address: null,
  currentInfoWindow: null,
  lat: 0, 
  lon: 0,
  latLng: 0,
  maxDistance: 0,
  maxResults: 0,
  minTrailLength: 0,
  userInput: null,
  userLatLng: 0,
  userLat: 0,
  userLon: 0,
  userRating: 0,
  userSortMethod: null,
  zoomLevel: 5,
  JSONgeoCoding: {},
  JSONmtbProject: null,
  viewPortWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
  JSONopenWeatherMap: null
};
//================GeoCoding API Call================
function getGeoCoding(searchTerm) {
  const settings={
    url: geoCodingEndpoint,
    data: {
      address: searchTerm,  // ----- refactor by putting ie. url/apiKey directly into functions
      key: geoCodingApiKey
    },
    dataType: 'json',
    success: function(data) {
      STATE.address=data.results['0'].formatted_address;
      STATE.lat=data.results['0'].geometry.location.lat;
      STATE.lon=data.results['0'].geometry.location.lng;
      STATE.latLng=(STATE.lat)+','+(STATE.lon);
      STATE.JSONgeoCoding=data;
      getMTBproject();
    },
    error: function() {
      $('.errorMessage').text('Google GeoCoding Error. Please try again later');
    }
  };
  $.ajax(settings);
}
//================MTB Project API Call================
function getMTBproject() {
  const settings={
    url: mtbProjectEndpoint,
    data: {
      lat: STATE.lat,
      lon: STATE.lon,
      maxDistance: STATE.maxDistance, 
      maxResults: 100,
      sort: 'distance',
      minLength: STATE.minTrailLength,
      minStars: STATE.userRating,
      key: mtbProjectApiKey
    },
    dataType: 'json',
    success: function(data) {
      STATE.JSONmtbProject=data;
      getOpenWeatherMap();
    },
    error: function() {
      $('.errorMessage').text('MTB Project API Timeout or Error.  Please try again later');
    }
  };
  $.ajax(settings);
}
//================Open Weather Map API Call================
function getOpenWeatherMap() {
  const settings={
    url: openWeatherMapEndpoint,
    data: {
      lat: STATE.lat,
      lon: STATE.lon,
      APPID: openWeatherMapApiKey,
      units: 'imperial'
    },
    dataType: 'json',
    success: function(data) {
      STATE.JSONopenWeatherMap=data;
      generateGoogleMap();
    },
    error: function() {
      $('.errorMessage').text('Open Weather Map API Timeout or Error. Please try again later');
    }
  };
  $.ajax(settings);
}
//================Google Map Generator================
function initMap(currentLocation, markerLocations) {
  const mapOptions={
    mapTypeId: 'terrain',
    zoom: STATE.zoomLevel,
    center: currentLocation
  };
  const map=new google.maps.Map(document.getElementById('js-google_map'), mapOptions);
  addMarkers(markerLocations, map);
  $('#js-google_map').show();
}
//================Map Marker Generator================
function addMarkers(location, map){
  location.forEach(function(location) {
    const marker=new google.maps.Marker({
      position: location.coords,
      map: map,
      title: location.title
    });
    const infowindow=new google.maps.InfoWindow({
      content: location.infoWindowContent,
      maxWidth: STATE.viewPortWidth*.6
    });
    marker.addListener('click', function() { 
      if (STATE.currentInfoWindow) {
        STATE.currentInfoWindow.close();
      }
      infowindow.open(map, marker);
      STATE.currentInfoWindow=infowindow;
    });
  });
}
//================InfoWindow Generator================
function generateGoogleMap() {
  const weather=STATE.JSONopenWeatherMap;
  const currentLocation={lat: STATE.lat, lng: STATE.lon};
  const markerLocations=STATE.JSONmtbProject.trails.map(function(trail){
    return {
      title: trail.name,
      coords: {
        lat: trail.latitude,
        lng: trail.longitude
      },
      infoWindowContent:
        `<infoWindowContent class="windowWrapper">
          <h2 class="infoWindow"><a href="${trail.url}" target="_blank">${trail.name} - ${trail.location}</a></h2>
          <img class="icon" src="https://openweathermap.org/img/w/${weather.list[0].weather[0].icon}.png" alt="Weather Icon" height="50" width="50">
          <h4 class="infoWindow">Description: ${trail.summary}</h4>
          <img class="thumbnail" src="${trail.imgSmall}" alt="Trail Photo" height="150" width="150">
          <p class="infoWindow">Difficuly: ${trail.difficulty}</p>
          <p class="infoWindow">Length: ${trail.length}</p>
          <p class="infoWindow">User Rating: ${trail.stars}</p>
          <p class="infoWindow">Current Condition: ${weather.list[0].weather[0].description}</p>
          <p class="infoWindow">Current Temperature: ${weather.list[0].main.temp}</p>
          <p class="infoWindow">Daily High: ${weather.list[0].main.temp_max}</p>
          <p class="infoWindow">Daily Low: ${weather.list[0].main.temp_min}</p>
        </infoWindowContent>`
    };
  });
  initMap(currentLocation, markerLocations);
}
//================Event Handler================
function handleUserInputs(){
  $('.main').submit(event => {
    event.preventDefault();
    STATE.userInput=$('input[type=text][name=searchTerms]').val();
    STATE.maxDistance=$('select#userSearchRadius').val();
    STATE.minTrailLength=$('select#userTrailLength').val();
    STATE.userRating=$('select#userRating').val();

    if ($('select#userSearchRadius').val() === '5') {
      STATE.zoomLevel=10;
    }
    if ($('select#userSearchRadius').val() === '10') {
      STATE.zoomLevel=9;    
    }
    if ($('select#userSearchRadius').val() === '25') {
      STATE.zoomLevel=8;
    }
    if ($('select#userSearchRadius').val() === '50') {
      STATE.zoomLevel=8;
    }
    getGeoCoding(STATE.userInput, STATE.maxDistance);
  });
  $( window ).resize(function() {
    event.preventDefault();
    STATE.viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  });
}
//================Document Ready================
$(document).ready(handleUserInputs);