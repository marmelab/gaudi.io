/*global angular, require*/

angular.module('gaudiBuilder').service('selectedComponents', function () {
    'use strict';

    this.components = {};

    /**
     * Return a name available for a component
     *
     * @param {String} type
     * @returns {String}
     */
    this.getElementName = function (type) {
        type = type.replace('-', '_');
        if (this.components[type] === undefined) {
            return type;
        }

        var parts = type.split('_'),
            nbParts = parts.length,
            newName;

        if (nbParts > 1 && parseInt(parts[nbParts - 1], 10) > 0) {
            newName = parts.slice(0, nbParts - 1).join('_') + '_' + (Number(parts[nbParts - 1]) + 1);
        } else {
            newName = type + '_' + 1;
        }

        return this.getElementName(newName);
    };
});
