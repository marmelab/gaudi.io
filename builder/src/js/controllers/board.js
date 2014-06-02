/*global angular,require*/

window._            = require('underscore/underscore');
window.Backbone     = require('backbone');
window.Backbone.$   = $;
var graphElement    = require('jointjs/element');
var graph           = require('jointjs/graph');

require('angular-bootstrap/src/transition/transition');
require('angular-bootstrap/src/modal/modal');
require('jointjs/paper');
require('directives/droppable');
require('services/selectedComponents');

angular.module('gaudiBuilder').controller('boardCtrl', function ($scope, $modal, $templateCache, selectedComponents, componentFetcher) {
    'use strict';

    $templateCache.put('template/modal/backdrop.html', require('angular-bootstrap/template/modal/backdrop.html'));
    $templateCache.put('template/modal/window.html', require('angular-bootstrap/template/modal/window.html'));

    $scope.components = selectedComponents.components;

    var allComponents = {};

    componentFetcher.getAllComponents().then(function (components) {
        allComponents = components;
    });

    function createLink(targetId) {
        var sourceName = this.get('name'),
            targetName = graph.getCell(targetId).get('name'),
            source = $scope.components[sourceName],
            target = $scope.components[targetName];

        source.createLink(target);

        $scope.$apply();
    }

    function removeLink(sourceId, targetId) {
        var sourceName = graph.getCell(sourceId).get('name'),
            targetName = graph.getCell(targetId).get('name'),
            source = $scope.components[sourceName],
            target = $scope.components[targetName];

        source.removeLink(target);

        $scope.$apply();
    }

    function onRemove() {
        var name = this.get('name'),
            position;

        // Remove element
        delete $scope.components[name];

        // Remove links
        angular.forEach($scope.components, function (component, componentName) {
            if ((position = $.inArray(name, component.links)) >= 0) {
                component.links.splice(position, 1);
            }
        });

        $scope.$apply();
    }

    function onOpenDetail() {
        var componentName = this.get('name'),
            editModal;

        editModal = $modal.open({
            templateUrl: '/builder/views/edit-component.html',
            controller: 'editComponentCtrl',
            resolve: {
                values: function () {
                    var values = $scope.components[componentName];
                    values.name = componentName;

                    return values;
                }
            }
        });

        editModal.result.then(function (formData) {
            // Detect component name changes
            if (formData.name !== componentName) {
                delete $scope.components[componentName];

                // Update links name of other components
                angular.forEach($scope.components, function (otherComponent) {
                    otherComponent.changeLinkedComponentName(formData.name, componentName);
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

    $scope.handleDrop = function (component, board, event) {
        var
            droppableDocumentOffset = $(board).offset(),
            left = (event.x || event.clientX) - droppableDocumentOffset.left - (component.clientWidth / 2),
            top = (event.y || event.clientY) - droppableDocumentOffset.top - (component.clientHeight / 2),
            type = component.attributes['data-type'].value,
            name = selectedComponents.getElementName(type),
            componentInstance = allComponents[type],
            isBinary = component.attributes['data-binary'].value === 'true',
            rect;

        rect = new graphElement({
            position: { x: left, y: top },
            size: { width: 216, height: 90 },
            name: name,
            logo: component.attributes['data-logo'].value,
            binary: isBinary,
            options: {interactive: true}
        });

        graph.addCell(rect);
        rect.on('createLink', createLink);
        rect.on('removeLink', removeLink);
        rect.on('onOpenDetail', onOpenDetail);
        rect.on('onRemove', onRemove);

        $scope.components[name] = angular.copy(componentInstance);
        $scope.components[name].name = name;

        $scope.$apply();
    };
});
