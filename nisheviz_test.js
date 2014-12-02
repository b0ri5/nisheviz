define([
  'chai',
  'jquery',
  'nishe',
  'nisheviz',

  'mocha',
  'svgjs'], function(
    chai,
    $,
    nishe,
    nisheviz) {
  'use strict';
  var expect = chai.expect;
  describe('nisheviz', function() {
    describe('SvgPartitionRenderer', function() {
      describe('#render', function() {
        it('gives wider partitions wider bboxes', function() {
          $(document).ready(function() {
            console.log('ready');
          });
          var id = 'should-be-wider-than';
          $('#svg').append('<div id=' + id + '></div>');
          var ida = id + '-a';
          $('#' + id).append('<span id=' + ida + '></span>');
          $('#' + id).append('<p style=display:inline>' + id + '</p>');
          console.log($('#' + id).length);
          console.log($('#' + ida).length);
          var drawA = SVG(ida);
          var renderer = new nisheviz.SvgPartitionRenderer(drawA);
          var a = new nishe.Partition([['a']]);
          var aSvg = renderer.render(a);
          console.log(drawA);
          console.log(drawA.viewbox());
          var viewbox = drawA.viewbox();
          var bigbbox;
          drawA.each(function(i, children) {
            console.log('Child ' + children[i]);
            if (bigbbox) {
              bigbbox = bigbbox.merge(children[i].bbox());
            } else {
              bigbbox = children[i].bbox();
            }
            console.log('big bbox == at ' + i);
            console.log(bigbbox);
            console.log('r bbox == at ' + i);
            console.log(children[i].rbox());
          });
          //drawA.viewbox(viewbox.x, viewbox.y, aSvg.bbox().width, aSvg.bbox().height, 1);
          //drawA.viewbox(viewbox.x, 0, aSvg.bbox().width, aSvg.bbox().height, 1);
          console.log(drawA.viewbox());
        
          $('#' + ida).height(aSvg.bbox().height).width(aSvg.bbox().width);
          var sleep = function(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
              if ((new Date().getTime() - start) > milliseconds){
                break;
              }
            }
          }
          sleep(1000);
          console.log($('#' + ida).width() + ' - ' + $('#' + ida).height());
          console.log(aSvg.bbox().height);
          console.log(aSvg.bbox().width);
          var x = 5;
          drawA.size(aSvg.bbox().width + x, aSvg.bbox().height + x);
//          drawA.size(300, 400);
/*          renderer = new nisheviz.SvgPartitionRenderer(SVG(idb));
          var ab = new nishe.Partition([['a', 'b']]);
          var abSvg = renderer.render(ab);
          $('#' + idb).height(abSvg.bbox().height);
          console.log('#' + idb);
          console.log($('#' + idb));
          console.log('setting height to ' + $('#' + idb).height());
          $('#' + idb).width(abSvg.bbox().width);
          expect(aSvg.bbox().width).to.be.lessThan(abSvg.bbox().width);*/
        });
/*        it('gives shorter partitions shorter bboxes', function() {
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
        });*/
      });
    });
  });
});
