/*global require,module,document,$*/

var joint = require('jointjs');
var graph = require('jointjs/graph');

var paper = new joint.dia.Paper({
    el: document.getElementById('graphContainer'),
    width: '100%',
    height: '100%',
    gridSize: 1,
    model: graph
});

module.exports = paper;
