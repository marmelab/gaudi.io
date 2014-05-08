/*global require,angular,module,window,document,joint*/

require('angular/angular');
require('angular-route/angular-route');
window.jQuery = require('jquery');

angular.module('gaudiBuilder', ['ui.bootstrap.modal']);

require('./controllers/board');
require('./controllers/components');
require('./controllers/editComponent');
require('./controllers/yaml');
