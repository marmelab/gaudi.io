/*global define*/

define([
    'app',
    'angular'
], function (app) {
    'use strict';

    app.service('availableComponents', ['$q', '$http', function ($q, $http) {
        var availableComponents = null;

        /**
         * Retrieve all components
         *
         * @returns {promise}
         */
        function getAllComponents() {
            var deferred = $q.defer();

            if (availableComponents) {
                deferred.resolve(availableComponents);
            } else {
                $http.get('data/components.json').success(function (data) {
                    availableComponents = data;

                    deferred.resolve(data);
                });
            }

            return deferred.promise;
        }

        return {
            getAllComponents: getAllComponents
        };
    }]);
});
