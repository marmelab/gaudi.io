/*global angular,require*/

require('directives/draggable');
require('services/componentFetcher');

angular.module('gaudiBuilder').controller('componentsCtrl', function ($scope, componentFetcher) {
    'use strict';

    $scope.components = [];
    $scope.search = {
        label: ''
    };

    componentFetcher.getAllComponents().then(function (components) {
        for(var i in components) {
            if (components.hasOwnProperty(i)) {
                $scope.components.push(components[i]);
            }
        }
    });
});
