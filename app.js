'use strict';
//===========
/////////////Endpoints//////////// -- Refactor these global variables (at some point)*****************
const geoCodingEndpoint = 'https://maps.googleapis.com/maps/api/geocode/json';
const mtbProjectEndpoint = 'https://www.mtbproject.com/data/get-trails';
const wUndergroundEndpoint = 'http://api.wunderground.com/api';
const googleMapstEndpoint = 'https://maps.googleapis.com/maps/api/js';
//=================================================================================
//////////////API Keys////////////
const geoCodingApiKey = 'AIzaSyB05Gh-VXpXhypmBg4R3hzZl8zFxJJYLGQ';
const mtbProjectApiKey = '7039473-9cbb333b7351c6704d04a854df751159';
const wUndergroundApiKey = '9f701de35b137c15';
const googleMapsApiKey = 'AIzaSyCrlS-LQnc7fbdIRMZD5ctvGlYzQo3GyQU';
//=================================================================================
/////////////APP STATE////////////
const STATE = {
  userInput: null,
  address: null,
  latLng: 0,
  latLngFixed: 0,
  lat: 0, 
  lon: 0,
  userLatLng: 0,
  userLat: 0,
  userLon: 0,
  maxDistance: 0,
  maxResults: 0,
  minTrailLength: 0,
  userSortMethod: null,
  wUndergroundSearchType: 'conditions',
  ///////Returned API JSON Data//
  JSONgeoCoding: {},  //refactor these
  JSONmtbProject: null,  // ----------------- When defined here as 'null', this is assignable
  JSONWUnderground: {},  // ----------------- As 'null', this is not assignable.  Only works as {} or [] - why?
  markerCoords: [],
  zoomLevel: 5,
  currentInfoWindow: null
};
//=================================================================================
/////////HTML Generators//////////
function generateLocationInput() {
  let locationInput = `
  
  <form>
    <select class = "userDropDowns" id = "userSearchRadius" name = "searchRadius">
      <option value="5">5 Miles</option> 
      <option value="10">10 Miles</option>
      <option value="25" selected>25 Miles</option>
      <option value="50">50 Miles</option>
    </select>
  </form>
  
  </h4>And with a minimum length of:</h4>

  <form>
    <select class = "userDropDowns" id = "userTrailLength" name = "trailLength">
      <option value="5" selected>5+ Miles</option> 
      <option value="10">10+ Miles</option>
      <option value="25">25+ Miles</option>
      <option value="50">50+ Miles</option>
    </select>
  </form>

  <h4>From:</h4>

  <form>
  <input name="searchTerms" aria-label="search-here" type="text" 
  class="searchTerms" placeholder="Where are you riding?" required="">
  <button aria-label="submit-button" id="js-location-submit-button" type="submit">
    Go!
  </button>
</form>
  `;
  // console.log(locationInput);
  return `${locationInput}`;
}
//=================================================================================
/////////Google Maps Generator//////////
function addMarkers(location, map){
  location.forEach(function(location) {
    var marker = new google.maps.Marker({
      position: location.coords,
      map: map,
      title: location.title
    });
    let infowindow = new google.maps.InfoWindow({ content: location.tooltip });
    marker.addListener('click', function() { 
      if (STATE.currentInfoWindow) {
        STATE.currentInfoWindow.close();
        console.log(STATE.currentInfoWindow);
      }
      infowindow.open(map, marker);
      STATE.currentInfoWindow = infowindow;
    });
  });
}
function initMap(currentLocation, markerLocations) {
  var mapOptions = {
    mapTypeId: 'terrain',
    zoom: STATE.zoomLevel,
    center: currentLocation
  };
  var map = new google.maps.Map(document.getElementById('js-google_map'), mapOptions);
  addMarkers(markerLocations, map);
}
function generateGoogleMap() {
  let weather = STATE.JSONWUnderground;
  let currentLocation = {lat: STATE.lat, lng: STATE.lon};
  let markerLocations = STATE.JSONmtbProject.trails.map(function(trail){
    return {
      title: trail.name,
      coords: {
        lat: trail.latitude,
        lng: trail.longitude
      },
      tooltip: 
        `
        <h2>${trail.name} - ${trail.location}</h2>
        <h4>Description: ${trail.summary}</h4>
        <p>Difficuly: ${trail.difficulty}</p>
        <p>Length: ${trail.length}</p>
        <p>User Rating: ${trail.stars}</p>
        <img src="${trail.imgSmall}" alt="Trail Photo" height="100" width="100"><br>
        <a href="${trail.url}" target = "_blank">MTB Project</a>
        <p>Current Temperature: ${weather.currentConditions.temperature}</p>
        `
    };
  });
  initMap(currentLocation, markerLocations);
  //console.log(markerLocations); //remove this later
}
//=================================================================================
//////////HTML Renderers//////////
function renderSearchForm() {
  let searchForm = generateLocationInput();
  $('.js-searchBox').html(searchForm);
}
function renderGoogleMap() {
  generateGoogleMap();
  // $('#js-google_map').html(googleMapRendered);
}
//=================================================================================
///////Geocoding AJAX Call////////
function getNormalGeoCoding(searchTerm, maxDistance) {
  const settings = {
    url: geoCodingEndpoint,
    data: {
      address: searchTerm,  // ----- refactor by putting ie. url/apiKey directly into functions
      key: geoCodingApiKey
    },
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      STATE.address = data.results['0'].formatted_address;
      STATE.lat = data.results['0'].geometry.location.lat;
      STATE.lon = data.results['0'].geometry.location.lng;
      STATE.latLng = (STATE.lat)+','+(STATE.lon);
      STATE.JSONgeoCoding = data;
      console.log('APP State');
      console.log(STATE);
      console.log('GeoCoding Response');
      console.log(data);
      getMTBproject();
      console.log(maxDistance);
      console.log(searchTerm);
    }
  };
  $.ajax(settings);
}
//=================================================================================
///////MTBProject AJAX Call////////  WORKING!  Update to accept user inputs
function getMTBproject() {
  const settings = {
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
    type: 'GET',
    success: function(data) {
      STATE.JSONmtbProject = data;
      console.log('MTBProject Response');
      console.log(data);
      getWUnderground();
    }
  };
  $.ajax(settings);
}
//=================================================================================
///////WUnderground AJAX Call////////  WORKING! Update to accept user inputs

