/*global angular,require,window,document*/

/**
 * @see: https://github.com/tnajdek/angular-requirejs-seed
 */
require.config({
    baseUrl: "js/",
    paths: {
        // Vendors
        angular: 'lib/angular/angular.min',
        angularBootstrap: 'lib/angular-bootstrap/ui-bootstrap-custom-0.10.0.min',
        angularBootstrapTpl: 'lib/angular-bootstrap/ui-bootstrap-custom-tpls-0.10.0.min',
        underscore: 'lib/underscorejs/underscore-min',
        jquery: 'lib/jquery/jquery-2.1.0.min',
        jqueryui: 'lib/jquery/jquery-ui-1.10.4.custom.min',
        joint: 'lib/jointjs/joint.nojquery.min',
        yamlDumper: 'lib/yaml/YamlDumper',
        yamlInline: 'lib/yaml/YamlInline',
        yamlEscaper: 'lib/yaml/YamlEscaper'
    },
    shim: {
        angular : {exports : 'angular', deps: ['underscore']},
        angularBootstrap: ['angular', 'angularBootstrapTpl'],
        angularBootstrapTpl: ['angular'],
        joint: ['underscore', 'jquery'],
        jquery: {exports: 'jQuery'},
        jqueryui: ['jquery'],
        yamlDumper: {exports: 'YamlDumper', deps: ['yamlInline']},
        yamlEscaper: {exports: 'YamlEscaper'},
        YamlInline: {exports: 'YamlInline', deps: ['yamlEscaper']}
    },
    priority: [
        "angular"
    ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = "NG_DEFER_BOOTSTRAP!";

require([
    'angular',
    'app',
    'controllers/board',
    'controllers/components',
    'controllers/editComponent',
    'controllers/yaml'
], function (angular, app) {
    'use strict';

    angular.element().ready(function () {
        angular.resumeBootstrap([app.name]);
    });
});
