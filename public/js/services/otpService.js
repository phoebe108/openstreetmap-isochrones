/**
 * Created by phoebe on 5/1/16.
 */

module.exports = angular.module('app').service('otpService', function($http) {

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
        //$http.jsonp(url)
        //    .success(function(response) {
        //        otpService.getProperGeojsonFormat(response);
        //    })
        //    .error(function(response) {
        //        console.log(response);
        //    });
        console.log('calculating isochrones');
    };

    // get color depending on travel time value
    otpService.getColor = function (t) {
        return t == "Isochrone 600 sec" ? 'red' :
            t == "Isochrone 1200 sec"  ? '#E32C21' :
                t == "Isochrone 1800 sec"  ? '#F6642E' :
                    t == "Isochrone 2400 sec"  ? '#FD9C44' :
                        t == "Isochrone 3000 sec"   ? '#FECC5C' :
                            t == "Isochrone 3600 sec"   ? '#FEF29C' :
                                '#ffffe5';
    };

    // get opacity depending on travel time value
    otpService.getFillOpacity = function (t2) {
        return t2 == "Isochrone 600 sec" ? 0.40 :
            t2 == "Isochrone 1200 sec" ? 0.40 :
                t2 == "Isochrone 1800 sec" ? 0.40 :
                    t2 == "Isochrone 2400 sec" ? 0.40 :
                        t2 == "Isochrone 3000 sec"  ? 0.45 :
                            t2 == "Isochrone 3600 sec"  ? 0.50 :
                                1;
    };

    // generate the way travel time isochrones will look
    otpService.getStyle = function getStyle(feature) {
        return {
            fillOpacity: getFillOpacity(feature.properties.name),
            color: 'white',
            weight: 1,
            opacity: 0.7,
            fillColor: getColor(feature.properties.name)
        };
    };


    return otpService;
});

