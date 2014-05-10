/*global require*/

var HttpServer = require('models/components/httpServer');

var LoadBalancer = function () {
    'use strict';

    this.__proto__.__proto__.constructor.apply(this, arguments);

    this.custom.backends = [];
};

LoadBalancer.prototype.onCreateLink = function (target) {
    'use strict';

    this.__proto__.__proto__.onCreateLink.apply(this, arguments);

    // Link to a httpServer : set load balancing
    if(target.class === 'HttpServer') {
        this.custom.backends.push(target.name);
    }
};

LoadBalancer.prototype.onRemoveLink = function (oldTarget) {
    'use strict';

    this.__proto__.__proto__.onRemoveLink.apply(this, arguments);

    // Unlink a httpServer : remove load balancing
    if(oldTarget.class === 'HttpServer') {
        var pos = this.custom.backends.indexOf(oldTarget.name);
        if (pos > -1) {
            this.custom.backends.slice(pos, 1);
        }
    }
};

LoadBalancer.prototype.__proto__ = HttpServer.prototype;

module.exports = LoadBalancer;
