var $searchForm = document.querySelector('#search-form');
var $placeList = document.querySelector('#place-list');
var $noResults = document.querySelector('.no-results');
var $addedOverlay = document.querySelector('#added-overlay');
var $cancelButton = document.querySelector('#cancel-button');
var $added = document.querySelector('#added');
var $toLocationsButton = document.querySelector('.to-locations-button');
var $viewHeading = document.querySelector('.view-heading');
var $locations = document.querySelector('#locations-list');
var $noPlaces = document.querySelector('.no-places');
var $searchPage = document.querySelector('#search-page');
var $locationsPage = document.querySelector('#locations-page');
var $settingsPage = document.querySelector('#settings-page');
var $moreInfoPage = document.querySelector('#more-info-page');
var $navbar = document.querySelector('.navbar');
var $settingsForm = document.querySelector('#settings-form');
var $deleteButton = document.querySelector('#delete-button');
var $deleteConfirmation = document.querySelector('#delete-confirmation');
var $deleteOverlay = document.querySelector('#delete-overlay');
var $currentWeatherOverlay = document.querySelector('#current-weather-overlay');
var $currentWeatherPlace = document.querySelector('#current-weather-place');
var $currentWeatherTemp = document.querySelector('#current-weather-temperature');
var $currentWeatherWeathercode = document.querySelector('#current-weather-weathercode');
var $currentWeatherIcon = document.querySelector('#current-weather-icon');
var $currentWeatherBackground = document.querySelector('#current-weather-background');
var $buttonRow = document.querySelector('#button-row');
var $tbody = document.querySelector('tbody');
var $dayButtonNodelist = document.querySelectorAll('button[data-index]');

var $unit = data.unit;
var $7timerUnit = '';
var $openmeteoTempUnit = '';
var $openmeteoWindUnit = '';
var $openmeteoPrecipitationUnit = '';
var $degree = '';

if ($unit === 'metric') {
  $7timerUnit = '';
  $openmeteoTempUnit = 'celsius';
  $openmeteoWindUnit = 'kmh';
  $openmeteoPrecipitationUnit = 'mm';
  $degree = '\u00B0C';
} else if ($unit === 'imperial') {
  $7timerUnit = 'british';
  $openmeteoTempUnit = 'fahrenheit';
  $openmeteoWindUnit = 'mph';
  $openmeteoPrecipitationUnit = 'inch';
  $degree = '\u00B0F';
}

$searchForm.addEventListener('submit', function () {
  event.preventDefault();
  var input = $searchForm.elements.search.value;
  input = capitalizeCity(input);
  getResults(input);
});

function capitalizeCity(string) {
  var newTitle = '';
  var array = string.split(' ');
  for (var i = 0; i < array.length; i++) {
    array[i] = array[i][0].toUpperCase() + array[i].slice(1, array[i].length).toLowerCase();
    if (array[i].split('').includes('-')) {
      var split = array[i].split('-');
      split[1] = split[1][0].toUpperCase() + split[1].slice(1, split[1].length);
      array[i] = split.join('-');
    }
  } newTitle = array.join(' ');
  return newTitle;
}

function renderPlace(place) {
  var $li = document.createElement('li');
  $li.className = 'location-entry';
  var $div = document.createElement('div');
  $div.className = 'row column';
  $li.appendChild($div);
  var $div1 = document.createElement('div');
  $div1.className = 'row';
  $div.appendChild($div1);
  var $div2 = document.createElement('div');
  $div2.className = 'column-full inline';
  $div1.appendChild($div2);
  var $h4 = document.createElement('h4');
  $h4.textContent = place.name;
  $div2.appendChild($h4);
  var $button = document.createElement('button');
  $button.className = 'current-weather-button';
  $button.setAttribute('data-long', place.longitude);
  $button.setAttribute('data-latt', place.latitude);
  $button.setAttribute('data-name', place.name);
  $button.textContent = 'Current Weather';
  $div2.appendChild($button);
  var $div3 = document.createElement('div');
  $div3.className = 'row';
  $div.appendChild($div3);
  var $div4 = document.createElement('div');
  $div4.className = 'column-full padding';
  $div3.appendChild($div4);
  var $img = document.createElement('img');
  $img.alt = 'One Week Daily Forecast Graphic for ' + place.name;
  var $div5 = document.createElement('div');
  $div5.className = 'row';
  $div.appendChild($div5);
  var $button1 = document.createElement('button');
  $button1.className = 'more-info-button';
  $button1.setAttribute('data-long', place.longitude);
  $button1.setAttribute('data-latt', place.latitude);
  $button1.setAttribute('data-name', place.name);
  $button1.textContent = 'More Info';
  $div5.appendChild($button1);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.7timer.info/bin/civillight.php?lon=' + place.longitude + '&lat=' + place.latitude + '&ac=0&lang=en&unit=' + $7timerUnit + '&output=internal&tzshift=0');
  xhr.responseType = 'arraybuffer';
  xhr.addEventListener('load', function () {
    var arrayBufferView = new Uint8Array(this.response);
    var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(blob);
    $img.src = imageUrl;
    $div4.appendChild($img);
  });
  xhr.send();
  return $li;
}

