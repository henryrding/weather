/* exported data */
var data = {
  places: [],
  currentPlace: null,
  currentPlaceObject: null,
  dayView: null,
  view: 'search',
  unit: 'metric'
};

window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(data);
  this.localStorage.setItem('weather-data-local-storage', dataJSON);
});

window.addEventListener('pagehide', function (event) {
  var dataJSON = JSON.stringify(data);
  this.localStorage.setItem('weather-data-local-storage', dataJSON);
});

if (localStorage.getItem('weather-data-local-storage') !== null) {
  data = JSON.parse(localStorage.getItem('weather-data-local-storage'));
}
