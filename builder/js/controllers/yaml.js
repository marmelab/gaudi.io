/*global define,document */

define([
    'app',
    'services/selectedComponents',
    'services/yamlParser'
], function (app) {
    'use strict';

    app.controller('yamlCtrl', function ($scope, selectedComponents, yamlParser) {

        $scope.components = selectedComponents.components;

        $scope.getFileResult = function () {
            var results = $scope.components ? {applications: $scope.components} : '';
            results = yamlParser.cleanEmptyObjects(JSON.parse(JSON.stringify(results)));

            return yamlParser.dump(results, 5);
        };

        $scope.generateFile = function () {
            var fakeLink = document.createElement('a');

            fakeLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.getFileResult()));
            fakeLink.setAttribute('download', '.gaudi.yml');
            fakeLink.click();
        };
    });
});
