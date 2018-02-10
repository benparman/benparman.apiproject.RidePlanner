'use strict';

/////////////Endpoints////////////
const geoCodingEndpoint = 'https://maps.googleapis.com/maps/api/geocode/json?';
const mtbProjectEndpoint = 'https://www.mtbproject.com/data/get-trails?';
const wUndergroundEndpoint = 'http://api.wunderground.com/api';
const googleMapstEndpoint = 'https://maps.googleapis.com/maps/api/js?';
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
  address: '',
  latLng: '40.538143, -105.166141',
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

////STATE Coordinate Generator////
function genCoordinates() {
  let origCoordinates = STATE.latLng;
  STATE.latLngFixed = origCoordinates.replace(/\s/g, '');
  let splitCoordinates = STATE.latLngFixed.split(',');
  STATE.lat = splitCoordinates[0];
  STATE.lon = splitCoordinates[1];
  // console.log(STATE);
}
//==================================================================================================================

////Get Request URL Generators////
function getRequestGenerator() {
  // function generateNormalGeoCoding() {
  //   let getNormalGeoCoding = `${geoCodingEndpoint}address=${STATE.address}&key=${geoCodingApiKey}`;
  //   console.log(getNormalGeoCoding);
  //   return getNormalGeoCoding;
  // }
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
  function generateGoogleMaps() {
    let getGoogleMaps = `${googleMapstEndpoint}${googleMapsApiKey}&callback=${initMap}`;
    // console.log(getGoogleMaps);
    return getGoogleMaps;
  }
  // generateNormalGeoCoding();
  generateReverseGeoCoding();
  generateMtbProject();
  generateWUnderground();
  generateGoogleMaps();
}
//==================================================================================================================

//////////////////////////////////
/////Google Maps API Functions////
//!!!!!!!!DO NOT MODIFY!!!!!!!!!//
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 38.260954, lng: -106.904460},
    mapTypeId: 'terrain'
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: map
  });
}
//!!!!!!!!DO NOT MODIFY!!!!!!!!!//
//==================================================================================================================

//////////////////////////////////
/////////HTML Generators//////////
//////////////////////////////////

//State List Dropdown generator///
function generateStateList() {
  let stateContent = `<form>
  <select>
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    <option value="AR">Arkansas</option>
    <option value="CA">California</option>
    <option value="CO">Colorado</option>
    <option value="CT">Connecticut</option>
    <option value="DE">Delaware</option>
    <option value="DC">District Of Columbia</option>
    <option value="FL">Florida</option>
    <option value="GA">Georgia</option>
    <option value="HI">Hawaii</option>
    <option value="ID">Idaho</option>
    <option value="IL">Illinois</option>
    <option value="IN">Indiana</option>
    <option value="IA">Iowa</option>
    <option value="KS">Kansas</option>
    <option value="KY">Kentucky</option>
    <option value="LA">Louisiana</option>
    <option value="ME">Maine</option>
    <option value="MD">Maryland</option>
    <option value="MA">Massachusetts</option>
    <option value="MI">Michigan</option>
    <option value="MN">Minnesota</option>
    <option value="MS">Mississippi</option>
    <option value="MO">Missouri</option>
    <option value="MT">Montana</option>
    <option value="NE">Nebraska</option>
    <option value="NV">Nevada</option>
    <option value="NH">New Hampshire</option>
    <option value="NJ">New Jersey</option>
    <option value="NM">New Mexico</option>
    <option value="NY">New York</option>
    <option value="NC">North Carolina</option>
    <option value="ND">North Dakota</option>
    <option value="OH">Ohio</option>
    <option value="OK">Oklahoma</option>
    <option value="OR">Oregon</option>
    <option value="PA">Pennsylvania</option>
    <option value="RI">Rhode Island</option>
    <option value="SC">South Carolina</option>
    <option value="SD">South Dakota</option>
    <option value="TN">Tennessee</option>
    <option value="TX">Texas</option>
    <option value="UT">Utah</option>
    <option value="VT">Vermont</option>
    <option value="VA">Virginia</option>
    <option value="WA">Washington</option>
    <option value="WV">West Virginia</option>
    <option value="WI">Wisconsin</option>
    <option value="WY">Wyoming</option>
  </select>	
</form>`;
  return `${stateContent}`;
}

function generateLocationInput() {
  let locationInput = `<form>
  <input name="searchTerms" aria-label="search-here" type="text" class="searchTerms" placeholder="Where are you riding?" required="">
  <button aria-label="submit-button" class="submit-button" type="submit">Go!</button>
  </form>`;
  // console.log(locationInput);
  return `${locationInput}`;
}
//==================================================================================================================

//////////////////////////////////
//////////HTML Renderers//////////
//////////////////////////////////
function renderStateList() {
  let stateList = generateStateList();
  $('.js-forms').html(stateList);
}
function renderSearchForm() {
  let searchForm = generateLocationInput();
  $('.js-searchBox').html(searchForm);
}
//==================================================================================================================

