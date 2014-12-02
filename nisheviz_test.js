define([
  'chai',
  'nisheviz',
  'mocha'], function(
    chai,
    nisheviz) {
  'use strict';
  var expect = chai.expect;
  describe('nisheviz', function() {
    describe('isRefineStart', function() {
      it('should return true for refine start states', function() {
        var state = {
          partition: {
            elements: [],
            indexes: []
          }
        };
        expect(nisheviz.isRefineStart(state)).to.equal(true);
      });
      it('should return false for non refine start states', function() {
        var state = {
          partition: {
            elements: [],
            indexes: []
          },
          activeIndexes: []
        };
        expect(nisheviz.isRefineStart(state)).to.equal(false);
      });

    });
  });
});
