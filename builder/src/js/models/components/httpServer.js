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

    var result = Component.prototype.removeLink.apply(this, arguments);

    // Unlink a fast-cgi app: remove the fastCgi attribute
    if (oldTarget.type === 'php-fpm' || oldTarget.type === 'hhvm') {
        this.custom.fastCgi = null;
    }

    return result;
};

HttpServer.prototype.changeLinkedComponentName = function (name, oldName) {
    'use strict';

    Component.prototype.changeLinkedComponentName.apply(this, arguments);

    if (this.custom.fastCgi === oldName) {
        this.custom.fastCgi = name;
    }
};

HttpServer.prototype.__proto__ = Component.prototype;

module.exports = HttpServer;
