/*global angular, require*/

angular.module('gaudiBuilder').factory('selectedComponents', function () {
    'use strict';

    var components = {};

    /**
     * Return a name available for a component
     *
     * @param {String} type
     * @returns {String}
     */
    function getElementName(type) {
        type = type.replace('-', '_');
        if (components[type] === undefined) {
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

        return getElementName(newName);
    }

    return {
        components: components,
        getElementName: getElementName
    };
});
