var app = angular.module('app', ['ui.bootstrap']);

app.controller('MapCtrl', function($scope, $http) {
  var map = L.map('map').setView([-1.265236,36.806609], 13);


  // add basemap to the leaflet map
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
  }).addTo(map);

});
