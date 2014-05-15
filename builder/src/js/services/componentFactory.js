/*global require,angular*/

angular.module('gaudiBuilder').service('componentFactory', function () {
    'use strict';

    return {
        Component: require('models/components/component'),
        Database: require('models/components/database'),
        HttpServer: require('models/components/httpServer'),
        LoadBalancer: require('models/components/loadBalancer')
    };
});
