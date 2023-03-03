/* exported data */
var data = {
  places: [],
  currentPlace: null,
  currentPlaceObject: null,
  view: 'search',
  unit: 'metric'
};

window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(data);
  this.localStorage.setItem('data-local-storage', dataJSON);
});

if (localStorage.getItem('data-local-storage') !== null) {
  data = JSON.parse(localStorage.getItem('data-local-storage'));
}
