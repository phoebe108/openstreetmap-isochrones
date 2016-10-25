/**
 * Created by phoebe on 5/1/16.
 */

module.exports = angular.module('app').service('osrmService', function($http) {

    var osrmService = {};

    // get OSRM isochrones
    osrmService.getTravelTime = function (coordinates, callback) {
        $http.post('/osrm', coordinates)
            .success(function(response) {
                callback(response);
            })
            .error(function(response) {
                console.log(response);
            });
    };

    // create style for osrm isochrones
    osrmService.getStyle = function (geom) {
        geom.features.forEach(function(feature) {
            return {
                color: 'red',
                weight: 5,
                opacity: 1
            };
        });

    };

    return osrmService;
});

