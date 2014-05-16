/*global require*/

var Component = require('models/components/component');

var Database = function () {
    'use strict';

    this.__proto__.__proto__.constructor.apply(this, arguments);

    this.custom.repl = null;
    this.custom.master = null;
};

Database.prototype.createLink = function (target) {
    'use strict';

    Component.prototype.createLink.apply(this, arguments);

    // Link to the same type of component: create master/slave relationship
    if(target.type === this.type) {
        if (this.custom.repl === null) {
            this.custom.repl = 'master';
        }

        // Update the slave to set the master
        if (!target.custom.repl) {
            target.custom.repl = 'slave';
            target.custom.master = this.name;
        }
    }
};

Database.prototype.removeLink = function (oldTarget) {
    'use strict';

    var result = Component.prototype.removeLink.apply(this, arguments);

    // Remove the master/slave relationship if the target has the same type
    if(oldTarget.type === this.type) {
        if (this.custom.repl === 'master') {
            this.custom.repl = null;
        }

        // Update the slave to remove the master
        if (oldTarget.custom.repl === 'slave') {
            oldTarget.custom.repl = null;
            oldTarget.custom.master = null;
        }
    }

    return result;
};

Database.prototype.changeLinkedComponentName = function (name, oldName) {
    'use strict';

    Component.prototype.changeLinkedComponentName.apply(this, arguments);

    if (this.custom.master === oldName) {
        this.custom.master = name;
    }
};

Database.prototype.__proto__ = Component.prototype;

module.exports = Database;
