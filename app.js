'use strict';
//================Endpoints================
const geoCodingEndpoint='https://maps.googleapis.com/maps/api/geocode/json';
const mtbProjectEndpoint='https://www.mtbproject.com/data/get-trails';
const wUndergroundEndpoint='http://api.wunderground.com/api';
//================API Keys================
const geoCodingApiKey='AIzaSyB05Gh-VXpXhypmBg4R3hzZl8zFxJJYLGQ';
const mtbProjectApiKey='7039473-9cbb333b7351c6704d04a854df751159';
const wUndergroundApiKey='9f701de35b137c15';
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
  userSortMethod: null,
  zoomLevel: 5,
  JSONgeoCoding: {},
  JSONmtbProject: null,
  jsonWeatherUnderground: {}
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
      maxResults: 25, //replace with user input?
      sort: 'distance', //replace with user input?
      minLength: STATE.minTrailLength,
      minStars: 4, //replace with user input?
      key: mtbProjectApiKey
    },
    dataType: 'json',
    success: function(data) {
      STATE.JSONmtbProject=data;
      getWeatherUnderground();
    }
  };
  $.ajax(settings);
}
//================Weather Underground API Call================
function getWeatherUnderground() {
  const searchTypes=['conditions','forecast'];
  const promises=searchTypes.map(function(searchType) {
    return $.ajax({
      url : `${wUndergroundEndpoint}/${wUndergroundApiKey}/${searchType}/q/${STATE.latLng}.json`,
    });
  });
  Promise.all(promises).then(function(results) {
    STATE.jsonWeatherUnderground={
      currentConditions: {
        temperature: results[0].current_observation.temp_f,
      },
      forecast: {
        tempHigh: results[1].forecast.simpleforecast.forecastday[0].high.fahrenheit,
        tempLow: results[1].forecast.simpleforecast.forecastday[0].low.fahrenheit,
        description: results[1].forecast.simpleforecast.forecastday[0].conditions,
        image: results[1].forecast.simpleforecast.forecastday[0].icon_url
      }
    };
    generateGoogleMap();
  });
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
      maxWidth: 250
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
  const weather=STATE.jsonWeatherUnderground;
  const currentLocation={lat: STATE.lat, lng: STATE.lon};
  const markerLocations=STATE.JSONmtbProject.trails.map(function(trail){
    return {
      title: trail.name,
      coords: {
        lat: trail.latitude,
        lng: trail.longitude
      },
      infoWindowContent:
        `<div class="windowWrapper">
          <h2 class="infoWindow"><a href="${trail.url}" target="_blank">${trail.name} - ${trail.location}</a></h2>
          <img class="icon" src="${weather.forecast.image}" alt="Weather Icon" height="50" width="50">
          <h4 class="infoWindow">Description: ${trail.summary}</h4>
          <p class="infoWindow">Difficuly: ${trail.difficulty}</p>
          <p class="infoWindow">Length: ${trail.length}</p>
          <p class="infoWindow">User Rating: ${trail.stars}</p>
          <img class="thumbnail" src="${trail.imgSmall}" alt="Trail Photo" height="150" width="150">
          <p class="infoWindow">Current Condition: ${weather.forecast.description}</p>
          <p class="infoWindow">Current Temperature: ${weather.currentConditions.temperature}</p>
          <p class="infoWindow">Daily High: ${weather.forecast.tempHigh}</p>
          <p class="infoWindow">Daily Low: ${weather.forecast.tempLow}</p>
        </div>`
    };
  });
  initMap(currentLocation, markerLocations);
}
//================Event Handler================
function handleUserInputs(){
  $('.js-searchBox').submit(event => {
    event.preventDefault();
    //update userAnswer in STORE to the user's answer choice
    STATE.userInput=$('input[type=text][name=searchTerms]').val();
    STATE.maxDistance=$('select#userSearchRadius').val();
    STATE.minTrailLength=$('select#userTrailLength').val();
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
}
//================Document Ready================
$(document).ready(handleUserInputs);