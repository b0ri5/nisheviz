define([], function() {
  function SvgPartitionRenderer(svgDocArg) {
    var svgDoc = svgDocArg;

    this.render = function(p) {
      var draw = svgDoc.nested();
      var domain = p.domain();
      return draw.text(domain.join(' '));
    };
  }
  return {
    SvgPartitionRenderer: SvgPartitionRenderer
  };
});
