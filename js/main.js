var $searchForm = document.querySelector('#search-form');
var $placeList = document.querySelector('#place-list');
var $noResults = document.querySelector('.no-results');
var $addedOverlay = document.querySelector('#added-overlay');
var $cancelButton = document.querySelector('#cancel-button');
var $added = document.querySelector('#added');
var $toLocationsButton = document.querySelector('.to-locations-button');
var $viewHeading = document.querySelector('.view-heading');
var $locations = document.querySelector('#locations-list');
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
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.7timer.info/bin/civillight.php?lon=' + place.longitude + '&lat=' + place.latitude + '&ac=0&lang=en&unit=british&output=internal&tzshift=0');
  xhr.responseType = 'arraybuffer';
  xhr.addEventListener('load', function () {
    var arrayBufferView = new Uint8Array(this.response);
    var blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(blob);
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
    $h4.className = 'margin-right';
    $h4.textContent = place.name;
    $div2.appendChild($h4);
    var $button = document.createElement('button');
    $button.className = 'more-info-button';
    $button.setAttribute('data-long', place.longitude);
    $button.setAttribute('data-latt', place.latitude);
    $button.textContent = 'More Info';
    $div2.appendChild($button);
    var $div3 = document.createElement('div');
    $div3.className = 'row';
    $div.appendChild($div3);
    var $div4 = document.createElement('div');
    $div4.className = 'column-full';
    $div3.appendChild($div4);
    var $img = document.createElement('img');
    $img.src = imageUrl;
    $div4.appendChild($img);
    $locations.appendChild($li);
  });
  xhr.send();
}

document.addEventListener('DOMContentLoaded', function (event) {
  for (var i = 0; i < data.places.length; i++) {
    renderPlace(data.places[i]);
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
  if (view === 'locations') {
    $viewHeading.textContent = 'Locations';
    $searchForm.className = 'row hidden';
    $placeList.className = 'center hidden';
    $locations.className = 'center';
  }
}