function renderCurrentPlace() {
  var $img = document.createElement('img');
  $img.alt = 'One Week Tri-Hourly Forecast Graphic for ' + data.currentPlace.name;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.7timer.info/bin/civil.php?lon=' + data.currentPlace.longitude + '&lat=' + data.currentPlace.latitude + '&ac=0&lang=en&unit=' + $7timerUnit + '&output=internal&tzshift=0');
  xhr.responseType = 'arraybuffer';
  xhr.addEventListener('load', function () {
    var arrayBufferView = new Uint8Array(this.response);
    var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(blob);
    $img.src = imageUrl;
  });
  xhr.send();
  return $img;
}

function renderWeek() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.open-meteo.com/v1/forecast?latitude=' + data.currentPlace.latitude + '&longitude=' + data.currentPlace.longitude + '&hourly=temperature_2m,apparent_temperature,precipitation_probability,rain,showers,snowfall,cloudcover,windspeed_10m&temperature_unit=' + $openmeteoTempUnit + '&windspeed_unit=' + $openmeteoWindUnit + '&precipitation_unit=' + $openmeteoPrecipitationUnit + '&daily=sunrise,sunset&current_weather=true&timezone=auto');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    nameButtonRow(xhr.response.hourly.time[0]);
    data.currentPlaceObject = xhr.response;
    handleActiveButton(data.dayView);
    renderTable(data.dayView, data.currentPlaceObject);
    renderCurrentWeather();
  });
  xhr.send();
}

function renderCurrentWeather() {
  $currentWeatherPlace.textContent = data.currentPlace.name;
  $currentWeatherTemp.textContent = data.currentPlaceObject.current_weather.temperature + $degree + ' ';
  $currentWeatherWeathercode.textContent = ' ' + handleWeathercode(data.currentPlaceObject.current_weather.weathercode);
  handleCurrentWeatherBackground();
}

function handleWeathercode(weathercode) {
  switch (weathercode) {
    case 0:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-sun fa-2x';
      return 'Clear Sky';
    case 1:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-sun fa-2x';
      return 'Mainly Clear';
    case 2:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-sun fa-2x';
      return 'Partly Cloudy';
    case 3:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud fa-2x';
      return 'Overcast';
    case 45:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-smog fa-2x';
      return 'Fog';
    case 48:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-smog fa-2x';
      return 'Depositing Rime Fog';
    case 51:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-rain fa-2x';
      return 'Light Drizzle';
    case 53:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-rain fa-2x';
      return 'Moderate Drizzle';
    case 55:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-rain fa-2x';
      return 'Dense Drizzle';
    case 56:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-meatball fa-2x';
      return 'Light Freezing Drizzle';
    case 57:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-meatball fa-2x';
      return 'Dense Freezing Drizzle';
    case 61:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-rain fa-2x';
      return 'Slight Rain';
    case 63:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-rain fa-2x';
      return 'Moderate Rain';
    case 65:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-showers-heavy fa-2x';
      return 'Heavy Rain';
    case 66:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-meatball fa-2x';
      return 'Light Freezing Rain';
    case 67:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-meatball fa-2x';
      return 'Heavy Freezing Rain';
    case 71:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-snowflake fa-2x';
      return 'Slight Snow Fall';
    case 73:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-snowflake fa-2x';
      return 'Moderate Snow Fall';
    case 75:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-snowflake fa-2x';
      return 'Heavy Snow Fall';
    case 77:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-snowflake fa-2x';
      return 'Snow Grains';
    case 80:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-rain fa-2x';
      return 'Slight Rain Showers';
    case 81:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-showers-heavy fa-2x';
      return 'Moderate Rain Showers';
    case 82:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-showers-water fa-2x';
      return 'Violent Rain Showers';
    case 85:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-meatball fa-2x';
      return 'Slight Snow Showers';
    case 86:
      $currentWeatherIcon.className = 'dark-purple fa-solid fa-cloud-meatball fa-2x';
      return 'Heavy Snow Showers';
  }
}

