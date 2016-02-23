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