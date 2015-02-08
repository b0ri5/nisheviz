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
  var domain = p.domain();
  var dims = nisheviz.partitionBlockDimensions(domain, svg);
  var rendered = nisheviz.renderPartition(p, dims.width, dims.height, group);
  var prevkey;
  d3.select("body").on("keypress", function() {
    // e<element> highlights the element
    // f<element> unhighlights it
    // i<index> highlights the cell at the index
    // j<index> unhighlights it
    var key = String.fromCharCode(d3.event.charCode);
    if (prevkey == "e") {
      if (domain.indexOf(key) != -1) {
        console.log('Highlighting element ' + key);
      }
    } else if (prevkey == "f") {
      if (domain.indexOf(key) != -1) {
        console.log('Unhighlighting element ' + key);
      }
    } else if (prevkey == "i") {
      var indexes = p.indexes();
      var index = +key;
      if (indexes.indexOf(index) != -1) {
        console.log('Highlighting index ' + index);
      }
    } else if (prevkey == "j") {
      var indexes = p.indexes();
      var index = +key;
      if (indexes.indexOf(index) != -1) {
        console.log('Unhighlighting index ' + index);
      }
    }
    prevkey = key;
  });
});