function handleCurrentWeatherBackground() {
  if (data.currentPlaceObject.current_weather.time.slice(-5) > data.currentPlaceObject.daily.sunrise[0].slice(-5) && data.currentPlaceObject.current_weather.time.slice(-5) < data.currentPlaceObject.daily.sunset[0].slice(-5)) {
    $currentWeatherBackground.className = 'column-full popup day';
  } else {
    $currentWeatherBackground.className = 'column-full popup night';
  }
}

function nameButtonRow(hour) {
  var time = new Date(hour);
  var currentDayIndex = time.getDay();
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  var daysIndex = currentDayIndex;
  for (var i = 1; i < 7; i++) {
    daysIndex++;
    $buttonRow.children[i].textContent = days[daysIndex];
  }
}

function renderTable(dayIndex, object) {
  while ($tbody.firstChild) {
    $tbody.removeChild($tbody.lastChild);
  }
  var startIndex = 0;
  var endIndex = 0;
  switch (dayIndex) {
    case 0:
      startIndex = 0;
      endIndex = 23;
      break;
    case 1:
      startIndex = 24;
      endIndex = 47;
      break;
    case 2:
      startIndex = 48;
      endIndex = 71;
      break;
    case 3:
      startIndex = 72;
      endIndex = 95;
      break;
    case 4:
      startIndex = 96;
      endIndex = 119;
      break;
    case 5:
      startIndex = 120;
      endIndex = 143;
      break;
    case 6:
      startIndex = 144;
      endIndex = 167;
      break;
  }
  for (var i = startIndex; i <= endIndex; i++) {
    var $tr = document.createElement('tr');
    var $tdTime = document.createElement('td');
    $tdTime.className = 'time';
    $tdTime.textContent = object.hourly.time[i].slice(-5);
    $tr.appendChild($tdTime);
    var $tdTemperature = document.createElement('td');
    $tdTemperature.className = 'temperature';
    $tdTemperature.textContent = object.hourly.temperature_2m[i] + $degree;
    $tr.appendChild($tdTemperature);
    var $tdApparentTemperature = document.createElement('td');
    $tdApparentTemperature.className = 'apparent-temperature';
    $tdApparentTemperature.textContent = object.hourly.apparent_temperature[i] + $degree;
    $tr.appendChild($tdApparentTemperature);
    var $tdPrecipitation = document.createElement('td');
    $tdPrecipitation.className = 'precipitation';
    $tdPrecipitation.textContent = object.hourly.precipitation_probability[i] + '%';
    $tr.appendChild($tdPrecipitation);
    var $tdRain = document.createElement('td');
    $tdRain.className = 'rain';
    $tdRain.textContent = object.hourly.rain[i] + $openmeteoPrecipitationUnit;
    $tr.appendChild($tdRain);
    var $tdShowers = document.createElement('td');
    $tdShowers.className = 'showers';
    $tdShowers.textContent = object.hourly.showers[i] + $openmeteoPrecipitationUnit;
    $tr.appendChild($tdShowers);
    var $tdSnow = document.createElement('td');
    $tdSnow.className = 'snow';
    $tdSnow.textContent = object.hourly.snowfall[i] + $openmeteoPrecipitationUnit;
    $tr.appendChild($tdSnow);
    var $tdCloud = document.createElement('td');
    $tdCloud.className = 'cloud';
    $tdCloud.textContent = object.hourly.cloudcover[i] + '%';
    $tr.appendChild($tdCloud);
    var $tdWind = document.createElement('td');
    $tdWind.className = 'wind';
    $tdWind.textContent = object.hourly.windspeed_10m[i] + $openmeteoWindUnit;
    $tr.appendChild($tdWind);
    $tbody.appendChild($tr);
  }
}

