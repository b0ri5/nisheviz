require.config({
  paths: {
    'd3': '../node_modules/d3/d3',
    'nishe': '../node_modules/nishe/nishe',
    'nisheviz': '../nisheviz'
  }
});
require(['d3', 'nishe', 'nisheviz'], function(d3, nishe, nisheviz) {
  'use strict';
  var svg = d3.select('svg')
    .attr('width', 500)
    .attr('height', 500);
  var g = new nishe.Graph({
    a: ['b'],
    b: ['c']
  });
  var rendered = nisheviz.renderGraph(g, svg);
});
