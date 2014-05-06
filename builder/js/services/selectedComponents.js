/*global define*/

define([
    'app'
], function (app) {
    'use strict';

    app.factory('selectedComponents', function () {
        var components = {};

        function getElementName(type) {
            type = type.replace('-', '_');
            if (components[type] === undefined) {
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


        return {
            components: components,
            getElementName: getElementName
        };
    });
});
