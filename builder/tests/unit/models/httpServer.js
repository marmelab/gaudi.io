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
        var apache = new componentFactory.HttpServer({type: 'apache', valid: true}),
            hhvm = new componentFactory.Component({type: 'hhvm', name: 'app1'});

        apache.createLink(hhvm);

        expect(apache.custom.fastCgi).toBe('app1');
        expect(apache.links).toEqual(['app1']);
    });

    it('should remove fastCgi custom fields when link is removed', function () {
        var apache = new componentFactory.HttpServer({type: 'apache', valid: true}),
            hhvm = new componentFactory.Component({type: 'hhvm', name: 'app1'});

        apache.createLink(hhvm);
        expect(apache.custom.fastCgi).toBe('app1');

        apache.removeLink(hhvm);
        expect(apache.custom.fastCgi).toBe(null);
        expect(apache.links).toEqual([]);
    });

    it('Should rename other element when they change their name', function () {
        var apache = new componentFactory.HttpServer({type: 'apache', valid: true}),
            hhvm = new componentFactory.Component({type: 'hhvm', name: 'app1'});

        apache.createLink(hhvm);
        expect(apache.custom.fastCgi).toBe('app1');

        apache.changeLinkedComponentName('app', 'app1');
        expect(apache.custom.fastCgi).toBe('app');
    });
});
