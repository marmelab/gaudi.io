/*global angular,require,_,YamlEscaper*/

var yaml = require('yamljs/bin/yaml');

YamlEscaper.prototype.requiresSingleQuoting = function () {
    'use strict';

    return false;
};

angular.module('gaudiBuilder').service('yamlParser', function () {
    'use strict';

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

            key = mapDetails[0].trim();
            value = mapDetails[1].trim();

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

            if (prop === 'common' || prop === 'binary') {
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

    function cleanResult(object) {
        for (var prop in object) {
            if (!object.hasOwnProperty(prop)) {
                continue;
            }

            // Remove binary field & empty string
            if (prop === 'binary' || object[prop] === '') {
                delete object[prop];
                continue;
            }

            if(typeof object[prop] === 'object') {
                object[prop] = cleanResult(object[prop]);
            }
        }

        return object;
    }

    /**
     * Dump an Object to a YAML string
     *
     * @param {Object} object
     * @param {Number} depth
     * @returns {String}
     */
    function dump(object, depth) {
        if (_.isEmpty(object)) {
            return '';
        }

        return yaml.stringify(object, depth);
    }

    return {
        parseMapValue: parseMapValue,
        cleanEmptyObjects: cleanEmptyObjects,
        cleanResult: cleanResult,
        dump: dump
    };
});
