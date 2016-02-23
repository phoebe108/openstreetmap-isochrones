(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app = angular.module('app', ['ui.bootstrap']);

require('./map.js');
require('./walkshed.js');


},{"./map.js":2,"./walkshed.js":3}],2:[function(require,module,exports){
/**
 * Created by phoebe on 2/18/16.
 */

module.exports = angular.module('app').controller('MapCtrl', function($scope, $rootScope) {

    var map = L.map('map').setView([-1.265236,36.806609], 13);

    // add basemap to the leaflet map
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
    }).addTo(map);

    // remove the isochrone json from the leaflet map
    function removeIsoLayer() {
        if($scope.isochroneLayer) {
            map.removeLayer($scope.isochroneLayer);
        }
    }

    // get color depending on travel time value
    function getColor(t) {
        return t == "Isochrone 600 sec" ? 'red' :
            t == "Isochrone 1200 sec"  ? '#E32C21' :
                t == "Isochrone 1800 sec"  ? '#F6642E' :
                    t == "Isochrone 2400 sec"  ? '#FD9C44' :
                        t == "Isochrone 3000 sec"   ? '#FECC5C' :
                            t == "Isochrone 3600 sec"   ? '#FEF29C' :
                                '#ffffe5';
    }

    // get opacity depending on travel time value
    function getFillOpacity(t2) {
        return t2 == "Isochrone 600 sec" ? 0.40 :
            t2 == "Isochrone 1200 sec" ? 0.40 :
                t2 == "Isochrone 1800 sec" ? 0.40 :
                    t2 == "Isochrone 2400 sec" ? 0.40 :
                        t2 == "Isochrone 3000 sec"  ? 0.45 :
                            t2 == "Isochrone 3600 sec"  ? 0.50 :
                                1;
    }

    // generate the way travel time isochrones will look
    function getStyle(feature) {
        return {
            fillOpacity: getFillOpacity(feature.properties.name),
            color: 'white',
            weight: 1,
            opacity: 0.7,
            fillColor: getColor(feature.properties.name)
        };
    }

    // retrieve clicked map location coordinates
    map.on('click', function(e) {
        removeIsoLayer();
        $rootScope.$broadcast('mapClick', {coords: [e.latlng.lat,e.latlng.lng]});
    });

    // add isochrone polygons to map
    $scope.$on('isochrones', function(event, args) {
        $scope.isochroneLayer = L.geoJson(args.isoGeom, {style: getStyle}).addTo(map);
    });
});
},{}],3:[function(require,module,exports){
/**
 * Created by phoebe on 2/18/16.
 */

module.exports = angular.module('app').controller('WalkshedCtrl', function($scope, $rootScope, $http) {
    $scope.chosenTool = 'OTP';
    var isoGeojson = {};
    var url = '';

    var isoLineStyle = {
        "color": 'red',
        "weight": 5,
        "opacity": 1
    };

    // rework json into Leaflet-recognizable GeoJSON
    function getProperGeojsonFormat(data) {
        isoGeojson = {"type": "FeatureCollection", "features": []};

        data.forEach(function(element, index) {
            isoGeojson.features[index] = {};
            isoGeojson.features[index].type = 'Feature';
            isoGeojson.features[index].properties = element.properties;
            isoGeojson.features[index].geometry = {};
            isoGeojson.features[index].geometry.coordinates = [];
            isoGeojson.features[index].geometry.type = 'MultiPolygon';

            element.geometry.geometries.forEach(function(el) {
                isoGeojson.features[index].geometry.coordinates.push(el.coordinates);
            });
        });
        $rootScope.$broadcast('isochrones', {isoGeom: isoGeojson});
        //return $scope.isoGeojson;
    }

    // get OSRM isochrones
    function osrmIso(coordinates) {
        $http.post('/osrm', coordinates)
            .success(function(response) {

                // add isochrone json to the leaflet map
                $scope.isochroneLayer = L.geoJson(response, {style: $scope.isoLineStyle}).addTo(map);
            })
            .error(function(response) {
                console.log(response);
            });
    }

    // get OTP isochrones
    function otpIso(coordinates) {
        url = 'http://localhost:8080/otp/routers/default/isochrone?&fromPlace=' + coordinates + '&date=2015/01/09&time=12:00:00&mode=WALK&walkSpeed=4&cutoffSec=600&cutoffSec=1200&cutoffSec=2400&callback=JSON_CALLBACK';

        // request to OTP service for json isochrone polygons
        $http.jsonp(url)
            .success(function(response) {
                getProperGeojsonFormat(response);
            })
            .error(function(response) {
                console.log(response);
            });
    }

    // calculate isochrones
    $scope.$on('mapClick', function(event, args){
        otpIso(args.coords);
    });

});
},{}]},{},[1]);
