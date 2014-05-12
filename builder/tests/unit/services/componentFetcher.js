/*global describe,module,beforeEach,inject,it,expect*/

describe('Service: componentFetcher', function () {
    'use strict';

    // load the service's module
    beforeEach(module('gaudiBuilder'));

    // instantiate service
    var componentFetcher;

    beforeEach(inject(function ($injector) {
        componentFetcher = $injector.get('componentFetcher');
    }));

    it('should do return good values', function () {
        expect(true).toBe(true);
    });
});