//////////////////////////////////
//Code Povided by gMaps API Docs//
//!!!!!!!!DO NOT MODIFY!!!!!!!!!//
//////////////////////////////////
var map, heatmap;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 39.460608, lng: -105.126029},
    mapTypeId: 'terrain'
  });
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: map
  });
}
function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}
function changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ];
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}
function changeRadius() {
  heatmap.set('radius', heatmap.get('radius') ? null : 5);
}
function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 500);
}
// Heatmap data: Replaced with my CTR Track Data
function getPoints() {
  return [
    new google.maps.LatLng(39.4911030, -105.0936580),
    new google.maps.LatLng(39.4910870, -105.0936750),
    new google.maps.LatLng(39.4910120, -105.0938810),
    new google.maps.LatLng(39.4909320, -105.0939860),
    new google.maps.LatLng(39.4908940, -105.0941790),
    new google.maps.LatLng(39.4909080, -105.0941960),
    new google.maps.LatLng(39.4909270, -105.0942180),
    new google.maps.LatLng(39.4909470, -105.0942400),
    new google.maps.LatLng(39.4909710, -105.0942600),
    new google.maps.LatLng(39.4909980, -105.0942780),
    new google.maps.LatLng(39.4910280, -105.0942920),
    new google.maps.LatLng(39.4910600, -105.0943040),
    new google.maps.LatLng(39.4912310, -105.0944290),
    new google.maps.LatLng(39.4912630, -105.0946480),
    new google.maps.LatLng(39.4912390, -105.0948050),
    new google.maps.LatLng(39.4912490, -105.0950130),
    new google.maps.LatLng(39.4912660, -105.0950610),
    new google.maps.LatLng(39.4912800, -105.0951110),
    new google.maps.LatLng(39.4912850, -105.0951670),
    new google.maps.LatLng(39.4912830, -105.0952140),
    new google.maps.LatLng(39.4912770, -105.0952640),
    new google.maps.LatLng(39.4912700, -105.0953120),
    new google.maps.LatLng(39.4911960, -105.0955400),
    new google.maps.LatLng(39.4909950, -105.0958680),
    new google.maps.LatLng(39.4907590, -105.0962030),
    new google.maps.LatLng(39.4904150, -105.0966250),
    new google.maps.LatLng(39.4900540, -105.0968710),
    new google.maps.LatLng(39.4896620, -105.0970310),
    new google.maps.LatLng(39.4896160, -105.0970500),
    new google.maps.LatLng(39.4895300, -105.0970760),
    new google.maps.LatLng(39.4891390, -105.0971920),
    new google.maps.LatLng(39.4886880, -105.0973420),
    new google.maps.LatLng(39.4882520, -105.0975440),
    new google.maps.LatLng(39.4878900, -105.0978870),
    new google.maps.LatLng(39.4876720, -105.0981380),
    new google.maps.LatLng(39.4874130, -105.0985690),
    new google.maps.LatLng(39.4872230, -105.0990250),
    new google.maps.LatLng(39.4871590, -105.0992000),
    new google.maps.LatLng(39.4871380, -105.0992600),
    new google.maps.LatLng(39.4869810, -105.0998260),
    new google.maps.LatLng(39.4869700, -105.0998920),
    new google.maps.LatLng(39.4869570, -105.0999690),
    new google.maps.LatLng(39.4869510, -105.1000260),
    new google.maps.LatLng(39.4869430, -105.1000930),
    new google.maps.LatLng(39.4868790, -105.1007030),
    new google.maps.LatLng(39.4868090, -105.1012750),
    new google.maps.LatLng(39.4866960, -105.1019080),
    new google.maps.LatLng(39.4865590, -105.1025280),
    new google.maps.LatLng(39.4864790, -105.1028170),
    new google.maps.LatLng(39.4863220, -105.1033080),
    new google.maps.LatLng(39.4862900, -105.1034180),
    new google.maps.LatLng(39.4862730, -105.1034730),
    new google.maps.LatLng(39.4860710, -105.1039900),
    new google.maps.LatLng(39.4858330, -105.1045650),
    new google.maps.LatLng(39.4855410, -105.1052970),
    new google.maps.LatLng(39.4855270, -105.1053360),
    new google.maps.LatLng(39.4851720, -105.1062600),
    new google.maps.LatLng(39.4849710, -105.1069340),
    new google.maps.LatLng(39.4848270, -105.1074600),
    new google.maps.LatLng(39.4846780, -105.1080400),
    new google.maps.LatLng(39.4845250, -105.1085530),
    new google.maps.LatLng(39.4844150, -105.1088690),
    new google.maps.LatLng(39.4841750, -105.1095390),
    new google.maps.LatLng(39.4839930, -105.1099750),
    new google.maps.LatLng(39.4838110, -105.1105660),
    new google.maps.LatLng(39.4837630, -105.1109730),
    new google.maps.LatLng(39.4837650, -105.1111120),
    new google.maps.LatLng(39.4838180, -105.1117370),
    new google.maps.LatLng(39.4838960, -105.1123770),
    new google.maps.LatLng(39.4839300, -105.1125500),
    new google.maps.LatLng(39.4839780, -105.1127380),
    new google.maps.LatLng(39.4842110, -105.1132070),
    new google.maps.LatLng(39.4846080, -105.1136320),
    new google.maps.LatLng(39.4849740, -105.1140000),
    new google.maps.LatLng(39.4850200, -105.1140360),
    new google.maps.LatLng(39.4853700, -105.1142710),
    new google.maps.LatLng(39.4856860, -105.1143860),
    new google.maps.LatLng(39.4857360, -105.1144160),
    new google.maps.LatLng(39.4858860, -105.1145140),
    new google.maps.LatLng(39.4859290, -105.1145590),
    new google.maps.LatLng(39.4860110, -105.1146590),
    new google.maps.LatLng(39.4860420, -105.1147190),
    new google.maps.LatLng(39.4860670, -105.1147800),
    new google.maps.LatLng(39.4861530, -105.1152570),
    new google.maps.LatLng(39.4861140, -105.1158200),
    new google.maps.LatLng(39.4860210, -105.1161660),
    new google.maps.LatLng(39.4859960, -105.1162410),
    new google.maps.LatLng(39.4858820, -105.1166660),
    new google.maps.LatLng(39.4857220, -105.1173160),
    new google.maps.LatLng(39.4856310, -105.1175610),
    new google.maps.LatLng(39.4855330, -105.1177300),
    new google.maps.LatLng(39.4852890, -105.1180190),
    new google.maps.LatLng(39.4852480, -105.1180660),
    new google.maps.LatLng(39.4848370, -105.1183940),
    new google.maps.LatLng(39.4845330, -105.1184870),
    new google.maps.LatLng(39.4841540, -105.1184330),
    new google.maps.LatLng(39.4837360, -105.1183120),
    new google.maps.LatLng(39.4836840, -105.1183130),
    new google.maps.LatLng(39.4836310, -105.1183210),
    new google.maps.LatLng(39.4832030, -105.1184210),
    new google.maps.LatLng(39.4830490, -105.1184220),
    new google.maps.LatLng(39.4830000, -105.1184100),
    new google.maps.LatLng(39.4829030, -105.1183780),
    new google.maps.LatLng(39.4828560, -105.1183520),
    new google.maps.LatLng(39.4828100, -105.1183250),
    new google.maps.LatLng(39.4826730, -105.1182230),
    new google.maps.LatLng(39.4826350, -105.1181790),
    new google.maps.LatLng(39.4825390, -105.1180210),
    new google.maps.LatLng(39.4824660, -105.1178380),
    new google.maps.LatLng(39.4824090, -105.1175970),
    new google.maps.LatLng(39.4822780, -105.1170540),
    new google.maps.LatLng(39.4822260, -105.1169430),
    new google.maps.LatLng(39.4821610, -105.1168430),
    new google.maps.LatLng(39.4821260, -105.1168010),
    new google.maps.LatLng(39.4820880, -105.1167630),
    new google.maps.LatLng(39.4820470, -105.1167310),
    new google.maps.LatLng(39.4820030, -105.1167070),
    new google.maps.LatLng(39.4819570, -105.1166880),
    new google.maps.LatLng(39.4819130, -105.1166750),
    new google.maps.LatLng(39.4818670, -105.1166650),
    new google.maps.LatLng(39.4818170, -105.1166600),
    new google.maps.LatLng(39.4817680, -105.1166600),
    new google.maps.LatLng(39.4817180, -105.1166650),
    new google.maps.LatLng(39.4816700, -105.1166760),
    new google.maps.LatLng(39.4816220, -105.1166880),
    new google.maps.LatLng(39.4815740, -105.1167070),
    new google.maps.LatLng(39.4815260, -105.1167310),
    new google.maps.LatLng(39.4814780, -105.1167630),
    new google.maps.LatLng(39.4814330, -105.1168020),
    new google.maps.LatLng(39.4813910, -105.1168450),
    new google.maps.LatLng(39.4813510, -105.1168910),
    new google.maps.LatLng(39.4810800, -105.1173170),
    new google.maps.LatLng(39.4808820, -105.1177560),
    new google.maps.LatLng(39.4807000, -105.1182610),
    new google.maps.LatLng(39.4805380, -105.1188690),
    new google.maps.LatLng(39.4805180, -105.1189410),
    new google.maps.LatLng(39.4805090, -105.1190110),
    new google.maps.LatLng(39.4805120, -105.1190810),
    new google.maps.LatLng(39.4805230, -105.1191510),
    new google.maps.LatLng(39.4805370, -105.1192210),
    new google.maps.LatLng(39.4805900, -105.1194230),
    new google.maps.LatLng(39.4806160, -105.1194840),
    new google.maps.LatLng(39.4806470, -105.1195420),
    new google.maps.LatLng(39.4806820, -105.1195960),
    new google.maps.LatLng(39.4807210, -105.1196500),
    new google.maps.LatLng(39.4807620, -105.1196990),
    new google.maps.LatLng(39.4808040, -105.1197480),
    new google.maps.LatLng(39.4811560, -105.1201040),
    new google.maps.LatLng(39.4811990, -105.1201470),
    new google.maps.LatLng(39.4812420, -105.1201920),
    new google.maps.LatLng(39.4816400, -105.1206010),
    new google.maps.LatLng(39.4816620, -105.1206560),
    new google.maps.LatLng(39.4816840, -105.1207180),
    new google.maps.LatLng(39.4817300, -105.1208500),
    new google.maps.LatLng(39.4817460, -105.1209120),
    new google.maps.LatLng(39.4817690, -105.1210330),
    new google.maps.LatLng(39.4817700, -105.1213590),
    new google.maps.LatLng(39.4816210, -105.1217920),
    new google.maps.LatLng(39.4813360, -105.1222350),
    new google.maps.LatLng(39.4809400, -105.1227740),
    new google.maps.LatLng(39.4804700, -105.1232830),
    new google.maps.LatLng(39.4801230, -105.1237160),
    new google.maps.LatLng(39.4800560, -105.1238220),
    new google.maps.LatLng(39.4797740, -105.1243570),
    new google.maps.LatLng(39.4794290, -105.1250140),
    new google.maps.LatLng(39.4791120, -105.1256310),
    new google.maps.LatLng(39.4789790, -105.1258750),
    new google.maps.LatLng(39.4789390, -105.1259400),
    new google.maps.LatLng(39.4786640, -105.1264670),
    new google.maps.LatLng(39.4784220, -105.1269280),
    new google.maps.LatLng(39.4783860, -105.1269930),
    new google.maps.LatLng(39.4783470, -105.1270580),
    new google.maps.LatLng(39.4780710, -105.1276490),
    new google.maps.LatLng(39.4777810, -105.1282190),
    new google.maps.LatLng(39.4777460, -105.1282720),
    new google.maps.LatLng(39.4774450, -105.1285790),
    new google.maps.LatLng(39.4771270, -105.1287590),
    new google.maps.LatLng(39.4770210, -105.1287900),
    new google.maps.LatLng(39.4769690, -105.1287970),
    new google.maps.LatLng(39.4766450, -105.1288390),
    new google.maps.LatLng(39.4761250, -105.1289130),
    new google.maps.LatLng(39.4756870, -105.1290840),
    new google.maps.LatLng(39.4756130, -105.1291260),
    new google.maps.LatLng(39.4752730, -105.1293570),
    new google.maps.LatLng(39.4748890, -105.1296620),
    new google.maps.LatLng(39.4746580, -105.1298440),
    new google.maps.LatLng(39.4741800, -105.1302230),
    new google.maps.LatLng(39.4737230, -105.1306070),
    new google.maps.LatLng(39.4733740, -105.1310700),
    new google.maps.LatLng(39.4730560, -105.1317060),
    new google.maps.LatLng(39.4727080, -105.1324970),
    new google.maps.LatLng(39.4725140, -105.1330180),
    new google.maps.LatLng(39.4723410, -105.1335250),
    new google.maps.LatLng(39.4721560, -105.1339150),
    new google.maps.LatLng(39.4719740, -105.1342240),
    new google.maps.LatLng(39.4716810, -105.1345890),
    new google.maps.LatLng(39.4713740, -105.1349290),
    new google.maps.LatLng(39.4710070, -105.1352310),
    new google.maps.LatLng(39.4706900, -105.1353190),
    new google.maps.LatLng(39.4704320, -105.1352840),
    new google.maps.LatLng(39.4704060, -105.1352650),
    new google.maps.LatLng(39.4701240, -105.1350670),
    new google.maps.LatLng(39.4698220, -105.1347390),
    new google.maps.LatLng(39.4694020, -105.1343630),
    new google.maps.LatLng(39.4689810, -105.1340750),
    new google.maps.LatLng(39.4689320, -105.1340490),
    new google.maps.LatLng(39.4684390, -105.1337440),
    new google.maps.LatLng(39.4683900, -105.1337080),
    new google.maps.LatLng(39.4680040, -105.1333280),
    new google.maps.LatLng(39.4674800, -105.1329230),
    new google.maps.LatLng(39.4674260, -105.1329080),
    new google.maps.LatLng(39.4673710, -105.1329020),
    new google.maps.LatLng(39.4673170, -105.1329040),
    new google.maps.LatLng(39.4672610, -105.1329160),
    new google.maps.LatLng(39.4672060, -105.1329390),
    new google.maps.LatLng(39.4671550, -105.1329730),
    new google.maps.LatLng(39.4671050, -105.1330120),
    new google.maps.LatLng(39.4667070, -105.1333570),
    new google.maps.LatLng(39.4664250, -105.1335200),
    new google.maps.LatLng(39.4663630, -105.1335380),
    new google.maps.LatLng(39.4663040, -105.1335480),
    new google.maps.LatLng(39.4662410, -105.1335550),
    new google.maps.LatLng(39.4661790, -105.1335570),
    new google.maps.LatLng(39.4661240, -105.1335540),
    new google.maps.LatLng(39.4660700, -105.1335470),
    new google.maps.LatLng(39.4655840, -105.1334180),
    new google.maps.LatLng(39.4649260, -105.1331840),
    new google.maps.LatLng(39.4648190, -105.1331450),
    new google.maps.LatLng(39.4647660, -105.1331240),
    new google.maps.LatLng(39.4647140, -105.1331030),
    new google.maps.LatLng(39.4641230, -105.1328780),
    new google.maps.LatLng(39.4637230, -105.1328880),
    new google.maps.LatLng(39.4632090, -105.1330390),
    new google.maps.LatLng(39.4627620, -105.1331600),
    new google.maps.LatLng(39.4627040, -105.1331710),
    new google.maps.LatLng(39.4626440, -105.1331820),
    new google.maps.LatLng(39.4624770, -105.1331920),
    new google.maps.LatLng(39.4619230, -105.1331100),
    new google.maps.LatLng(39.4614890, -105.1329280),
    new google.maps.LatLng(39.4611910, -105.1327210),
    new google.maps.LatLng(39.4611470, -105.1326810),
    new google.maps.LatLng(39.4606730, -105.1322810),
    new google.maps.LatLng(39.4603360, -105.1319040),
    new google.maps.LatLng(39.4600680, -105.1315150),
    new google.maps.LatLng(39.4597490, -105.1309860),
    new google.maps.LatLng(39.4594130, -105.1304780),
    new google.maps.LatLng(39.4592790, -105.1302380),
    new google.maps.LatLng(39.4591150, -105.1298660),
    new google.maps.LatLng(39.4590400, -105.1296150),
    new google.maps.LatLng(39.4590190, -105.1295580),
    new google.maps.LatLng(39.4589930, -105.1295010),
    new google.maps.LatLng(39.4587630, -105.1290080),
    new google.maps.LatLng(39.4587400, -105.1289410),
    new google.maps.LatLng(39.4587140, -105.1288790),
    new google.maps.LatLng(39.4585640, -105.1285080),
    new google.maps.LatLng(39.4583450, -105.1280790),
    new google.maps.LatLng(39.4583080, -105.1280340),
    new google.maps.LatLng(39.4582830, -105.1279790),
    new google.maps.LatLng(39.4581640, -105.1276910),
    new google.maps.LatLng(39.4581400, -105.1276330),
    new google.maps.LatLng(39.4579440, -105.1271140),
    new google.maps.LatLng(39.4578050, -105.1268200),
    new google.maps.LatLng(39.4574800, -105.1263180),
    new google.maps.LatLng(39.4574170, -105.1262070),
    new google.maps.LatLng(39.4570400, -105.1255290),
    new google.maps.LatLng(39.4566940, -105.1250800),
    new google.maps.LatLng(39.4563120, -105.1247900),
    new google.maps.LatLng(39.4558990, -105.1244750),
    new google.maps.LatLng(39.4555550, -105.1241620),
    new google.maps.LatLng(39.4552650, -105.1239150),
    new google.maps.LatLng(39.4548340, -105.1236800),
    new google.maps.LatLng(39.4545530, -105.1235830),
    new google.maps.LatLng(39.4545090, -105.1235710),
    new google.maps.LatLng(39.4541330, -105.1235140),
    new google.maps.LatLng(39.4538740, -105.1234900),
    new google.maps.LatLng(39.4538200, -105.1234880),
    new google.maps.LatLng(39.4534570, -105.1234620),
    new google.maps.LatLng(39.4529690, -105.1233840),
    new google.maps.LatLng(39.4524500, -105.1232430),
    new google.maps.LatLng(39.4522150, -105.1231590),
    new google.maps.LatLng(39.4517740, -105.1229540),
    new google.maps.LatLng(39.4513780, -105.1227700),
    new google.maps.LatLng(39.4508380, -105.1225990),
    new google.maps.LatLng(39.4506640, -105.1225810),
    new google.maps.LatLng(39.4505850, -105.1225780),
    new google.maps.LatLng(39.4503200, -105.1225710),
    new google.maps.LatLng(39.4502450, -105.1225790),
    new google.maps.LatLng(39.4501980, -105.1225830),
    new google.maps.LatLng(39.4498970, -105.1226770),
    new google.maps.LatLng(39.4495850, -105.1229610),
    new google.maps.LatLng(39.4494330, -105.1230840),
    new google.maps.LatLng(39.4493900, -105.1231090),
    new google.maps.LatLng(39.4493020, -105.1231470),
    new google.maps.LatLng(39.4492100, -105.1231680),
    new google.maps.LatLng(39.4491620, -105.1231700),
    new google.maps.LatLng(39.4491160, -105.1231670),
    new google.maps.LatLng(39.4490680, -105.1231560),
    new google.maps.LatLng(39.4490220, -105.1231380),
    new google.maps.LatLng(39.4489800, -105.1231140),
    new google.maps.LatLng(39.4489380, -105.1230810),
    new google.maps.LatLng(39.4488990, -105.1230430),
    new google.maps.LatLng(39.4485930, -105.1227250),
    new google.maps.LatLng(39.4484560, -105.1226350),
    new google.maps.LatLng(39.4483090, -105.1225780),
    new google.maps.LatLng(39.4482590, -105.1225700),
    new google.maps.LatLng(39.4480170, -105.1225780),
    new google.maps.LatLng(39.4479260, -105.1226100),
    new google.maps.LatLng(39.4478360, -105.1226600),
    new google.maps.LatLng(39.4477070, -105.1227630),
    new google.maps.LatLng(39.4475930, -105.1228930),
    new google.maps.LatLng(39.4473480, -105.1232110),
    new google.maps.LatLng(39.4472700, -105.1232800),
    new google.maps.LatLng(39.4471860, -105.1233370),
    new google.maps.LatLng(39.4471400, -105.1233570),
    new google.maps.LatLng(39.4470920, -105.1233720),
    new google.maps.LatLng(39.4470450, -105.1233840),
    new google.maps.LatLng(39.4469960, -105.1233910),
    new google.maps.LatLng(39.4469470, -105.1233950),
    new google.maps.LatLng(39.4465040, -105.1233900),
    new google.maps.LatLng(39.4460400, -105.1234320),
    new google.maps.LatLng(39.4455490, -105.1235100),
    new google.maps.LatLng(39.4451990, -105.1236200),
    new google.maps.LatLng(39.4451550, -105.1236420),
    new google.maps.LatLng(39.4447310, -105.1238840),
    new google.maps.LatLng(39.4443030, -105.1241290),
    new google.maps.LatLng(39.4438280, -105.1243290),
    new google.maps.LatLng(39.4434900, -105.1244050),
    new google.maps.LatLng(39.4433890, -105.1244050),
    new google.maps.LatLng(39.4431460, -105.1243720),
    new google.maps.LatLng(39.4430970, -105.1243580),
    new google.maps.LatLng(39.4427650, -105.1243200),
    new google.maps.LatLng(39.4427160, -105.1243300),
    new google.maps.LatLng(39.4426670, -105.1243440),
    new google.maps.LatLng(39.4426190, -105.1243650),
    new google.maps.LatLng(39.4425730, -105.1243900),
    new google.maps.LatLng(39.4425280, -105.1244170),
    new google.maps.LatLng(39.4421520, -105.1247230),
    new google.maps.LatLng(39.4418300, -105.1251060),
    new google.maps.LatLng(39.4414880, -105.1253160),
    new google.maps.LatLng(39.4410530, -105.1255070),
    new google.maps.LatLng(39.4408260, -105.1256010),
    new google.maps.LatLng(39.4406060, -105.1256910),
    new google.maps.LatLng(39.4405560, -105.1257200),
    new google.maps.LatLng(39.4401590, -105.1258630),
    new google.maps.LatLng(39.4399810, -105.1259120),
    new google.maps.LatLng(39.4396170, -105.1258790),
    new google.maps.LatLng(39.4391510, -105.1257660),
    new google.maps.LatLng(39.4389270, -105.1256670),
    new google.maps.LatLng(39.4388820, -105.1256430),
    new google.maps.LatLng(39.4388400, -105.1256150),
    new google.maps.LatLng(39.4382890, -105.1252570),
    new google.maps.LatLng(39.4377970, -105.1250100),
    new google.maps.LatLng(39.4374850, -105.1248660),
    new google.maps.LatLng(39.4370220, -105.1247690),
    new google.maps.LatLng(39.4364490, -105.1246950),
    new google.maps.LatLng(39.4363000, -105.1246370),
    new google.maps.LatLng(39.4362560, -105.1246090),
    new google.maps.LatLng(39.4362130, -105.1245770),
    new google.maps.LatLng(39.4361690, -105.1245460),
    new google.maps.LatLng(39.4361260, -105.1245110),
    new google.maps.LatLng(39.4356920, -105.1240910),
    new google.maps.LatLng(39.4352690, -105.1236700),
    new google.maps.LatLng(39.4350000, -105.1233800),
    new google.maps.LatLng(39.4347930, -105.1230930),
    new google.maps.LatLng(39.4347650, -105.1230510),
    new google.maps.LatLng(39.4347420, -105.1230070),
    new google.maps.LatLng(39.4346580, -105.1228300),
    new google.maps.LatLng(39.4346330, -105.1227880),
    new google.maps.LatLng(39.4346150, -105.1227440),
    new google.maps.LatLng(39.4344650, -105.1223820),
    new google.maps.LatLng(39.4344090, -105.1222790),
    new google.maps.LatLng(39.4343780, -105.1222500),
    new google.maps.LatLng(39.4343560, -105.1222190),
    new google.maps.LatLng(39.4343230, -105.1221560),
    new google.maps.LatLng(39.4342640, -105.1220110),
    new google.maps.LatLng(39.4342370, -105.1219860),
    new google.maps.LatLng(39.4342150, -105.1219590),
    new google.maps.LatLng(39.4341960, -105.1219260),
    new google.maps.LatLng(39.4341760, -105.1218990),
    new google.maps.LatLng(39.4341660, -105.1218570),
    new google.maps.LatLng(39.4341460, -105.1218290),
    new google.maps.LatLng(39.4341180, -105.1218100),
    new google.maps.LatLng(39.4341000, -105.1217800),
    new google.maps.LatLng(39.4340910, -105.1217420),
    new google.maps.LatLng(39.4340790, -105.1217070),
    new google.maps.LatLng(39.4339870, -105.1214230),
    new google.maps.LatLng(39.4338690, -105.1211180),
    new google.maps.LatLng(39.4336660, -105.1207810),
    new google.maps.LatLng(39.4334480, -105.1206520),
    new google.maps.LatLng(39.4332340, -105.1206950),
    new google.maps.LatLng(39.4329570, -105.1207350),
    new google.maps.LatLng(39.4326820, -105.1206380),
    new google.maps.LatLng(39.4324560, -105.1204140),
    new google.maps.LatLng(39.4323190, -105.1202540),
    new google.maps.LatLng(39.4320690, -105.1201430),
    new google.maps.LatLng(39.4318670, -105.1200840),
    new google.maps.LatLng(39.4316440, -105.1199770),
    new google.maps.LatLng(39.4314700, -105.1198270),
    new google.maps.LatLng(39.4313670, -105.1197030),
    new google.maps.LatLng(39.4313590, -105.1196740),
    new google.maps.LatLng(39.4313440, -105.1196520),
    new google.maps.LatLng(39.4313280, -105.1196310),
    new google.maps.LatLng(39.4313130, -105.1196080),
    new google.maps.LatLng(39.4312860, -105.1195650),
    new google.maps.LatLng(39.4312710, -105.1195430),
    new google.maps.LatLng(39.4312200, -105.1193220),
    new google.maps.LatLng(39.4311450, -105.1191490),
    new google.maps.LatLng(39.4310030, -105.1190080),
    new google.maps.LatLng(39.4308100, -105.1188990),
    new google.maps.LatLng(39.4306070, -105.1188960),
    new google.maps.LatLng(39.4304500, -105.1188480),
    new google.maps.LatLng(39.4302720, -105.1188620),
    new google.maps.LatLng(39.4301570, -105.1189260),
    new google.maps.LatLng(39.4300110, -105.1189440),
    new google.maps.LatLng(39.4298440, -105.1189210),
    new google.maps.LatLng(39.4296920, -105.1190200),
    new google.maps.LatLng(39.4295870, -105.1191480),
    new google.maps.LatLng(39.4294820, -105.1192780),
    new google.maps.LatLng(39.4293390, -105.1193020),
    new google.maps.LatLng(39.4291630, -105.1193170),
    new google.maps.LatLng(39.4290130, -105.1194740),
    new google.maps.LatLng(39.4288970, -105.1195490),
    new google.maps.LatLng(39.4287580, -105.1196020),
    new google.maps.LatLng(39.4287140, -105.1196350),
    new google.maps.LatLng(39.4286970, -105.1196390),
    new google.maps.LatLng(39.4285680, -105.1195910),
    new google.maps.LatLng(39.4285620, -105.1195790),
    new google.maps.LatLng(39.4285510, -105.1195680),
    new google.maps.LatLng(39.4285380, -105.1195560),
    new google.maps.LatLng(39.4285250, -105.1195420),
    new google.maps.LatLng(39.4285100, -105.1195320),
    new google.maps.LatLng(39.4284930, -105.1195260),
    new google.maps.LatLng(39.4284540, -105.1195050),
    new google.maps.LatLng(39.4284420, -105.1195010),
    new google.maps.LatLng(39.4282950, -105.1194520),
    new google.maps.LatLng(39.4281600, -105.1193660),
    new google.maps.LatLng(39.4279790, -105.1192820),
    new google.maps.LatLng(39.4278360, -105.1193220),
    new google.maps.LatLng(39.4278220, -105.1193470),
    new google.maps.LatLng(39.4278090, -105.1193780),
    new google.maps.LatLng(39.4278000, -105.1194100),
    new google.maps.LatLng(39.4277910, -105.1194410),
    new google.maps.LatLng(39.4277780, -105.1194720),
    new google.maps.LatLng(39.4277580, -105.1194960),
    new google.maps.LatLng(39.4277360, -105.1195030),
    new google.maps.LatLng(39.4277070, -105.1194890),
    new google.maps.LatLng(39.4276810, -105.1194570),
    new google.maps.LatLng(39.4276530, -105.1194220),
    new google.maps.LatLng(39.4276170, -105.1194000),
    new google.maps.LatLng(39.4275780, -105.1194100),
    new google.maps.LatLng(39.4275400, -105.1194350),
    new google.maps.LatLng(39.4275040, -105.1194650),
    new google.maps.LatLng(39.4274690, -105.1194840),
    new google.maps.LatLng(39.4274320, -105.1194760),
    new google.maps.LatLng(39.4274110, -105.1194560),
    new google.maps.LatLng(39.4273960, -105.1194380),
    new google.maps.LatLng(39.4273770, -105.1194230),
    new google.maps.LatLng(39.4273570, -105.1194140),
    new google.maps.LatLng(39.4273380, -105.1194080),
    new google.maps.LatLng(39.4273190, -105.1193960),
    new google.maps.LatLng(39.4273000, -105.1193850),
    new google.maps.LatLng(39.4272810, -105.1193710),
    new google.maps.LatLng(39.4272660, -105.1193600),
    new google.maps.LatLng(39.4272480, -105.1193490),
    new google.maps.LatLng(39.4272270, -105.1193380),
    new google.maps.LatLng(39.4272050, -105.1193290),
    new google.maps.LatLng(39.4271810, -105.1193270),
    new google.maps.LatLng(39.4271540, -105.1193250),
    new google.maps.LatLng(39.4270200, -105.1192810),
    new google.maps.LatLng(39.4269760, -105.1192680),
    new google.maps.LatLng(39.4269330, -105.1192660),
    new google.maps.LatLng(39.4268910, -105.1192820),
    new google.maps.LatLng(39.4268500, -105.1192970),
    new google.maps.LatLng(39.4268070, -105.1193020),
    new google.maps.LatLng(39.4267680, -105.1192980),
    new google.maps.LatLng(39.4267240, -105.1192900),
    new google.maps.LatLng(39.4266740, -105.1192920),
    new google.maps.LatLng(39.4266220, -105.1193120),
    new google.maps.LatLng(39.4265220, -105.1193620),
    new google.maps.LatLng(39.4264780, -105.1193900),
    new google.maps.LatLng(39.4264440, -105.1194270),
    new google.maps.LatLng(39.4263840, -105.1195110),
    new google.maps.LatLng(39.4263430, -105.1195370),
    new google.maps.LatLng(39.4263000, -105.1195270),
    new google.maps.LatLng(39.4262530, -105.1195060),
    new google.maps.LatLng(39.4262030, -105.1194830),
    new google.maps.LatLng(39.4261680, -105.1194460),
    new google.maps.LatLng(39.4261480, -105.1193990),
    new google.maps.LatLng(39.4261010, -105.1192350),
    new google.maps.LatLng(39.4260810, -105.1192120),
    new google.maps.LatLng(39.4259600, -105.1191370),
    new google.maps.LatLng(39.4258430, -105.1190550),
    new google.maps.LatLng(39.4258320, -105.1190370),
    new google.maps.LatLng(39.4258190, -105.1190100),
    new google.maps.LatLng(39.4258050, -105.1189840),
    new google.maps.LatLng(39.4257910, -105.1189570),
    new google.maps.LatLng(39.4257710, -105.1189270),
    new google.maps.LatLng(39.4257520, -105.1189030),
    new google.maps.LatLng(39.4256350, -105.1187650),
    new google.maps.LatLng(39.4256170, -105.1185660),
    new google.maps.LatLng(39.4256060, -105.1184360),
    new google.maps.LatLng(39.4256050, -105.1184110),
    new google.maps.LatLng(39.4256020, -105.1183900),
    new google.maps.LatLng(39.4256010, -105.1183670),
    new google.maps.LatLng(39.4256030, -105.1183440),
    new google.maps.LatLng(39.4256090, -105.1183210),
    new google.maps.LatLng(39.4256160, -105.1182040),
    new google.maps.LatLng(39.4256020, -105.1181920),
    new google.maps.LatLng(39.4255920, -105.1181970),
    new google.maps.LatLng(39.4255470, -105.1183430),
    new google.maps.LatLng(39.4255080, -105.1184740),
    new google.maps.LatLng(39.4255100, -105.1184870),
    new google.maps.LatLng(39.4255120, -105.1185050),
    new google.maps.LatLng(39.4255070, -105.1185260),
    new google.maps.LatLng(39.4254990, -105.1185470),
    new google.maps.LatLng(39.4254870, -105.1185690),
    new google.maps.LatLng(39.4254780, -105.1185870),
    new google.maps.LatLng(39.4254730, -105.1186050),
    new google.maps.LatLng(39.4254710, -105.1186220),
    new google.maps.LatLng(39.4254830, -105.1187010),
    new google.maps.LatLng(39.4255480, -105.1188520),
    new google.maps.LatLng(39.4256060, -105.1190670),
    new google.maps.LatLng(39.4257330, -105.1192740),
    new google.maps.LatLng(39.4257740, -105.1193420),
    new google.maps.LatLng(39.4257750, -105.1193680),
    new google.maps.LatLng(39.4257630, -105.1193830),
    new google.maps.LatLng(39.4257500, -105.1193820),
    new google.maps.LatLng(39.4257440, -105.1193710),
    new google.maps.LatLng(39.4257270, -105.1193510),
    new google.maps.LatLng(39.4257070, -105.1193330),
    new google.maps.LatLng(39.4256030, -105.1192800),
    new google.maps.LatLng(39.4255070, -105.1191780),
    new google.maps.LatLng(39.4254190, -105.1189760),
    new google.maps.LatLng(39.4253090, -105.1188700),
    new google.maps.LatLng(39.4252930, -105.1188370),
    new google.maps.LatLng(39.4252920, -105.1188170),
    new google.maps.LatLng(39.4252770, -105.1186960),
    new google.maps.LatLng(39.4252750, -105.1185130),
    new google.maps.LatLng(39.4252660, -105.1184900),
    new google.maps.LatLng(39.4252620, -105.1184660),
    new google.maps.LatLng(39.4252590, -105.1184430),
    new google.maps.LatLng(39.4252570, -105.1184160),
    new google.maps.LatLng(39.4252380, -105.1181970),
    new google.maps.LatLng(39.4252050, -105.1181500),
    new google.maps.LatLng(39.4251830, -105.1181390),
    new google.maps.LatLng(39.4251680, -105.1181380),
    new google.maps.LatLng(39.4250650, -105.1181580),
    new google.maps.LatLng(39.4250450, -105.1181520),
    new google.maps.LatLng(39.4250250, -105.1181480),
    new google.maps.LatLng(39.4249700, -105.1181520),
    new google.maps.LatLng(39.4249540, -105.1181400),
    new google.maps.LatLng(39.4249450, -105.1181230),
    new google.maps.LatLng(39.4249420, -105.1181070),
    new google.maps.LatLng(39.4249430, -105.1180930),
    new google.maps.LatLng(39.4249470, -105.1180730),
    new google.maps.LatLng(39.4249510, -105.1180530),
    new google.maps.LatLng(39.4249550, -105.1180320),
    new google.maps.LatLng(39.4249610, -105.1178790),
    new google.maps.LatLng(39.4249540, -105.1178540),
    new google.maps.LatLng(39.4249450, -105.1178250),
    new google.maps.LatLng(39.4248950, -105.1176770),
    new google.maps.LatLng(39.4248710, -105.1176160),
    new google.maps.LatLng(39.4248660, -105.1175920),
    new google.maps.LatLng(39.4248660, -105.1175500),
    new google.maps.LatLng(39.4248820, -105.1175320),
    new google.maps.LatLng(39.4248980, -105.1175210),
    new google.maps.LatLng(39.4249210, -105.1175130),
    new google.maps.LatLng(39.4249410, -105.1175030),
    new google.maps.LatLng(39.4249980, -105.1174600),
    new google.maps.LatLng(39.4250350, -105.1174190),
    new google.maps.LatLng(39.4250430, -105.1173910),
    new google.maps.LatLng(39.4250490, -105.1173640),
    new google.maps.LatLng(39.4250550, -105.1173340),
    new google.maps.LatLng(39.4250620, -105.1173110),
    new google.maps.LatLng(39.4250610, -105.1172880),
    new google.maps.LatLng(39.4250550, -105.1172700),
    new google.maps.LatLng(39.4250480, -105.1172630),
    new google.maps.LatLng(39.4250400, -105.1172760),
    new google.maps.LatLng(39.4250370, -105.1172920),
    new google.maps.LatLng(39.4250320, -105.1172990),
    new google.maps.LatLng(39.4250100, -105.1173110),
    new google.maps.LatLng(39.4249930, -105.1173140),
    new google.maps.LatLng(39.4249780, -105.1173160),
    new google.maps.LatLng(39.4249560, -105.1173160),
    new google.maps.LatLng(39.4249390, -105.1173170),
    new google.maps.LatLng(39.4249200, -105.1173170),
    new google.maps.LatLng(39.4249070, -105.1173140),
    new google.maps.LatLng(39.4248900, -105.1173080),
    new google.maps.LatLng(39.4248720, -105.1173030),
    new google.maps.LatLng(39.4248560, -105.1172980),
    new google.maps.LatLng(39.4248140, -105.1172990),
    new google.maps.LatLng(39.4247740, -105.1173240),
    new google.maps.LatLng(39.4247240, -105.1174500),
    new google.maps.LatLng(39.4247260, -105.1174680),
    new google.maps.LatLng(39.4247410, -105.1176400),
    new google.maps.LatLng(39.4247230, -105.1178170),
    new google.maps.LatLng(39.4246910, -105.1178740),
    new google.maps.LatLng(39.4246290, -105.1180530),
    new google.maps.LatLng(39.4245040, -105.1182190),
    new google.maps.LatLng(39.4244910, -105.1182320),
    new google.maps.LatLng(39.4244750, -105.1182420),
    new google.maps.LatLng(39.4244580, -105.1182490),
    new google.maps.LatLng(39.4244430, -105.1182560),
    new google.maps.LatLng(39.4243950, -105.1182930),
    new google.maps.LatLng(39.4243860, -105.1183140),
    new google.maps.LatLng(39.4243810, -105.1183410),
    new google.maps.LatLng(39.4243880, -105.1183700),
    new google.maps.LatLng(39.4244070, -105.1184010),
    new google.maps.LatLng(39.4244450, -105.1184420),
    new google.maps.LatLng(39.4244820, -105.1184720),
    new google.maps.LatLng(39.4245210, -105.1184900),
    new google.maps.LatLng(39.4245520, -105.1185020),
    new google.maps.LatLng(39.4245990, -105.1185030),
    new google.maps.LatLng(39.4246440, -105.1184890),
    new google.maps.LatLng(39.4246790, -105.1184800),
    new google.maps.LatLng(39.4247090, -105.1184790),
    new google.maps.LatLng(39.4247460, -105.1184920),
    new google.maps.LatLng(39.4247740, -105.1185160),
    new google.maps.LatLng(39.4247990, -105.1185420),
    new google.maps.LatLng(39.4248440, -105.1185990),
    new google.maps.LatLng(39.4248400, -105.1186150),
    new google.maps.LatLng(39.4248190, -105.1186270),
    new google.maps.LatLng(39.4248030, -105.1186140),
    new google.maps.LatLng(39.4247890, -105.1186050),
    new google.maps.LatLng(39.4247810, -105.1186040),
    new google.maps.LatLng(39.4247630, -105.1186010),
    new google.maps.LatLng(39.4247410, -105.1186030),
    new google.maps.LatLng(39.4247240, -105.1186080),
    new google.maps.LatLng(39.4247060, -105.1186140),
    new google.maps.LatLng(39.4245730, -105.1186570),
    new google.maps.LatLng(39.4244310, -105.1186760),
    new google.maps.LatLng(39.4243900, -105.1186850),
    new google.maps.LatLng(39.4243770, -105.1186740),
    new google.maps.LatLng(39.4243640, -105.1186590),
    new google.maps.LatLng(39.4243210, -105.1186210),
    new google.maps.LatLng(39.4243040, -105.1186120),
    new google.maps.LatLng(39.4242860, -105.1185960),
    new google.maps.LatLng(39.4242670, -105.1185820),
    new google.maps.LatLng(39.4242470, -105.1185700),
    new google.maps.LatLng(39.4242310, -105.1185600),
    new google.maps.LatLng(39.4242170, -105.1185520),
    new google.maps.LatLng(39.4241380, -105.1184900),
    new google.maps.LatLng(39.4241240, -105.1184830),
    new google.maps.LatLng(39.4241120, -105.1184720),
    new google.maps.LatLng(39.4240910, -105.1184510),
    new google.maps.LatLng(39.4240860, -105.1184360),
    new google.maps.LatLng(39.4240870, -105.1183920),
    new google.maps.LatLng(39.4241250, -105.1182800),
    new google.maps.LatLng(39.4241290, -105.1182540),
    new google.maps.LatLng(39.4241400, -105.1182340),
    new google.maps.LatLng(39.4241570, -105.1182160),
    new google.maps.LatLng(39.4241760, -105.1182010),
    new google.maps.LatLng(39.4242010, -105.1181870),
    new google.maps.LatLng(39.4242280, -105.1181680),
    new google.maps.LatLng(39.4242530, -105.1181420),
    new google.maps.LatLng(39.4242720, -105.1181110),
    new google.maps.LatLng(39.4242840, -105.1180740),
    new google.maps.LatLng(39.4242930, -105.1180400),
    new google.maps.LatLng(39.4242940, -105.1180070),
    new google.maps.LatLng(39.4242930, -105.1179820),
    new google.maps.LatLng(39.4242870, -105.1179610),
    new google.maps.LatLng(39.4242840, -105.1179370),
    new google.maps.LatLng(39.4242840, -105.1179090),
    new google.maps.LatLng(39.4242780, -105.1178860),
    new google.maps.LatLng(39.4242720, -105.1178650),
    new google.maps.LatLng(39.4242790, -105.1178410),
    new google.maps.LatLng(39.4242880, -105.1178070),
    new google.maps.LatLng(39.4242950, -105.1177810),
    new google.maps.LatLng(39.4242970, -105.1177570),
    new google.maps.LatLng(39.4242940, -105.1177330),
    new google.maps.LatLng(39.4242350, -105.1175880),
    new google.maps.LatLng(39.4241920, -105.1174840),
    new google.maps.LatLng(39.4241930, -105.1174340),
    new google.maps.LatLng(39.4242010, -105.1174060),
    new google.maps.LatLng(39.4242670, -105.1171680),
    new google.maps.LatLng(39.4242880, -105.1170310),
    new google.maps.LatLng(39.4243900, -105.1168910),
    new google.maps.LatLng(39.4243950, -105.1168720),
    new google.maps.LatLng(39.4243960, -105.1168600),
    new google.maps.LatLng(39.4243810, -105.1168460),
    new google.maps.LatLng(39.4243720, -105.1168440),
    new google.maps.LatLng(39.4243660, -105.1168440),
    new google.maps.LatLng(39.4243640, -105.1168520),
    new google.maps.LatLng(39.4243570, -105.1168640),
    new google.maps.LatLng(39.4243430, -105.1168720),
    new google.maps.LatLng(39.4243280, -105.1168810),
    new google.maps.LatLng(39.4243140, -105.1168910),
    new google.maps.LatLng(39.4243000, -105.1169040),
    new google.maps.LatLng(39.4242910, -105.1169230),
    new google.maps.LatLng(39.4242830, -105.1169500),
    new google.maps.LatLng(39.4242780, -105.1169790),
    new google.maps.LatLng(39.4242730, -105.1170070),
    new google.maps.LatLng(39.4242650, -105.1170390),
    new google.maps.LatLng(39.4241890, -105.1172220),
    new google.maps.LatLng(39.4241580, -105.1173900),
    new google.maps.LatLng(39.4241620, -105.1174100),
    new google.maps.LatLng(39.4241610, -105.1174320),
    new google.maps.LatLng(39.4241230, -105.1176130),
    new google.maps.LatLng(39.4240500, -105.1177790),
    new google.maps.LatLng(39.4239560, -105.1179070),
    new google.maps.LatLng(39.4238490, -105.1181000),
    new google.maps.LatLng(39.4237770, -105.1181920),
    new google.maps.LatLng(39.4237650, -105.1182280),
    new google.maps.LatLng(39.4237620, -105.1183890),
    new google.maps.LatLng(39.4237740, -105.1184160),
    new google.maps.LatLng(39.4237890, -105.1184450),
    new google.maps.LatLng(39.4238610, -105.1186980),
    new google.maps.LatLng(39.4239060, -105.1188080),
    new google.maps.LatLng(39.4239280, -105.1188320),
    new google.maps.LatLng(39.4239490, -105.1188610),
    new google.maps.LatLng(39.4239990, -105.1190050),
    new google.maps.LatLng(39.4240060, -105.1190220),
    new google.maps.LatLng(39.4240090, -105.1190400),
    new google.maps.LatLng(39.4240100, -105.1190600),
    new google.maps.LatLng(39.4240130, -105.1190780),
    new google.maps.LatLng(39.4240150, -105.1190960),
    new google.maps.LatLng(39.4240150, -105.1191160),
    new google.maps.LatLng(39.4240250, -105.1191480),
    new google.maps.LatLng(39.4241220, -105.1192690),
    new google.maps.LatLng(39.4241350, -105.1192750),
    new google.maps.LatLng(39.4242680, -105.1193770),
    new google.maps.LatLng(39.4243550, -105.1195110),
    new google.maps.LatLng(39.4243820, -105.1196890),
    new google.maps.LatLng(39.4243360, -105.1198480),
    new google.maps.LatLng(39.4242590, -105.1199680),
    new google.maps.LatLng(39.4241600, -105.1201270),
    new google.maps.LatLng(39.4241100, -105.1203290),
    new google.maps.LatLng(39.4240720, -105.1205640),
    new google.maps.LatLng(39.4240590, -105.1207280),
    new google.maps.LatLng(39.4240550, -105.1207490),
    new google.maps.LatLng(39.4240550, -105.1207700),
    new google.maps.LatLng(39.4240470, -105.1207930),
    new google.maps.LatLng(39.4240360, -105.1208180),
    new google.maps.LatLng(39.4239700, -105.1210260),
    new google.maps.LatLng(39.4239340, -105.1210510),
    new google.maps.LatLng(39.4238950, -105.1210490),
    new google.maps.LatLng(39.4238580, -105.1210250),
    new google.maps.LatLng(39.4238210, -105.1210040),
    new google.maps.LatLng(39.4237910, -105.1209980),
    new google.maps.LatLng(39.4237690, -105.1209880),
    new google.maps.LatLng(39.4237710, -105.1209740),
    new google.maps.LatLng(39.4237890, -105.1209540),
    new google.maps.LatLng(39.4238230, -105.1208990),
    new google.maps.LatLng(39.4238000, -105.1208860),
    new google.maps.LatLng(39.4237780, -105.1208790),
    new google.maps.LatLng(39.4237530, -105.1208580),
    new google.maps.LatLng(39.4237280, -105.1208200),
    new google.maps.LatLng(39.4236640, -105.1207620),
    new google.maps.LatLng(39.4235000, -105.1206240),
    new google.maps.LatLng(39.4234340, -105.1206060),
    new google.maps.LatLng(39.4233770, -105.1206000),
    new google.maps.LatLng(39.4233160, -105.1205830),
    new google.maps.LatLng(39.4232560, -105.1205540),
    new google.maps.LatLng(39.4232110, -105.1205340),
    new google.maps.LatLng(39.4231570, -105.1205190),
    new google.maps.LatLng(39.4230510, -105.1204840),
    new google.maps.LatLng(39.4230010, -105.1204370),
    new google.maps.LatLng(39.4229590, -105.1203990),
    new google.maps.LatLng(39.4229050, -105.1203520),
    new google.maps.LatLng(39.4228520, -105.1203020),
    new google.maps.LatLng(39.4227880, -105.1202450),
    new google.maps.LatLng(39.4227340, -105.1201820),
    new google.maps.LatLng(39.4226700, -105.1201270),
    new google.maps.LatLng(39.4226080, -105.1200970),
    new google.maps.LatLng(39.4225410, -105.1200730),
    new google.maps.LatLng(39.4224740, -105.1200690),
    new google.maps.LatLng(39.4224110, -105.1200870),
    new google.maps.LatLng(39.4223480, -105.1200920),
    new google.maps.LatLng(39.4222870, -105.1200680),
    new google.maps.LatLng(39.4222240, -105.1200210),
    new google.maps.LatLng(39.4221690, -105.1199620),
    new google.maps.LatLng(39.4221260, -105.1198960),
    new google.maps.LatLng(39.4220970, -105.1198260),
    new google.maps.LatLng(39.4220610, -105.1197760),
    new google.maps.LatLng(39.4220130, -105.1197660),
    new google.maps.LatLng(39.4219590, -105.1197590),
    new google.maps.LatLng(39.4219010, -105.1197290),
    new google.maps.LatLng(39.4218480, -105.1196920),
    new google.maps.LatLng(39.4218020, -105.1196450),
    new google.maps.LatLng(39.4217610, -105.1195870),
    new google.maps.LatLng(39.4217250, -105.1195460),
    new google.maps.LatLng(39.4216990, -105.1195390),
    new google.maps.LatLng(39.4216890, -105.1195500),
  ];
}
//!!!!!!!!DO NOT MODIFY!!!!!!!!!//
//==================================================================================================================

