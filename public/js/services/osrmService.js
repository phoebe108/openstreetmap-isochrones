/**
 * Created by phoebe on 5/1/16.
 */

module.exports = angular.module('app').service('osrmService', function() {

    var osrmService = {};

    // get OSRM isochrones
    osrmService.getTravelTime = function (coordinates) {
        $http.post('/osrm', coordinates)
            .success(function(response) {
                return response;
            })
            .error(function(response) {
                console.log(response);
            });
    };

});

