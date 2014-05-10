/*global require,angular*/

require('services/yamlParser');

angular.module('gaudiBuilder').controller('editComponentCtrl', function ($scope, $modalInstance, $compile, selectedComponents, componentFetcher, yamlParser, values) {
    'use strict';

    var allComponents = {};

    componentFetcher.getAllComponents().then(function (components) {
        allComponents = components;

        // Inject fields types
        $scope.fields = {
            common: allComponents[values.type].fields,
            custom: allComponents[values.type].customFields || null
        };

        // Inject fields values
        $scope.componentNames = Object.keys(selectedComponents.components);
        $scope.values = values;
        $scope.values.custom = values.custom || {};
    });

    $scope.ok = function () {
        $modalInstance.close({name: $scope.values.name, values: $scope.values});
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
