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
});
