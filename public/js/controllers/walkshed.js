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