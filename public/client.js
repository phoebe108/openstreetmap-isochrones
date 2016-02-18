var app = angular.module('app', ['ui.bootstrap']);

app.controller('MapCtrl', function($scope, $http) {

  var map = L.map('map').setView([-1.265236,36.806609], 13);
  $scope.coords = '';
  $scope.chosenTool = 'OTP';
  $scope.url = '';

  $scope.isoLineStyle = {
    "color": 'red',
    "weight": 5,
    "opacity": 1
  };

  // add basemap to the leaflet map
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
  }).addTo(map);

  // remove the isochrone json from the leaflet map
  $scope.removeIsoLayer = function() {
      if($scope.isochroneLayer) {
          map.removeLayer($scope.isochroneLayer);
      }
  };

  // rework json into Leaflet-recognizable GeoJSON
  function getProperGeojsonFormat(data) {
      $scope.isoGeojson = {"type": "FeatureCollection", "features": []};

      data.forEach(function(element, index) {
          $scope.isoGeojson.features[index] = {};
          $scope.isoGeojson.features[index].type = 'Feature';
          $scope.isoGeojson.features[index].properties = element.properties;
          $scope.isoGeojson.features[index].geometry = {};
          $scope.isoGeojson.features[index].geometry.coordinates = [];
          $scope.isoGeojson.features[index].geometry.type = 'MultiPolygon';

          element.geometry.geometries.forEach(function(el) {
              $scope.isoGeojson.features[index].geometry.coordinates.push(el.coordinates);
          });
      });
      return $scope.isoGeojson;
  }

  // retrieve isochrone geometries using clicked map location as starting point
  map.on('click', function(e) {
    $scope.removeIsoLayer();
    $scope.coords = [e.latlng.lat,e.latlng.lng];

    if ($scope.chosenTool == 'OTP') {
      $scope.url = 'http://localhost:8080/otp/routers/default/isochrone?&fromPlace=' + $scope.coords + '&date=2015/01/09&time=12:00:00&mode=WALK&walkSpeed=3&cutoffSec=600&cutoffSec=1200&cutoffSec=2400&callback=JSON_CALLBACK';

      // request to OTP service for json isochrone polygons
      $http.jsonp($scope.url)
          .success(function(response) {

              // add the isochrone json to the leaflet map
              $scope.properGeoJSON = getProperGeojsonFormat(response);
              $scope.isochroneLayer = L.geoJson($scope.properGeoJSON).addTo(map);
          })
          .error(function(response) {
              console.log(response);
          });
    } else {

      // request to OSRM service for json isochrone lines
      $http.post('/osrm', $scope.coords)
          .success(function(response) {

              // add isochrone json to the leaflet map
              $scope.isochroneLayer = L.geoJson(response, {style: $scope.isoLineStyle}).addTo(map);
          })
          .error(function(response) {
              console.log(response);
          });
      }

  });

});
