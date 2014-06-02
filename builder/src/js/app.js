/*global require,angular,module,window,document,joint*/

require('angular/angular');
require('angular-route/angular-route');
require('ng-clip/dest/ng-clip');
window.jQuery = require('jquery');

var app = angular.module('gaudiBuilder', ['ui.bootstrap.modal', 'ngClipboard']);

app.config(['ngClipProvider', function (ngClipProvider) {
    'use strict';

    ngClipProvider.setPath("bower_components/zeroclipboard/ZeroClipboard.swf");
}]);

require('./controllers/board');
require('./controllers/components');
require('./controllers/editComponent');
require('./controllers/yaml');
