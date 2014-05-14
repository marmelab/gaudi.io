/*global describe,module,beforeEach,inject,it,expect*/

describe('Model: httpServer', function () {
    'use strict';

    // instantiate service
    var componentFactory;

    // load the service's module
    beforeEach(module('gaudiBuilder'));

    beforeEach(inject(function ($injector) {
        componentFactory = $injector.get('componentFactory');
    }));

    it('should create fastCgi custom fields', function () {
        var apache = new componentFactory.HttpServer({type: 'apache', valid: true});
        var hhvm = new componentFactory.Component({type: 'hhvm', name: 'app1'});

        apache.onCreateLink(hhvm);

        expect(apache.custom.fastCgi).toBe('app1');
    });
});
