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



    // retrieve clicked map location coordinates
    map.on('click', function(e) {
        removeIsoLayer();
        $rootScope.$broadcast('mapClick', {coords: [e.latlng.lat,e.latlng.lng]});
    });

    // add isochrone polygons to map
    $scope.$on('isochrones', function(event, args) {
        $scope.isochroneLayer = L.geoJson(args.isoGeom).addTo(map);
    });
});