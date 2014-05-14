/*global describe,module,beforeEach,inject,it,expect*/

describe('Model: database', function () {
    'use strict';

    // instantiate service
    var componentFactory;

    // load the service's module
    beforeEach(module('gaudiBuilder'));

    beforeEach(inject(function ($injector) {
        componentFactory = $injector.get('componentFactory');
    }));

    it('should create master/slave relationship when linking 2 databases', function () {
        var master = new componentFactory.Database({type: 'mysql', name: 'master1'}),
            slave = new componentFactory.Component({type: 'mysql', name: 'slave1'});

        master.createLink(slave);

        expect(master.custom.repl).toBe('master');
        expect(slave.custom.repl).toBe('slave');
        expect(slave.custom.master).toBe('master1');
    });

    it('should remove master/slave relationship when unlinking 2 databases', function () {
        var master = new componentFactory.Database({type: 'mysql', name: 'master1'}),
            slave = new componentFactory.Component({type: 'mysql', name: 'slave1'});

        master.createLink(slave);

        expect(master.custom.repl).toBe('master');
        expect(slave.custom.repl).toBe('slave');
        expect(slave.custom.master).toBe('master1');

        master.removeLink(slave);

        expect(master.custom.repl).toBe(null);
        expect(slave.custom.repl).toBe(null);
        expect(slave.custom.master).toBe(null);
    });
});
