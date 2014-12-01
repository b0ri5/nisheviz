define([
  'node_modules/chai/chai',
  'node_modules/nishe/nishe',
  'nisheviz',
  'node_modules/mocha/mocha',
  'node_modules/svg.js/dist/svg'], function(
    chai,
    nishe,
    nisheviz) {
  'use strict';
  var expect = chai.expect;
  describe('nisheviz', function() {
    describe('next', function() {
      var state = {
        elements: ['a', 'b', 'c'],
        cell_indexes: [],
        state: 
      };
      var nisheviz.next(state);
    });
    describe('SvgPartitionRenderer', function() {
      describe('#render', function() {
        it('gives wider partitions wider bboxes', function() {
          var renderer = new nisheviz.SvgPartitionRenderer(SVG('svg'));
          var a = new nishe.Partition([['a']]);
          var aSvg = renderer.render(a);
          var ab = new nishe.Partition([['a', 'b']]);
          var abSvg = renderer.render(ab);
          expect(aSvg.bbox().width).to.be.lessThan(abSvg.bbox().width);
        });
        it('gives shorter partitions shorter bboxes', function() {
          var renderer = new nisheviz.SvgPartitionRenderer(SVG('svg'));
          var a = new nishe.Partition([['a']]);
          var aSvg = renderer.render(a);
          var b = new nishe.Partition([['b']]);
          var bSvg = renderer.render(b);
          expect(bSvg.bbox().height).to.not.be.lessThan(aSvg.bbox().height);
        });
        it('gives finer partitions wider bboxes', function() {
          var renderer = new nisheviz.SvgPartitionRenderer(SVG('svg'));
          var ab = new nishe.Partition([['a', 'b']]);
          var abSvg = renderer.render(ab);
          var abFiner = new nishe.Partition([['a'], ['b']]);
          var abFinerSvg = renderer.render(abFiner);
          expect(abSvg.bbox().width)
            .to.not.be.lessThan(abFinerSvg.bbox().width);
        });
        it('gives identical partitions identical bboxes', function() {
          var renderer = new nisheviz.SvgPartitionRenderer(SVG('svg'));
          var a = new nishe.Partition([['a']]);
          var aSvg = renderer.render(a);
          var a2 = new nishe.Partition([['a']]);
          var a2Svg = renderer.render(a2);
          expect(aSvg.bbox().width).to.equal(a2Svg.bbox().width);
          expect(aSvg.bbox().height).to.equal(a2Svg.bbox().height);
        });
      });
    });
  });
});
