/**
 * Created by phoebe on 10/9/16.
 */

module.exports = angular.module('app').factory('TravelTool', function () {
    // TravelTool constructor function:
    // used to create new TravelTool instances in the controller
    function TravelTool(map, calc, getStyle) {
        // define basemap layer
        var basemap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18
        });

        // define leaflet maps
        this.map = L.map(map).setView([-1.265236, 36.806609], 13);

        // add basemap
        basemap.addTo(this.map);

        // map layers
        this.layers = [];
        this.enabled = false;
        this.calc = function(coords) {
            calc(coords);

        };
        // creating reference to "this" for the following event handler
        var self = this;

        // on map click, perform travel time analysis
        this.map.on('click', function (e) {
            if (self.enabled === true) {

                // remove map layer if exists
                if (self.layers.length > 0) {
                    self.map.removeLayer(self.layers);
                }
                var polygons = self.calc([e.latlng.lat, e.latlng.lng]);

                // add polygons to map
                self.layers = L.geoJson(polygons.features, {style: getStyle}).addTo(self.map);
            }

        });
    }

    return TravelTool;
});