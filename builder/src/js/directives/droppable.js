/*global angular,document*/

angular.module('gaudiBuilder').directive('droppable', function () {
    'use strict';

    return {
        scope: {
            droppable: '='
        },
        link: function (scope, element) {
            var el = element[0];

            el.addEventListener('dragover', function (e) {
                e.dataTransfer.dropEffect = 'move';

                if (e.preventDefault) {
                    e.preventDefault();
                }

                return false;
            }, false);

            el.addEventListener('drop', function (e) {
                // Stops some browsers from redirecting.
                if (e.stopPropagation) {
                    e.stopPropagation();
                }

                var elementDropped = document.getElementById(e.dataTransfer.getData('id')),
                    dropMethod = scope.droppable;

                // call the drop passed drop function
                if (typeof dropMethod === 'function') {
                    scope.droppable(elementDropped, element[0], e);
                }

                return false;
            }, false);
        }
    };
});
