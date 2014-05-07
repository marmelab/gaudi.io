var graph       = require('joint/src/joint.dia.graph');
var link        = require('joint/src/joint.dia.link');
var element     = require('joint/src/joint.dia.element');
var vectorizer  = require('vectorizer');
var geometry    = require('geometry');

require('jquery.sortElements');

window.joint = {
    dia: {
        Graph: graph.Graph,
        Link: link.Link,
        Element: element.Element,
        ElementView: element.ElementView
    },
    util: require('joint/src/core').util,
    shapes: require('joint/plugins/shapes')
};

require('joint/src/joint.dia.paper');

module.exports = window.joint;
