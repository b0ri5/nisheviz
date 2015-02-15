require.config({
  paths: {
    'd3': '../node_modules/d3/d3',
    'nishe': '../node_modules/nishe/nishe',
    'nisheviz': '../nisheviz'
  }
});
require(['d3', 'nishe', 'nisheviz'], function(d3, nishe, nisheviz) {
  'use strict';
  var width = 200;
  var height = 200;
  var svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);
  svg.append('rect')
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'none')
    .style('stroke', 'black')
  var g = new nishe.Graph({
    a: ['b'],
    b: ['c']
  });
  var radius = nisheviz.graphVertexRadius(g.vertexes(), svg);
  var rendered = nisheviz.renderGraph(g, radius, width, height, svg);
  var vertexes = g.vertexes();
  var prevkeys = [];
  d3.select("body").on("keypress", function() {
    // v<vertex> highlights the vertex
    // u<vertex> unhighlights it
    var key = String.fromCharCode(d3.event.charCode);
    if (prevkeys[0] == "v") {
      if (vertexes.indexOf(key) != -1) {
        console.log('Highlighting vertex ' + key);
        rendered.highlightVertex(key, 'blue');
      }
    } else if (prevkeys[0] == "u") {
      if (vertexes.indexOf(key) != -1) {
        console.log('Unhighlighting vertex ' + key);
        rendered.unhighlightVertex(key);
      }
    } else if (prevkeys[1] == "e") {
      (function() {
        var u = prevkeys[0];
        var v = key;
        if (g.nbhd(u).indexOf(v) != -1) {
          console.log('Highlighting edge ' + u + ", " + v)
          rendered.highlightEdge(u, v);
        }
      })();
    } else if (prevkeys[1] == "f") {
      (function() {
        var u = prevkeys[0];
        var v = key;
        if (g.nbhd(u).indexOf(v) != -1) {
          console.log('Unhighlighting edge ' + u + ", " + v)
          rendered.unhighlightEdge(u, v);
        }
      })();
    }
    prevkeys.unshift(key);
    if (prevkeys.length > 2) {
      prevkeys.pop();
    }
  });
});