/*global angular,require*/

require('directives/draggable');
require('services/componentFetcher');

angular.module('gaudiBuilder').controller('componentsCtrl', function ($scope, componentFetcher) {
    'use strict';

    $scope.components = {};

    componentFetcher.getAllComponents().then(function (components) {
        $scope.components = components;
    });
});
