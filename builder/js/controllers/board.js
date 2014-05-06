/*global define,document,$ */

define([
    'app',
    'angular',
    'joint',
    'jquery',
    'jqueryui',
    'graph/element',
    'services/selectedComponents'
], function (app, angular, joint, $) {
    'use strict';

    var graph = new joint.dia.Graph();

    new joint.dia.Paper({
        el: document.getElementById('graphContainer'),
        width: '100%',
        height: $('.sidebar').height(),
        gridSize: 1,
        model: graph
    });

    app.controller('boardCtrl', function ($scope, $modal, selectedComponents) {
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

        $("#graphContainer").droppable({
            accept: '.list-group-item',
            drop: function (event, ui) {
                var
                    element = ui.draggable[0],
                    draggableDocumentOffset = ui.helper.offset(),
                    droppableDocumentOffset = $(this).offset(),
                    left = draggableDocumentOffset.left - droppableDocumentOffset.left,
                    top = draggableDocumentOffset.top - droppableDocumentOffset.top,
                    type = element.attributes['data-type'].value,
                    name = selectedComponents.getElementName(type),
                    rect;

                rect = new joint.shapes.html.GaudiGraphComponent({
                    position: { x: left, y: top },
                    size: { width: 216, height: 90 },
                    label: $(element).find('.element').html().trim(),
                    name: name
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
            }
        });
    });
});
