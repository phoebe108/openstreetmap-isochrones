/**
 * Created by phoebe on 5/1/16.
 */

module.exports = angular.module('app').service('otpService', function() {

    var otpService = {};

    // rework json into Leaflet-recognizable GeoJSON
    otpService.getProperGeojsonFormat = function (data) {
        var isoGeojson = {"type": "FeatureCollection", "features": []};

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
        //$rootScope.$broadcast('isochrones', {isoGeom: isoGeojson});
        return isoGeojson;
    };

    // get OTP isochrones
    otpService.getTravelTime = function otpIso(coordinates) {
        var url = 'http://localhost:8080/otp/routers/default/isochrone?&fromPlace=' + coordinates + '&date=2015/01/09&time=12:00:00&mode=WALK&walkSpeed=4&cutoffSec=600&cutoffSec=1200&cutoffSec=2400&callback=JSON_CALLBACK';

        // request to OTP service for json isochrone polygons
        $http.jsonp(url)
            .success(function(response) {
                otpService.getProperGeojsonFormat(response);
            })
            .error(function(response) {
                console.log(response);
            });
    };
});

