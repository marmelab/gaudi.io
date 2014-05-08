/*global angular*/

/**
 * @see: http://blog.parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html
 */
angular.module('gaudiBuilder').directive('draggable', function () {
    'use strict';

    return function (scope, element) {
        // this gives us the native JS object
        var el = element[0];
        el.draggable = true;

        el.addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('id', this.id);
            this.classList.add('drag');

            return false;
        }, false);

        el.addEventListener('dragend', function () {
            this.classList.remove('drag');

            return false;
        }, false);
    };
});
