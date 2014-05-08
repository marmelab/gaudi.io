/*global angular,$,_,joint,YamlDumper,document,require,window*/

require('angular/angular');
require('angular-route/angular-route');
require('angular-bootstrap/src/transition/transition');
require('angular-bootstrap/src/modal/modal');
require('underscore/underscore');
var yaml = require('yamljs/bin/yaml');

var $ = require('jquery');
window.jQuery = $;

window._ = require('underscore/underscore');

window.Backbone = require('backbone');
window.Backbone.$ = $;
window.Backbone.$ = $;

// require jointjs
require('./joint');

require('./gaudi-graph-element');

var gaudiConfigBuilder = angular.module('gaudiConfigBuilder', ['ui.bootstrap.modal']);

require('./directives/draggable');
require('./directives/droppable');

var graph = new joint.dia.Graph();

YamlEscaper.prototype.requiresSingleQuoting = function () {
    return false;
};

var paper = new joint.dia.Paper({
    el: $('#graphContainer'),
    width: '100%',
    height: $('.sidebar').height(),
    gridSize: 1,
    model: graph
});

gaudiConfigBuilder.factory('builder', function () {
    return {
        components: {},
        availableComponents: {}
    };
});

/**
 * Parse values like "80: 80, 8080: 8080" to [{80: 80}, {8080: 80}]
 *
 * @param {String} map
 * @return {Array}
 */
function parseMapValue(map) {
    var results = {},
        rawValues = map.split(','),
        key,
        value,
        mapDetails;

    angular.forEach(rawValues, function (rawValue) {
        mapDetails = rawValue.split(':');

        key = $.trim(mapDetails[0]);
        value = $.trim(mapDetails[1]);

        if (/^\d+$/.test(value)) {
            value = parseInt(value);
        }

        if (/^\d+$/.test(key)) {
            key = parseInt(key);
        }

        results[key] = value;
    });

    return results;
}

gaudiConfigBuilder.controller('componentsController', function ($scope, $http, builder) {
    $scope.availableComponents = {};

    $http.get('data/components.json').success(function (data) {
        $scope.availableComponents = data;
        builder.availableComponents = data;
    });
});


