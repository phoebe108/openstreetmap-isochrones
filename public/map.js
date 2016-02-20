/**
 * Created by phoebe on 2/18/16.
 */

module.exports = angular.module('app').controller('MapCtrl', function($scope) {

    var map = L.map('map').setView([-1.265236,36.806609], 13);
    var coords = '';

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

    // retrieve clicked map location coordinates
    map.on('click', function(e) {
        removeIsoLayer();
        coords = [e.latlng.lat,e.latlng.lng];
    });
});