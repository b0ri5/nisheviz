define([
  'node_modules/nishe/nishe',
  'nisheviz',

  'node_modules/mocha/mocha',
  'node_modules/should/should',
  'node_modules/svg.js/dist/svg'], function(
    nishe,
    nisheviz) {
  'use strict';
  describe('nisheviz', function() {
    describe('SvgPartitionRenderer', function() {
      describe('#render', function() {
        it('gives wider partitions wider bboxes', function() {
          var renderer = new nisheviz.SvgPartitionRenderer(SVG('svg'));
          var a = new nishe.Partition([['a']]);
          var aSvg = renderer.render(a);
          var ab = new nishe.Partition([['a', 'b']]);
          var abSvg = renderer.render(ab);
          aSvg.bbox().width.should.be.lessThan(abSvg.bbox().width);
        });
        it('gives shorter partitions shorter bboxes', function() {
          var renderer = new nisheviz.SvgPartitionRenderer(SVG('svg'));
          var a = new nishe.Partition([['a']]);
          var aSvg = renderer.render(a);
          var b = new nishe.Partition([['b']]);
          var bSvg = renderer.render(b);
          bSvg.bbox().height.should.not.be.lessThan(aSvg.bbox().height);
        });
        it('gives finer partitions wider bboxes', function() {
          var renderer = new nisheviz.SvgPartitionRenderer(SVG('svg'));
          var ab = new nishe.Partition([['a', 'b']]);
          var abSvg = renderer.render(ab);
          var abFiner = new nishe.Partition([['a'], ['b']]);
          var abFinerSvg = renderer.render(abFiner);
          abSvg.bbox().width.should.not.be.lessThan(abFinerSvg.bbox().width);
        });
        it('gives identical partitions identical bboxes', function() {
          var renderer = new nisheviz.SvgPartitionRenderer(SVG('svg'));
          var a = new nishe.Partition([['a']]);
          var aSvg = renderer.render(a);
          var a2 = new nishe.Partition([['a']]);
          var a2Svg = renderer.render(a2);
          aSvg.bbox().width.should.equal(a2Svg.bbox().width);
          aSvg.bbox().height.should.equal(a2Svg.bbox().height);
        });
      });
    });
  });
});
