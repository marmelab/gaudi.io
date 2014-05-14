/*global module*/

var Component = function (attributes) {
    'use strict';

    var self = this;

    for (var name in attributes) {
        if (attributes.hasOwnProperty(name)) {
            this[name] = attributes[name];
        }
    }

    this.custom = {};
    this.links = [];

    // Set default values for common & custom fields
    angular.forEach(this.fields, function(field, fieldName) {
        self[fieldName] = field.default || '';
    });

    angular.forEach(this.customFields, function(customField, customFieldName) {
        self.custom[customFieldName] = customField.default || '';
    });
};

Component.prototype.onCreateLink = function (target) {
    'use strict';

    if (this.links.indexOf(target.name) === -1) {
        this.links.push(target.name);
    }
};

Component.prototype.onRemoveLink = function (oldTarget) {
    'use strict';

    var position;

    if (oldTarget !== undefined && (position = this.links.indexOf(oldTarget.name)) >= 0) {
        this.links.splice(position, 1);
    }
};

/**
 * Parse values like "80: 80, 8080: 8080" to {80: 80}, {8080: 80}
 *
 * @param {String} map
 * @return {Array}
 */
Component.prototype.parseMapValue = function (map) {
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
};

Component.prototype.getFormattedValue = function(field, value) {
    // Check if the value is a map
    if (field.multiple === true && typeof value === 'string' && value !== '') {
        value = this.parseMapValue(value);
    }

    // Check if the value is an array
    if (field.array === true && typeof value === 'string' && value !== '') {
        value = value.split(/,\s*/);
    }

    return value;
};

Component.prototype.getOutputFields = function() {
    var self = this,
        results = {
            type: this.type,
            custom: {}
        };

    angular.forEach(this.fields, function(field, fieldName) {
        results[fieldName] = self.getFormattedValue(field, self[fieldName]);
    });

    angular.forEach(this.customFields, function(customField, customFieldName) {
        results.custom[customFieldName] = self.getFormattedValue(customField, self.custom[customFieldName]);
    });

    return results;
};

module.exports = Component;
