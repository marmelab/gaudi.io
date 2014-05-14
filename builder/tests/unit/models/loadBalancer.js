/*global describe,module,beforeEach,inject,it,expect*/

describe('Model: loadBalancer', function () {
    'use strict';

    // instantiate service
    var componentFactory;

    // load the service's module
    beforeEach(module('gaudiBuilder'));

    beforeEach(inject(function ($injector) {
        componentFactory = $injector.get('componentFactory');
    }));

    it('should set backends to a loadBalancer when linking an HttpServer', function () {
        var varnish = new componentFactory.LoadBalancer({type: 'varnish', name: 'lb'}),
            apache1 = new componentFactory.HttpServer({type: 'apache', name: 'app1', 'class': 'HttpServer'}),
            apache2 = new componentFactory.HttpServer({type: 'apache', name: 'app2', 'class': 'HttpServer'});

        varnish.createLink(apache1);
        varnish.createLink(apache1);
        varnish.createLink(apache2);

        expect(varnish.custom.backends).toEqual(['app1', 'app2']);
        expect(varnish.links).toEqual(['app1', 'app2']);
    });

    it('should remove backend to a loadBalancer when unlinking an HttpServer', function () {
        var varnish = new componentFactory.LoadBalancer({type: 'varnish', name: 'lb'}),
            apache1 = new componentFactory.HttpServer({type: 'apache', name: 'app1', 'class': 'HttpServer'}),
            apache2 = new componentFactory.HttpServer({type: 'apache', name: 'app2', 'class': 'HttpServer'});

        varnish.createLink(apache1);
        varnish.createLink(apache1);
        varnish.createLink(apache2);

        expect(varnish.custom.backends).toEqual(['app1', 'app2']);
        expect(varnish.links).toEqual(['app1', 'app2']);

        varnish.removeLink(apache1);

        expect(varnish.custom.backends).toEqual(['app2']);
        expect(varnish.links).toEqual(['app2']);
    });
});
