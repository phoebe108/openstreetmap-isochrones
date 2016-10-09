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

        // calculate layers
        this.calc = function (coords, callback) {
            calc(coords, callback);
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
                self.calc([e.latlng.lat, e.latlng.lng], self.addLayers);
            }

        });

        // add layers to map
        this.addLayers = function (geom) {
            self.layers.push(L.geoJson(geom, {style: getStyle(geom)}).addTo(self.map));
        };
    }

    return TravelTool;
});