require.config({
  paths: {
    'd3': 'http://d3js.org/d3.v3.min',
    'nishe': '../node_modules/nishe/nishe',
    'nisheviz': '../nisheviz'
  }
});
require(['d3', 'nishe', 'nisheviz'], function(d3, nishe, nisheviz) {
  'use strict';
  var g = d3.select('svg')
      .append('g');
  var p = nishe.Partition([['a', 'b'], ['c']]);
  nisheviz.renderPartition(p, g);
});
