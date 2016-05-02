/**
 * Created by phoebe on 5/1/16.
 */

module.exports = angular.module('app').service('mapService', function() {

    var mapService = {};

    // define leaflet maps
    mapService.map1 = L.map('map1').setView([-1.265236,36.806609], 13);
    mapService.map2 = L.map('map2').setView([-1.265236,36.806609], 13);

    // add basemap
    mapService.addBasemap = function (map) {
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18
        }).addTo(map);
    };

    // isoline style
    mapService.isoLineStyle = {
        "color": 'red',
        "weight": 5,
        "opacity": 1
    };

    // get color depending on travel time value
    mapService.getColor = function (t) {
        return t == "Isochrone 600 sec" ? 'red' :
            t == "Isochrone 1200 sec"  ? '#E32C21' :
                t == "Isochrone 1800 sec"  ? '#F6642E' :
                    t == "Isochrone 2400 sec"  ? '#FD9C44' :
                        t == "Isochrone 3000 sec"   ? '#FECC5C' :
                            t == "Isochrone 3600 sec"   ? '#FEF29C' :
                                '#ffffe5';
    };

    // get opacity depending on travel time value
    mapService.getFillOpacity = function (t2) {
        return t2 == "Isochrone 600 sec" ? 0.40 :
            t2 == "Isochrone 1200 sec" ? 0.40 :
                t2 == "Isochrone 1800 sec" ? 0.40 :
                    t2 == "Isochrone 2400 sec" ? 0.40 :
                        t2 == "Isochrone 3000 sec"  ? 0.45 :
                            t2 == "Isochrone 3600 sec"  ? 0.50 :
                                1;
    };

    // generate the way travel time isochrones will look
    mapService.getStyle = function getStyle(feature) {
        return {
            fillOpacity: getFillOpacity(feature.properties.name),
            color: 'white',
            weight: 1,
            opacity: 0.7,
            fillColor: getColor(feature.properties.name)
        };
    };

});