document.addEventListener('DOMContentLoaded', function (event) {
  for (var i = 0; i < data.places.length; i++) {
    var $placeTree = renderPlace(data.places[i]);
    $locations.appendChild($placeTree);
  } swapView(data.view);
  if ($locations.children.length > 0) {
    toggleNoPlaces();
  }
  if (data.currentPlace !== null) {
    var $currentPlace = renderCurrentPlace();
    $moreInfoPage.prepend($currentPlace);
    renderWeek();
  }
});

function getResults(string) {
  var targetUrl = encodeURIComponent('http://api.positionstack.com/v1/forward?access_key=edf3a9421a5fdfce7b4bfc28f3718294&query=' + string);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://lfz-cors.herokuapp.com/?url=' + targetUrl);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    var $child = $placeList.lastElementChild;
    while ($child) {
      $placeList.removeChild($child);
      $child = $placeList.lastElementChild;
    }
    if (xhr.response.data.length === 0) {
      $noResults.className = 'no-results';
    } else {
      $noResults.className = 'no-results hidden';
    }
    for (var i = 0; i < xhr.response.data.length; i++) {
      var $li = document.createElement('li');
      $li.textContent = xhr.response.data[i].label;
      $placeList.appendChild($li);
      var $button = document.createElement('button');
      $button.textContent = '+';
      $button.className = 'add-button';
      $button.setAttribute('data-long', xhr.response.data[i].longitude);
      $button.setAttribute('data-latt', xhr.response.data[i].latitude);
      $button.setAttribute('data-name', xhr.response.data[i].label);
      $placeList.appendChild($button);
    }
  });
  xhr.send();
}

$placeList.addEventListener('click', function (event) {
  if (event.target.className === 'add-button') {
    $added.textContent = 'Added ' + event.target.getAttribute('data-name');
    $addedOverlay.className = 'row';
    var placeData = {
      name: event.target.getAttribute('data-name'),
      longitude: event.target.getAttribute('data-long'),
      latitude: event.target.getAttribute('data-latt')
    };
    var same = 0;
    for (var i = 0; i < data.places.length; i++) {
      if (JSON.stringify(placeData) === JSON.stringify(data.places[i])) {
        same++;
      }
    }
    if (same === 0) {
      data.places.push(placeData);
      $locations.appendChild(renderPlace(placeData));
      if ($noPlaces.className === 'no-places') {
        toggleNoPlaces();
      }
    }
  }
});

$cancelButton.addEventListener('click', function () {
  $addedOverlay.className = 'row hidden';
});

$toLocationsButton.addEventListener('click', function () {
  $addedOverlay.className = 'row hidden';
  swapView('locations');
});

function swapView(view) {
  if (view === 'search') {
    $viewHeading.textContent = 'Search';
    $searchPage.className = '';
    $locationsPage.className = 'hidden';
    $settingsPage.className = 'hidden';
    $moreInfoPage.className = 'hidden';
  } else if (view === 'locations') {
    $viewHeading.textContent = 'Locations';
    $searchPage.className = 'hidden';
    $locationsPage.className = '';
    $settingsPage.className = 'hidden';
    $moreInfoPage.className = 'hidden';
  } else if (view === 'settings') {
    $viewHeading.textContent = 'Settings';
    $searchPage.className = 'hidden';
    $locationsPage.className = 'hidden';
    $settingsPage.className = '';
    $moreInfoPage.className = 'hidden';
  } else if (view === 'more-info') {
    $viewHeading.textContent = data.currentPlace.name;
    $searchPage.className = 'hidden';
    $locationsPage.className = 'hidden';
    $settingsPage.className = 'hidden';
    $moreInfoPage.className = '';
  }
  data.view = view;
  if (data.view === 'more-info') {
    $deleteButton.className = '';
  } else {
    $deleteButton.className = 'hidden';
  }
}

function toggleNoPlaces() {
  if ($noPlaces.className === 'no-places') {
    $noPlaces.className = 'no-places hidden';
  } else {
    $noPlaces.className = 'no-places';
  }
}

