/*global describe,module,beforeEach,inject,it,expect*/

describe('Service: yamlParser', function () {
    'use strict';

    // instantiate service
    var yamlParser;

    // load the service's module
    beforeEach(module('gaudiBuilder'));

    beforeEach(inject(function ($injector) {
        yamlParser = $injector.get('yamlParser');
    }));

    it('should clean empty object', function () {
        expect(yamlParser.cleanEmptyObjects({})).toEqual('');
        expect(yamlParser.cleanEmptyObjects({apache: true})).toEqual({apache: true});
        expect(yamlParser.cleanEmptyObjects({apache: 1, common: {zde: true}})).toEqual({apache: 1});
        expect(yamlParser.cleanEmptyObjects({apache: 1, links: ['master']})).toEqual({apache: 1, links: ['master']});
        expect(yamlParser.cleanEmptyObjects({apache: 3, angular: {binary: {a: 4} }})).toEqual({apache: 3});
        expect(yamlParser.cleanEmptyObjects({apache: 3, pma: {}, nginx: true})).toEqual({apache: 3, nginx: true});
        expect(yamlParser.cleanEmptyObjects({apache: 3, pma: {fields: {}}, nginx: true})).toEqual({apache: 3, nginx: true});
        expect(yamlParser.cleanEmptyObjects({apache: 3, pma: {fields: {type: 8, size: {}}}})).toEqual({apache: 3, pma: {fields: {type: 8}}});
    });

    it('should clean empty fields', function () {
        expect(yamlParser.cleanResult({})).toEqual({});
        expect(yamlParser.cleanResult({hello: ''})).toEqual({});
        expect(yamlParser.cleanResult({binary: true})).toEqual({});
        expect(yamlParser.cleanResult({hello: true})).toEqual({hello: true});
        expect(yamlParser.cleanResult({hello: {a: ''}})).toEqual({hello: {}});
        expect(yamlParser.cleanResult({hello: {a: '12', c: ''}})).toEqual({hello: {a: '12'}});
    });

    it('should clean empty fields and object', function () {
        expect(yamlParser.cleanEmptyObjects(yamlParser.cleanResult({"django": {"type": "django", "custom": {"pip_modules": ""}, "apt_get": ""}}))).toEqual({"django": {"type": "django"}});
    });

    it('should dump yaml', function () {
        expect(yamlParser.dump({})).toEqual('');
        expect(yamlParser.dump({hello: true}).trim()).toEqual('hello: true');
    });
});
