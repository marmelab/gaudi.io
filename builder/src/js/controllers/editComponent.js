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
        var name = $scope.values.name,
            componentFields = allComponents[$scope.values.type].fields;

        delete $scope.values.name;

        // Merge common values with root element
        angular.forEach($scope.values, function (value, name) {
            if (componentFields[name] === undefined) {
                return;
            }

            // Check if the value is a map
            if (componentFields[name].multiple === true && typeof value === 'string' && value !== '') {
                $scope.values[name] = yamlParser.parseMapValue(value);
            }

            // Check if the value is an array
            if (componentFields[name].array === true && typeof value === 'string' && value !== '') {
                $scope.values[name] = value.split(/,\s*/);
            }
        });

        $modalInstance.close({name: name, values: $scope.values});
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
