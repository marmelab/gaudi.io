/*global window*/

window.joint = {
    dia: {},
    connectors: {}
};

var cell        = require('joint/src/joint.dia.cell');
var link        = require('joint/src/joint.dia.link');
var element     = require('joint/src/joint.dia.element');
var vectorizer  = require('vectorizer');
window.g        = require('joint/src/geometry');

require('jquery.sortElements');

window.joint.dia.Cell = cell.Cell;
window.joint.dia.Graph = require('joint/src/joint.dia.graph').Graph;
window.joint.dia.LinkView = link.LinkView;
window.joint.dia.Element = element.Element;
window.joint.dia.ElementView = element.ElementView;
window.joint.util = require('joint/src/core').util;
window.joint.shapes = require('joint/plugins/shapes');

require('joint/src/joint.dia.paper');
require('joint/plugins/connectors/joint.connectors.normal');

module.exports = window.joint;
