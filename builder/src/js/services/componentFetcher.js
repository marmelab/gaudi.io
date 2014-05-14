/*global require,angular*/

var yaml = require('services/componentFactory');

angular.module('gaudiBuilder').service('componentFetcher', function ($q, $http, componentFactory) {
    'use strict';

    var availableComponents = null;

    /**
     * Retrieve all components
     *
     * @returns {promise}
     */
    function getAllComponents() {
        var deferred = $q.defer(),
            component;

        if (availableComponents) {
            deferred.resolve(availableComponents);
        } else {
            $http.get('data/components.json').success(function (rawComponents) {
                availableComponents = {};

                angular.forEach(rawComponents, function (rawComponent, type) {
                    rawComponent.type = type;
                    component = new componentFactory[rawComponent.class](rawComponent);

                    availableComponents[type] = component;
                });

                deferred.resolve(availableComponents);
            }).error(deferred.reject);
        }

        return deferred.promise;
    }

    return {
        getAllComponents: getAllComponents
    };
});
