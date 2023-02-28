var $searchForm = document.querySelector('#search-form');
var $placeList = document.querySelector('#place-list');
var $noResults = document.querySelector('.no-results');
var $addedOverlay = document.querySelector('#added-overlay');
var $cancelButton = document.querySelector('#cancel-button');
var $added = document.querySelector('#added');

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

function getResults(string) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://api.positionstack.com/v1/forward?access_key=edf3a9421a5fdfce7b4bfc28f3718294&query=' + string);
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
  if (event.target.tagName === 'BUTTON') {
    $added.textContent = 'Added ' + event.target.getAttribute('data-name');
    $addedOverlay.className = 'row';
  }
});

$cancelButton.addEventListener('click', function () {
  $addedOverlay.className = 'row hidden';
});
