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

angular.module('gaudiBuilder').controller('boardCtrl', function ($scope, $modal, selectedComponents, $templateCache) {
    'use strict';

    $templateCache.put('template/modal/backdrop.html', require('angular-bootstrap/template/modal/backdrop.html'));
    $templateCache.put('template/modal/window.html', require('angular-bootstrap/template/modal/window.html'));

    $scope.components = selectedComponents.components;

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
            templateUrl: 'views/edit-component.html',
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

    $scope.handleDrop = function (component, board, event) {
        var
            droppableDocumentOffset = $(board).offset(),
            left = event.x - droppableDocumentOffset.left,
            top = event.y - droppableDocumentOffset.top,
            type = component.attributes['data-type'].value,
            name = selectedComponents.getElementName(type),
            rect;

        rect = new graphElement({
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
