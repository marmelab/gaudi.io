/*global require*/

var Component = require('models/components/component');

var HttpServer = function (attributes) {
    'use strict';

    Component.prototype.constructor.apply(this, arguments);
    this.custom.fastCgi = null;
};

HttpServer.prototype.onCreateLink = function (target) {
    'use strict';

    // Link to a fast-cgi app: set the fastCgi attribute
    if (target.type === 'php-fpm' || target.type === 'hhvm') {
        this.custom.fastCgi = target.name;
    }
};

HttpServer.prototype.onRemoveLink = function (oldTarget) {
    'use strict';

    // Unlink a fast-cgi app: remove the fastCgi attribute
    if (oldTarget.name === 'php-fpm' || oldTarget.name === 'hhvm') {
        this.custom.fastCgi = null;
    }
};

HttpServer.prototype.__proto__ = Component.prototype;

module.exports = HttpServer;