function handleActiveButton(index) {
  for (var i = 0; i < $dayButtonNodelist.length; i++) {
    if (index === i) {
      $dayButtonNodelist[i].className = '';
    } else {
      $dayButtonNodelist[i].className = 'gray';
    }
  }
}

$navbar.addEventListener('click', function (event) {
  if (event.target.id === 'search-button') {
    swapView('search');
  } else if (event.target.id === 'locations-button') {
    swapView('locations');
  } else if (event.target.id === 'settings-button') {
    swapView('settings');
  }
});

$settingsForm.addEventListener('submit', function (event) {
  event.preventDefault();
  data.unit = $settingsForm.elements.unit.value;
  location.reload();
});

window.onload = onPageLoad();
function onPageLoad() {
  document.getElementById(data.unit).checked = true;
}

$locations.addEventListener('click', function (event) {
  switch (event.target.className) {
    case 'more-info-button':
      for (var i = 0; i < data.places.length; i++) {
        if (data.places[i].name === event.target.getAttribute('data-name') && data.places[i].longitude === event.target.getAttribute('data-long') && data.places[i].latitude === event.target.getAttribute('data-latt')) {
          data.currentPlace = data.places[i];
        }
      }
      if ($moreInfoPage.childElementCount > 1) {
        $moreInfoPage.removeChild($moreInfoPage.firstChild);
      }
      var $currentPlace = renderCurrentPlace();
      $moreInfoPage.prepend($currentPlace);
      data.dayView = 0;
      renderWeek();
      swapView('more-info');
      break;
    case 'current-weather-button':
      for (var j = 0; j < data.places.length; j++) {
        if (data.places[j].name === event.target.getAttribute('data-name') && data.places[j].longitude === event.target.getAttribute('data-long') && data.places[j].latitude === event.target.getAttribute('data-latt')) {
          data.currentPlace = data.places[j];
        }
      }
      renderWeek();
      $currentWeatherOverlay.className = 'row';
      break;
  }
});

$currentWeatherOverlay.addEventListener('click', function (event) {
  if (event.target.id === 'ok-button') {
    $currentWeatherOverlay.className = 'row hidden';
    $currentWeatherPlace.textContent = '';
    $currentWeatherTemp.textContent = '';
    $currentWeatherIcon.className = '';
    $currentWeatherWeathercode.textContent = '';
    $currentWeatherBackground.className = 'column-full popup';
  }
});

$buttonRow.addEventListener('click', function (event) {
  if (event.target.tagName === 'BUTTON') {
    var index = Number(event.target.getAttribute(['data-index']));
    data.dayView = index;
    handleActiveButton(data.dayView);
    renderTable(data.dayView, data.currentPlaceObject);
  }
});

$deleteButton.addEventListener('click', function () {
  $deleteConfirmation.textContent = data.currentPlace.name + '?';
  $deleteOverlay.className = 'row';
});

$deleteOverlay.addEventListener('click', function (event) {
  if (event.target.id === 'no-button') {
    $deleteOverlay.className = 'row hidden';
  } else if (event.target.id === 'yes-button') {
    var placeData = data.currentPlace;
    for (var i = 0; i < data.places.length; i++) {
      if (JSON.stringify(placeData) === JSON.stringify(data.places[i])) {
        data.places.splice(i, 1);
      }
    }
    var $moreInfoNodeList = document.querySelectorAll('.more-info-button');
    var $locationEntryNodeList = document.querySelectorAll('.location-entry');
    for (var j = 0; j < $locationEntryNodeList.length; j++) {
      var locationEntryData = {
        name: $moreInfoNodeList[j].getAttribute('data-name'),
        longitude: $moreInfoNodeList[j].getAttribute('data-long'),
        latitude: $moreInfoNodeList[j].getAttribute('data-latt')
      };
      if (JSON.stringify(placeData) === JSON.stringify(locationEntryData)) {
        $locationEntryNodeList[j].remove();
      }
      if ($locations.children.length === 0) {
        toggleNoPlaces();
      }
    } $deleteOverlay.className = 'row hidden';
    data.currentPlace = null;
    data.currentPlaceObject = null;
    swapView('locations');
  }
});
