/*global describe,module,beforeEach,inject,it,expect*/

describe('Service: componentFetcher', function () {
    'use strict';

    // instantiate service
    var componentFetcher,
        $httpBackend;

    // load the service's module
    beforeEach(module('gaudiBuilder'));

    beforeEach(inject(function ($injector) {
        componentFetcher = $injector.get('componentFetcher');

        // Set up the mock http service responses
        $httpBackend = $injector.get('$httpBackend');
    }));

    it('should return component from a distant csv', function () {
        var self = this;
        // backend definition common for all tests
        $httpBackend.when('GET', 'data/components.json').respond({
            "apache": {
                "label": "Apache",
                "class": "HttpServer",
                "fields": {
                    "ports" : {"label": "Ports :", "type": "text", "default": "80: 80", "multiple": true},
                    "apt_get": {"label": "Apt packets :", "type": "text", "default": "", "array": true}
                }
            },
            "nginx": {
                "label": "Nginx",
                "class": "HttpServer",
                "fields": {
                    "ports" : {"label": "Ports :", "type": "text", "default": "80: 80"}
                }
            }
        });

        componentFetcher.getAllComponents().then(function (data) {
            expect(data.apache.label).toBe('Apache');
            expect(data.nginx.fields.ports.default).toBe('80: 80');
        }, function () {
            self.fail(Error());
        });

        $httpBackend.flush();
    });

    it('should call reject when the ajax call fails', function () {
        var self = this;
        // backend definition common for all tests
        $httpBackend.when('GET', 'data/components.json').respond(500, '');

        componentFetcher.getAllComponents().then(function () {
            self.fail(Error());
        }, function () {
            expect(true).toBe(true);
        });

        $httpBackend.flush();
    });

    it('should not send ajax request twice', function () {
        var self = this;
        // backend definition common for all tests
        $httpBackend.when('GET', 'data/components.json').respond({
            "apache": {
                "label": "Apache",
                "class": "HttpServer"
            }
        });

        $httpBackend.when('GET', 'data/components.json').respond({
            "apache": {
                "label": "Apache2",
                "class": "HttpServer"
            }
        });

        componentFetcher.getAllComponents().then(function () {
            componentFetcher.getAllComponents().then(function (data) {
                expect(data.apache.label).toBe('Apache');
            });
        });

        $httpBackend.flush();
    });
});