//////////////////////////////////
/////////Sample AJAX Call/////////
//////////////////////////////////
// function getDataFromApi(searchTerm, callback) {
//   const settings = {
//     url: mtbProjectEndpoint,
//     data: {
//       key: mtbProjectApiKey,
//       per_page: 5
//     },
//     dataType: 'json',
//     type: 'GET',
//     success: callback
//   };
//   console.log($.ajax(settings));
//   $.ajax(settings);
// }
//==================================================================================================================

//////////////////////////////////
///////Geocoding AJAX Call////////  ** Not yet working
//////////////////////////////////
function getNormalGeoCoding(searchTerm, callback) {
  const settings = {
    url: geoCodingEndpoint,
    data: {
      address: searchTerm,
      key: geoCodingApiKey
    },
    dataType: 'json',
    type: 'GET',
    success: callback/*function(normalGeoCodingResults) {
      console.log(normalGeoCodingResults);
      return(normalGeoCodingResults);
    }*/
  };
  $.ajax(settings);
};

//***************************************
function getGeoResults(placeholder) {
  console.log(placeholder);
  return(placeholder);
}


//==================================================================================================================
//////////////////////////////////
////Function to call Renderers////
//////////////////////////////////
function execute() {
  renderStateList();
  renderSearchForm();
  // getDataFromApi();
  genCoordinates();
  getRequestGenerator();
  getNormalGeoCoding(80526, getGeoResults);//Replace arguments with user data from forms****
}
//==================================================================================================================
//////////////////////////////////
/////Document Ready Function//////
//////////////////////////////////
$(document).ready(execute);
//==================================================================================================================
//==================================================================================================================
//==================================================================================================================