gaudiConfigBuilder.controller('boardController', function ($scope, $modal, builder) {
    $scope.components = builder.components;

    function onCreateLink(targetId) {
        var name = this.get('name'),
            currentComponent = $scope.components[name],
            linkedType = graph.getCell(targetId).get('name');

        if ($.inArray(linkedType, currentComponent.links) < 0) {
            currentComponent.links.push(linkedType);
        }

        $scope.$apply();
    }

    function onRemoveLink(sourceId, targetId) {
        var sourceName = graph.getCell(sourceId).get('name'),
            targetName = graph.getCell(targetId).get('name'),
            source = $scope.components[sourceName],
            position;

        if (source !== undefined && (position = $.inArray(targetName, source.links)) >= 0) {
            source.links.splice(position, 1);
        }

        $scope.$apply();
    }

    function onRemove() {
        var name = this.get('name'),
            position;

        // Remove element
        delete $scope.components[name];

        // Remove links
        angular.forEach($scope.components, function (componentName, component) {
            if ((position = $.inArray(name, component.links)) >= 0) {
                component.links = component.links.splice(position, 1);
            }
        });

        $scope.$apply();
    }

    function onOpenDetail() {
        var componentName = this.get('name'),
            editModal;

        editModal = $modal.open({
            templateUrl: 'edit-component.html',
            controller: 'editComponentController',
            resolve: {
                values: function () {
                    var values = $scope.components[componentName];
                    values.name = componentName;

                    return values;
                }
            }
        });

        editModal.result.then(function (formData) {
            if (formData.name !== componentName) {
                delete $scope.components[componentName];

                // Update links name of other components
                angular.forEach($scope.components, function (otherName, otherComponent) {
                    angular.forEach(otherComponent.links, function (linkIdx, link) {
                        if (otherComponent.links[linkIdx] === componentName) {
                            otherComponent.links[linkIdx] = formData.name;
                        }
                    });
                });

                // Update the name of the jointjs graph element
                var rects = graph.getElements();
                angular.forEach(rects, function (rect) {
                    if (rect.get('name') === componentName) {
                        rect.set('name', formData.name);
                    }
                });
            }

            $scope.components[formData.name] = formData.values;
        });
    }

    function getElementName(type) {
        type = type.replace('-', '_');
        if ($scope.components[type] === undefined) {
            return type;
        }

        var infos = type.split('_'),
            nbInfos = infos.length,
            newName;

        if (nbInfos > 1 && parseInt(infos[nbInfos - 1], 10) > 0) {
            newName = infos.slice(0, nbInfos - 1).join('_') + '_' + (Number(infos[nbInfos - 1]) + 1);
        } else {
            newName = type + '_' + 1;
        }
        return getElementName(newName);
    }

    $scope.handleDrop = function (component, board, event) {
        var
            droppableDocumentOffset = $(board).offset(),
            left = event.x - droppableDocumentOffset.left,
            top = event.y - droppableDocumentOffset.top,
            type = component.attributes['data-type'].value,
            name = getElementName(type),
            rect;

        rect = new joint.shapes.html.GaudiGraphComponent({
            position: { x: left, y: top },
            size: { width: 216, height: 90 },
            name: name,
            logo: component.attributes['data-logo'].value,
            options: {interactive: true}
        });

        graph.addCell(rect);
        rect.on('createLink', onCreateLink);
        rect.on('removeLink', onRemoveLink);
        rect.on('onOpenDetail', onOpenDetail);
        rect.on('onRemove', onRemove);

        $scope.components[name] = {
            type: type,
            links: []
        };

        $scope.$apply();
    };
});

gaudiConfigBuilder.controller('resultController', function ($scope, builder) {
    $scope.components = builder.components;

    function cleanEmptyObjects(object) {
        if (_.isEmpty(object)) {
            return '';
        }

        for (var prop in object) {
            if (!object.hasOwnProperty(prop) || typeof object[prop] !== 'object') {
                continue;
            }

            if (prop === 'standard') {
                delete object[prop];
                continue;
            }

            object[prop] = cleanEmptyObjects(object[prop]);
            if (_.isEmpty(object[prop])) {
                delete object[prop];
            }
        }

        return object;
    }

    $scope.getFileResult = function () {
        var results = $scope.components ? {applications: $scope.components} : '';

        results = cleanEmptyObjects(JSON.parse(JSON.stringify(results)));
        if (_.isEmpty(results)) {
            results = '';
        }

        return yaml.stringify(results, 5);
    };

    $scope.generateFile = function () {
        var fakeLink = document.createElement('a');

        fakeLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.getFileResult()));
        fakeLink.setAttribute('download', '.gaudi.yml');
        fakeLink.click();
    };
});

gaudiConfigBuilder.controller('editComponentController', function ($scope, $modalInstance, $compile, builder, values) {
    // Inject fields types
    $scope.fields = {};
    $scope.fields.custom = builder.availableComponents[values.type].customFields;
    $scope.fields.standard = builder.availableComponents[values.type].fields;

    // Inject fields values
    $scope.componentNames = Object.keys(builder.components);
    $scope.values = values;
    $scope.values.custom = $scope.values.custom || {};
    $scope.values.standard = $scope.values.standard || {};

    $scope.ok = function () {
        var name = $scope.values.name,
            componentFields = builder.availableComponents[$scope.values.type].fields;

        delete $scope.values.name;

        // Merge standard values with root element
        angular.forEach($scope.values.standard, function (standardValue, standardName) {
            // Check if the value is a map
            if (typeof componentFields[standardName].multiple !== undefined && componentFields[standardName].multiple && typeof standardValue === 'string') {
                standardValue = parseMapValue(standardValue);
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
