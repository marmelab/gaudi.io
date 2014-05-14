/*global describe,module,beforeEach,inject,it,expect*/

describe('Model: component', function () {
    'use strict';

    // instantiate service
    var componentFactory;

    // load the service's module
    beforeEach(module('gaudiBuilder'));

    beforeEach(inject(function ($injector) {
        componentFactory = $injector.get('componentFactory');
    }));

    it('should copy each attributes', function () {
        var component = new componentFactory.Component({label: 'hello', valid: true});

        expect(component.label).toBe('hello');
        expect(component.valid).toBe(true);
    });

    it('should create each fields with default values', function () {
        var component = new componentFactory.Component({label: 'hello', fields: {
            port: {default: '80'},
            apt_get: {type: 'choice'}
        }});

        expect(component.port).toBe('80');
        expect(component.apt_get).toBe('');
    });

    it('should create each custom fields with default values', function () {
        var component = new componentFactory.Component({label: 'hello', customFields: {
            documentRoot: {default: '/var/www'},
            module: {type: 'choice'}
        }});

        expect(component.custom.documentRoot).toBe('/var/www');
        expect(component.custom.module).toBe('');
    });

    it('should create links between components', function () {
        var apache = new componentFactory.Component({name: 'apache'});
        var php = new componentFactory.Component({name: 'php'});

        apache.onCreateLink(php);

        expect(apache.links).toEqual(['php']);
    });

    it('should not create link twice', function () {
        var apache = new componentFactory.Component({name: 'apache'});
        var php = new componentFactory.Component({name: 'php'});

        apache.onCreateLink(php);
        apache.onCreateLink(php);

        expect(apache.links).toEqual(['php']);
    });

    it('should remove links', function () {
        var apache = new componentFactory.Component({name: 'apache'});
        var php = new componentFactory.Component({name: 'php'});

        apache.onCreateLink(php);
        apache.onRemoveLink(php);

        expect(apache.links).toEqual([]);
    });

    it('should parse map values', function () {
        var apache = new componentFactory.Component({name: 'apache'});

        expect(apache.parseMapValue('')).toEqual({});
        expect(apache.parseMapValue('80: 80')).toEqual({80: 80});
        expect(apache.parseMapValue('80: 80, 3306:3307')).toEqual({80: 80, 3306: 3307});
    });

    it('should return formatted values', function () {
        var apache = new componentFactory.Component({name: 'apache'});

        expect(apache.getFormattedValue({}, '')).toEqual('');

        expect(apache.getFormattedValue({array: true}, '')).toEqual('');
        expect(apache.getFormattedValue({array: true}, 'a')).toEqual(['a']);
        expect(apache.getFormattedValue({array: true}, 'a,b')).toEqual(['a', 'b']);
        expect(apache.getFormattedValue({array: true}, 'a, b')).toEqual(['a', 'b']);
        expect(apache.getFormattedValue({array: true}, 'a, b c')).toEqual(['a', 'b c']);

        expect(apache.getFormattedValue({multiple: true}, '80: 80, 3306:3307')).toEqual({80: 80, 3306: 3307});
    });

    it('should return all fields', function () {
        var apache = new componentFactory.Component({type: 'apache'});
        var nginx = new componentFactory.Component({type: 'nginx', port: '80: 80', fields: {port: {multiple: true}}});
        var php = new componentFactory.Component({type: 'php', modules: 'gd, intl', fields: {modules: {array: true}}});

        expect(apache.getOutputFields()).toEqual({type: 'apache', custom: {}});
        expect(nginx.getOutputFields()).toEqual({type: 'nginx', custom: {}, port: {80: 80}});
        expect(php.getOutputFields()).toEqual({type: 'php', custom: {}, modules: ['gd', 'intl']});
    });
});
