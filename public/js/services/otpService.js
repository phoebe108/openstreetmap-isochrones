/**
 * Created by phoebe on 5/1/16.
 */

module.exports = angular.module('app').service('otpService', function($http) {

    var otpService = {};

    // get OTP isochrones
    otpService.getTravelTime = function (coordinates, callback) {
        var url = 'http://localhost:8080/otp/routers/default/isochrone?&fromPlace=' + coordinates + '&date=2015/01/09&time=12:00:00&mode=WALK&walkSpeed=4&cutoffSec=600&cutoffSec=1200&cutoffSec=2400';

        // request to OTP service for json isochrone polygons
        $http.get(url)
            .success(function(response) {
                //otpService.getProperGeojsonFormat(response);
                callback(response);
            })
            .error(function(response) {
                console.log(response);
            });
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
    otpService.getStyle = function (geom) {
        geom.features.forEach(function(feature) {
            return {
                fillOpacity: otpService.getFillOpacity(feature.properties.time),
                color: 'white',
                weight: 1,
                opacity: 0.7,
                fillColor: otpService.getColor(feature.properties.time)
            };
        });

    };


    return otpService;
});

