var $searchForm = document.querySelector('#search-form');

$searchForm.addEventListener('submit', function () {
  event.preventDefault();
  var input = $searchForm.elements.search.value;
  var hasNumber = /\d/;
  if (!hasNumber.text(input)) {
    input = capitalizeCity(input);
  }
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
