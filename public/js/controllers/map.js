/**
 * Created by phoebe on 2/18/16.
 */

module.exports = angular.module('app').controller('MapCtrl', function ($scope, osrmService, otpService, TravelTool) {

    $scope.osrmButton = 'ENABLE';
    $scope.otpButton = 'ENABLE';

    var tools = {
        osrm: new TravelTool('map1', osrmService.getTravelTime, osrmService.isoLineStyle),
        otp: new TravelTool('map2', otpService.getTravelTime, otpService.getStyle)
    };

    $scope.toggleTravel = function (tool) {
        if ($scope[tool + 'Button'] === 'ENABLE') {
            $scope[tool + 'Button'] = 'DISABLE';
            tools[tool].enabled = true;
        } else {
            $scope[tool + 'Button'] = 'ENABLE';
            tools[tool].enabled = false;
            tools[tool].removeLayers();
        }
    };
});