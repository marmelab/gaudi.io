/*global require,angular*/

require('services/yamlParser');

angular.module('gaudiBuilder').controller('editComponentCtrl', function ($scope, $modalInstance, $compile, selectedComponents, componentFetcher, yamlParser, values) {
    'use strict';

    var allComponents = {};

    componentFetcher.getAllComponents().then(function (components) {
        allComponents = components;

        // Inject fields types
        $scope.fields = {};
        $scope.fields.custom = allComponents[values.type].customFields;
        $scope.fields.standard = allComponents[values.type].fields;

        // Inject fields values
        $scope.componentNames = Object.keys(selectedComponents.components);
        $scope.values = values;
        $scope.values.custom = $scope.values.custom || {};
        $scope.values.standard = $scope.values.standard || {};
    });

    $scope.ok = function () {
        var name = $scope.values.name,
            componentFields = allComponents[$scope.values.type].fields;

        delete $scope.values.name;

        // Merge standard values with root element
        angular.forEach($scope.values.standard, function (standardValue, standardName) {
            // Check if the value is a map
            if (typeof componentFields[standardName].multiple !== 'undefined' && componentFields[standardName].multiple && typeof standardValue === 'string') {
                standardValue = yamlParser.parseMapValue(standardValue);
            }

            $scope.values[standardName] = standardValue;
        });

        delete $scope.values.standard;

        if (!Object.keys($scope.values.custom).length) {
            delete $scope.values.custom;
        }

        $modalInstance.close({name: name, values: $scope.values});
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
