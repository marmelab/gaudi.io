/*global require*/

var Component = require('models/components/component');

var HttpServer = function (attributes) {
    'use strict';

    Component.prototype.constructor.apply(this, arguments);
    this.custom.fastCgi = null;
};

HttpServer.prototype.createLink = function (target) {
    'use strict';

    Component.prototype.createLink.apply(this, arguments);

    // Link to a fast-cgi app: set the fastCgi attribute
    if (target.type === 'php-fpm' || target.type === 'hhvm') {
        this.custom.fastCgi = target.name;
    }
};

HttpServer.prototype.removeLink = function (oldTarget) {
    'use strict';

    Component.prototype.removeLink.apply(this, arguments);

    // Unlink a fast-cgi app: remove the fastCgi attribute
    if (oldTarget.type === 'php-fpm' || oldTarget.type === 'hhvm') {
        this.custom.fastCgi = null;
    }
};

HttpServer.prototype.__proto__ = Component.prototype;

module.exports = HttpServer;
