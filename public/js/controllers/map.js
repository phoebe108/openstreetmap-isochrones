/**
 * Created by phoebe on 2/18/16.
 */

module.exports = angular.module('app').controller('MapCtrl', function($scope, mapService, osrmService, otpService) {

    $scope.osrmToggle = 'ENABLE';
    $scope.otpToggle = 'ENABLE';

    // initialize maps
    mapService.init(map1);
    mapService.init(map2);

    $scope.toggle = function() {
        if ($scope.osrmToggle === 'ENABLE') {
            $scope.osrmToggle = 'DISABLE';
        }
        else {
            $scope.osrmToggle = 'ENABLE';
            mapService.map1.removeLayer(osrmLayers);
        }
    };

    var osrmLayers = L.geoJson(); //.addTo(mapService.map1);
    var otpLayers = L.geoJson(); //.addTo(mapService.map2);

    // calculate travel time on osrm map
    mapService.map1.on('click', function(e) {

        if ($scope.osrmToggle === 'DISABLE') {

            // remove map layer if exists
            mapService.map1.removeLayer(osrmLayers);

            var polygons = osrmService.getTravelTime([e.latlng.lat,e.latlng.lng]);

            // add polygons to map
            osrmLayers = L.geoJson(polygons.features, {style: mapService.isoLineStyle}).addTo(mapService.map1);
        }
    });


    // calculate travel time on otp map
    mapService.map2.on('click', function(e) {

        if ($scope.otpToggle === 'DISABLE') {

            // remove map layer if exists
            mapService.map2.removeLayer(otpLayers);

            var polygons = otpService.getTravelTime([e.latlng.lat,e.latlng.lng]);

            // add polygons to map
            otpLayers = L.geoJson(polygons.features, {style: mapService.getStyle}).addTo(mapService.map2);
        }
    });
});