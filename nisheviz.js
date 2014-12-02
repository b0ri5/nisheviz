define([], function() {
  'use strict';

  var drawBbox = function(svg, draw) {
    var bbox = svg.bbox();
    draw.rect(bbox.width, bbox.height)
        .fill('none')
        .stroke({width: 1})
        .move(bbox.x, bbox.y);
  };

  function SvgPartitionRenderer(svgDoc) {
    this.render = function(p) {
      var draw = svgDoc.nested();
      var domain = p.domain();
      var prevBbox;
      for (var i = 0; i < domain.length; i++) {
        var x = domain[0];
        console.log(x);
        var svgX = draw.text(x);
        if (prevBbox) {
          svgX = svgX.move(prevBbox.x + prevBbox.width, prevBbox.y);
        }
        prevBbox = svgX.bbox();
        drawBbox(svgX, draw);
      }
      return draw; // draw.text(domain.join(' '));
    };
  }

  function RenderedSvgPartition(partition, elementToSvg) {
    this.svgForElement = function(v) {
      return elementToSvg[v];
    };

    /*this.svgForSplit = function(u, v) {
      return spiltToSvg[[partition.image(u), partition.image(v)]];
    };*/
  }
  return {
    RenderedSvgPartition: RenderedSvgPartition,
    SvgPartitionRenderer: SvgPartitionRenderer
  };
});
