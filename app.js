'use strict';
/////////////Endpoints////////////
const geoCodingEndpoint = 'https://maps.googleapis.com/maps/api/geocode/json';
const mtbProjectEndpoint = 'https://www.mtbproject.com/data/get-trails';
const wUndergroundEndpoint = 'http://api.wunderground.com/api';
const googleMapstEndpoint = 'https://maps.googleapis.com/maps/api/js';
const GITHUB_SEARCH_URL = 'https://api.github.com/search/repositories';
//==================================================================================================================
//////////////API Keys////////////
const geoCodingApiKey = 'AIzaSyB05Gh-VXpXhypmBg4R3hzZl8zFxJJYLGQ';
const mtbProjectApiKey = '7039473-9cbb333b7351c6704d04a854df751159';
const wUndergroundApiKey = '9f701de35b137c15';
const googleMapsApiKey = 'AIzaSyCrlS-LQnc7fbdIRMZD5ctvGlYzQo3GyQU';
//==================================================================================================================
/////////////APP STATE////////////
let STATE = {
  userInput: '',
  address: '',
  latLng: '',
  latLngFixed: '',
  lat: '',
  lon: '',
  userLatLng: '',
  userLat: '',
  userLon: '',
  maxDistance: '',
  maxResults: '',
  userSortMethod: '',
  wUndergroundSearchType: '',
};
//==================================================================================================================
function generateReverseGeoCoding() {
  let getReverseGeocoding = `${geoCodingEndpoint}latlng=${STATE.userLatLng}&key=${geoCodingApiKey}`;
  // console.log(getReverseGeocoding);
  return getReverseGeocoding;
}
function generateMtbProject() {
  let getMtbProject = 
  `${mtbProjectEndpoint}lat=${STATE.userLat}&lon=${STATE.userLon}&maxDistance=${STATE.maxDistance}&maxResults=${STATE.maxResults}
  &sort=${STATE.userSortMethod}&minLength=${STATE.minTrailLength}&minStars${STATE.minTrailStars}&key=${mtbProjectApiKey}`;
  // console.log(getMtbProject);
  return getMtbProject;
}
function generateWUnderground() {
  let getWUnderground = `${wUndergroundEndpoint}/${wUndergroundApiKey}/${STATE.wUndergroundSearchType}/${STATE.userLatLng}.json`;
  // console.log(getWUnderground);
  return getWUnderground;
}
// function generateGoogleMaps() {
//   let getGoogleMaps = `${googleMapstEndpoint}${googleMapsApiKey}&callback=${initMap}`;
//   // console.log(getGoogleMaps);
//   return getGoogleMaps;
// }
generateReverseGeoCoding();
generateMtbProject();
generateWUnderground();
//==================================================================================================================
/////////HTML Generators//////////
function generateLocationInput() {
  let locationInput = `<form>
  <input name="searchTerms" aria-label="search-here" type="text" class="searchTerms" placeholder="Where are you riding?" required="">
  <button aria-label="submit-button" id="js-location-submit-button" type="submit">Go!</button>
  </form>`;
  // console.log(locationInput);
  return `${locationInput}`;
}
//==================================================================================================================
//////////HTML Renderers//////////
function renderSearchForm() {
  let searchForm = generateLocationInput();
  $('.js-searchBox').html(searchForm);
}
//==================================================================================================================
///////Geocoding AJAX Call////////
function getNormalGeoCoding(searchTerm) {
  const settings = {
    url: geoCodingEndpoint,
    data: {
      address: searchTerm,
      key: geoCodingApiKey
    },
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      STATE.address = data.results['0'].formatted_address;
      STATE.lat = data.results['0'].geometry.location.lat;
      STATE.lon = data.results['0'].geometry.location.lng;
      STATE.latLng = (STATE.lat)+','+(STATE.lon);
      console.log(data);
      console.log(STATE);
    }
  };
  $.ajax(settings);
  getMTBproject();
}
//==================================================================================================================
///////MTBProject AJAX Call////////  WORKING!  Need to update to accept user inputs
function getMTBproject() {
  const settings = {
    url: mtbProjectEndpoint,
    data: {
      lat: 40.5293254,
      lon: -105.1375908,
      maxDistance: 50, //replace with STATE.maxDistance once that's defined by user input
      maxResults: 25, //do same as above
      sort: 'distance', //same....
      minLength: 25, //same...
      minStars: 4, //same...
      key: mtbProjectApiKey
    },
    dataType: 'json',
    type: 'GET',
    success: function(data) {
    console.log(data);
    }
  };
  $.ajax(settings);
}
//==================================================================================================================
//////////Event Handlers//////////
function handleUserInputs(){
  renderSearchForm();
  //Listens for user to submit location
  $('.js-searchBox').on('click', '#js-location-submit-button', event => {
    event.preventDefault();
    //update userAnswer in STORE to the user's answer choice
    STATE.userInput = $('input[type=text][name=searchTerms]').val();
    getNormalGeoCoding(`${STATE.userInput}`);
  });
}
/////Document Ready Function//////
$(document).ready(handleUserInputs);
//==================================================================================================================
//==================================================================================================================