/*global require*/

var HttpServer = require('models/components/httpServer');

var LoadBalancer = function () {
    'use strict';

    this.__proto__.__proto__.constructor.apply(this, arguments);

    this.custom.backends = [];
};

LoadBalancer.prototype.createLink = function (target) {
    'use strict';

    HttpServer.prototype.createLink.apply(this, arguments);

    // Link to a httpServer : set load balancing
    if(target.class === 'HttpServer' && this.custom.backends.indexOf(target.name) === -1) {
        this.custom.backends.push(target.name);
    }
};

LoadBalancer.prototype.removeLink = function (oldTarget) {
    'use strict';

    var result = HttpServer.prototype.removeLink.apply(this, arguments);

    this.removeBackend(oldTarget);

    return result;
};

LoadBalancer.prototype.removeBackend = function(oldTarget) {
    var removed = false;

    // Unlink a httpServer : remove load balancing
    if(oldTarget.class === 'HttpServer') {
        var pos = this.custom.backends.indexOf(oldTarget.name);
        if (pos > -1) {
            this.custom.backends.splice(pos, 1);
            removed = true;
        }
    }

    return removed;
};

LoadBalancer.prototype.changeLinkedComponentName = function (name, oldName) {
    'use strict';

    HttpServer.prototype.changeLinkedComponentName.apply(this, arguments);

    var removed = this.removeBackend({name: oldName});
    if(removed) {
        this.custom.backends.push({name: name});
    }
};

LoadBalancer.prototype.__proto__ = HttpServer.prototype;

module.exports = LoadBalancer;
