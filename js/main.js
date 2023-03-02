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

var $unit = data.unit;
var $7timerUnit = '';
var $openmeteoTempUnit = '';
var $openmeteoWindUnit = '';
var $openmeteoPrecipitationUnit = '';

if ($unit === 'metric') {
  $7timerUnit = '';
  $openmeteoTempUnit = 'celsius';
  $openmeteoWindUnit = 'kmh';
  $openmeteoPrecipitationUnit = 'mm';
} else if ($unit === 'imperial') {
  $7timerUnit = 'british';
  $openmeteoTempUnit = 'fahrenheit';
  $openmeteoWindUnit = 'mph';
  $openmeteoPrecipitationUnit = 'inch';
}

// to get rid of lint error, placeholder variables
capitalizeCity($openmeteoTempUnit + $openmeteoWindUnit + $openmeteoPrecipitationUnit);

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
  $button.className = 'more-info-button';
  $button.setAttribute('data-long', place.longitude);
  $button.setAttribute('data-latt', place.latitude);
  $button.setAttribute('data-name', place.name);
  $button.textContent = 'More Info';
  $div2.appendChild($button);
  var $div3 = document.createElement('div');
  $div3.className = 'row';
  $div.appendChild($div3);
  var $div4 = document.createElement('div');
  $div4.className = 'column-full';
  $div3.appendChild($div4);
  var $img = document.createElement('img');
  $img.alt = 'One Week Daily Forecast Graphic for ' + place.name;

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

document.addEventListener('DOMContentLoaded', function (event) {
  for (var i = 0; i < data.places.length; i++) {
    var $placeTree = renderPlace(data.places[i]);
    $locations.appendChild($placeTree);
  } swapView(data.view);
  if ($locations.children.length > 0) {
    toggleNoPlaces();
  }
  var $currentPlace = renderCurrentPlace();
  $moreInfoPage.prepend($currentPlace);
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
  if (event.target.className === 'more-info-button') {
    for (var i = 0; i < data.places.length; i++) {
      if (data.places[i].name === event.target.getAttribute('data-name') && data.places[i].longitude === event.target.getAttribute('data-long') && data.places[i].latitude === event.target.getAttribute('data-latt')) {
        data.currentPlace = data.places[i];
      }
    }
    while ($moreInfoPage.childElementCount > 0) {
      $moreInfoPage.removeChild($moreInfoPage.childNodes[0]);
    }
    var $currentPlace = renderCurrentPlace();
    $moreInfoPage.prepend($currentPlace);
    swapView('more-info');
  }
});

$deleteButton.addEventListener('click', function () {
  $deleteConfirmation.textContent = 'Are you sure you want to delete ' + data.currentPlace.name + '?';
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
    swapView('locations');
  }
});
