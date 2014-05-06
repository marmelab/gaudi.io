/*global define,$ */

define([
    'app',
    'angular',
    'services/availableComponents'
], function (app) {
    'use strict';

    app.controller('componentsCtrl', function ($scope, availableComponents) {
        $scope.availableComponents = {};

        availableComponents.getAllComponents().then(function(components) {
            $scope.components = components;
        });

        function initDraggable() {
            $(".components li:not([class*='fixed'])").draggable({
                revert: "invalid",
                helper: "clone"
            });
        }

        $scope.$on('onDisplayComponents', initDraggable);
    });
});
