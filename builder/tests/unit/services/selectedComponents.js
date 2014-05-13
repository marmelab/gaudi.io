/*global describe,module,beforeEach,inject,it,expect*/

describe('Service: selectedComponents', function () {
    'use strict';

    // instantiate service
    var selectedComponents;

    // load the service's module
    beforeEach(module('gaudiBuilder'));

    beforeEach(inject(function ($injector) {
        selectedComponents = $injector.get('selectedComponents');
    }));

    it('should return the same name of a non existing component', function () {
        expect(selectedComponents.getElementName('apache')).toBe('apache');
        expect(selectedComponents.getElementName('nginx_')).toBe('nginx_');
        expect(selectedComponents.getElementName('pma_2')).toBe('pma_2');
        expect(selectedComponents.getElementName('php-fpm')).toBe('php_fpm');
    });

    it('should return the name with incremented counter for an existing component', function () {
        selectedComponents.components = {
            'apache': true,
            'nginx': true,
            'nginx_1': true,
            'php_fpm_1_1': true
        };

        expect(selectedComponents.getElementName('apache')).toBe('apache_1');
        expect(selectedComponents.getElementName('nginx')).toBe('nginx_2');
        expect(selectedComponents.getElementName('pma_2')).toBe('pma_2');
        expect(selectedComponents.getElementName('php_fpm_1_1')).toBe('php_fpm_1_2');
    });
});
