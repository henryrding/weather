/* exported data */
var data = {
  places: [],
  currentPlace: null,
  view: 'search'
};

window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(data);
  this.localStorage.setItem('data-local-storage', dataJSON);
});

if (localStorage.getItem('data-local-storage') !== null) {
  data = JSON.parse(localStorage.getItem('data-local-storage'));
}
