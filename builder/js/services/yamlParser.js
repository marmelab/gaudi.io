/*global define*/

define([
    'app',
    'angular',
    'jquery',
    'underscore',
    'yamlDumper',
    'yamlEscaper'
], function (app, angular, $, _, YamlDumper, YamlEscaper) {
    'use strict';

    YamlEscaper.prototype.requiresSingleQuoting = function () {
        return false;
    };

    var dumper = new YamlDumper();

    app.service('yamlParser', function () {

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
                    value = parseInt(value, 10);
                }

                if (/^\d+$/.test(key)) {
                    key = parseInt(key, 10);
                }

                results[key] = value;
            });

            return results;
        }

        /**
         * Remove empty objects recursively from another object
         *
         * @param {Object} object
         * @returns {Object}
         */
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

        function dump(object, depth) {
            if (_.isEmpty(object)) {
                return '';
            }

            return dumper.dump(object, depth);
        }

        return {
            parseMapValue: parseMapValue,
            cleanEmptyObjects: cleanEmptyObjects,
            dump: dump
        };
    });
});
