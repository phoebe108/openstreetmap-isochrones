var app = angular.module('app', ['ui.bootstrap']);

app.controller('MapCtrl', function($scope, $http) {

  var map = L.map('map').setView([-1.265236,36.806609], 13);
  $scope.coords = '';

  // add basemap to the leaflet map
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
  }).addTo(map);


  // retrieve isochrone geometries using clicked map location as starting point
  map.on('click', function(e) {

    $scope.coords = [e.latlng.lat,e.latlng.lng];

    // request to OSRM service for json isochrone lines
    $http.post('/osrm', $scope.coords)
        .success(function(response) {

            // add isochrone json to the leaflet map
            $scope.isochroneLayer = L.geoJson(response, {style: $scope.isoLineStyle}).addTo(map);
        })
        .error(function(response) {
            console.log(response);
        });
  });

});
