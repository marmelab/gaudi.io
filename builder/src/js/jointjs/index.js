var geometry    = require('joint/src/geometry');
var graph       = require('joint/src/joint.dia.graph');
var link        = require('joint/src/joint.dia.link');
var element     = require('joint/src/joint.dia.element');
var vectorizer  = require('vectorizer');
window.g        = geometry.g;

require('jquery.sortElements');

window.joint = {
    dia: {
        Graph: graph.Graph,
        Link: link.Link,
        LinkView: link.LinkView,
        Element: element.Element,
        ElementView: element.ElementView
    },
    util: require('joint/src/core').util,
    shapes: require('joint/plugins/shapes')
};

require('joint/src/joint.dia.paper');

module.exports = window.joint;
