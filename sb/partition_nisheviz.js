require.config({
  paths: {
    'd3': '../node_modules/d3/d3',
    'nishe': '../node_modules/nishe/nishe',
    'nisheviz': '../nisheviz'
  }
});
require(['d3', 'nishe', 'nisheviz'], function(d3, nishe, nisheviz) {
  'use strict';
  var svg = d3.select('svg');
  var group = svg.append('g');
  var p = new nishe.Partition([['a', 'b'], ['c']]);
  console.log(group);
  var dims = nisheviz.partitionBlockDimensions(p.domain(), svg);
  nisheviz.renderPartition(p, dims.width, dims.height, group);
});