function getWUnderground() {
  let searchTypes = ['conditions','forecast'];
  const promises = searchTypes.map(function(searchType) {
    return $.ajax({
      url : `${wUndergroundEndpoint}/${wUndergroundApiKey}/${searchType}/q/${STATE.latLng}.json`,
    });
  });

  Promise.all(promises).then(function(results) {
    console.log(results);
    STATE.JSONWUnderground = {
      forecast: {
        temperature: results[1].forecast.simpleforecast.forecastday[0].high.fahrenheit,
      },
      currentConditions: {
        temperature: results[0].current_observation.temp_f,
      }
    };
    renderGoogleMap();
  });
}

// function getWUnderground() {
//   let searchType = [/*'alerts',*/'conditions','forecast'/*,'history','hourly','planner','webcams'*/];
//   for (let i = 0; i<searchType.length; i++) {

//     //Loop provides multiple API calls based on number of active searchType's above.
//     let conditionsURL = `${wUndergroundEndpoint}/${wUndergroundApiKey}`+
//                         `/${searchType[i]}/q/${STATE.latLng}.json`;
//     let conditions = {
//       url : conditionsURL,
//       // jsonp: 'callback',  //What does this do?
//       // dataType : 'jsonp',
//       success : function(weatherData) {
//         STATE.JSONWUnderground.push(weatherData);
//       }
//     };
//     $.ajax(conditions);
//   }
//   console.log('WUnderground Response');
//   console.log(STATE.JSONWUnderground);
//   renderGoogleMap();
// }
//=================================================================================
//////////Event Handlers//////////
function handleUserInputs(){
  renderSearchForm();
  //Listens for user to submit location
  $('.js-searchBox').submit(event => {
    event.preventDefault();
    //update userAnswer in STORE to the user's answer choice
    STATE.userInput = $('input[type=text][name=searchTerms]').val();
    STATE.maxDistance = $('select#userSearchRadius').val();
    STATE.minTrailLength = $('select#userTrailLength').val();
    if ($('select#userSearchRadius').val() === '5') {
      STATE.zoomLevel = 10;
    }
    if ($('select#userSearchRadius').val() === '10') {
      STATE.zoomLevel = 9;    
    }
    if ($('select#userSearchRadius').val() === '25') {
      STATE.zoomLevel = 8;
    }
    if ($('select#userSearchRadius').val() === '50') {
      STATE.zoomLevel = 7;
    }
    getNormalGeoCoding(STATE.userInput, STATE.maxDistance);
  });
}
/////Document Ready Function//////
$(document).ready(handleUserInputs);
//=================================================================================