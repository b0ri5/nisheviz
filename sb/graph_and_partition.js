require.config({
  paths: {
    'd3': '../node_modules/d3/d3',
    'nishe': '../node_modules/nishe/nishe',
    'nisheviz': '../nisheviz'
  }
});
require(['d3', 'nishe', 'nisheviz'], function(d3, nishe, nisheviz) {
  'use strict';
  d3.select('#graph')
      .on("resize", function() {
        console.log('ym');
      })
      .on("SVGResize", function() {
        console.log('yf');
      });

    d3.select('body')
      .on("resize", function() {
        console.log('ym');
      })
      .on("SVGResize", function() {
        console.log('yf');
      });
  d3.select(window).on("resize", function() {
    console.log('d3reziging');

  });
  window.onresize = function() {
    console.log('resizing');
  };
});