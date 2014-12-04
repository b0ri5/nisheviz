define([
  'chai',
  'nishe',
  'nisheviz',
  'mocha'], function(
    chai,
    nishe,
    nisheviz) {
  'use strict';
  var expect = chai.expect;
  describe('nisheviz', function() {
    describe('isRefineStart', function() {
      it('should return true for refine start states', function() {
        var state = {
          partition: new nishe.Partition([['a']])
        };
        expect(nisheviz.isRefineStart(state)).to.equal(true);
      });
      it('should return true for refine start states with individualized index', function() {
        var state = {
          partition: new nishe.Partition([['a']]),
          individualizedIndex: 0
        };
        expect(nisheviz.isRefineStart(state)).to.equal(true);
      });
      it('should return false for non refine start states', function() {
        var state = {
          partition: new nishe.Partition([['a']]),
          somethingElse: []
        };
        expect(nisheviz.isRefineStart(state)).to.equal(false);
      });
    });
    describe('next', function() {
      describe('from refine start', function() {
        it('should add all indexes as active for start refine states without an individualized vertex', function() {
          var state = {
            partition: new nishe.Partition([['a'], ['b', 'c']])
          };
          var next = nisheviz.next(state);
          expect(next.activeIndexes).to.have.members([0, 1]);
        });
      });
      describe('from choose active index', function() {
        it('should choose 0 from [a | b c] with 0, 1', function() {
          var state = {
            partition: new nishe.Partition([['a'], ['b', 'c']]),
            activeIndexes: [0, 1]
          };
          var next = nisheviz.next(state);
          expect(next.activeIndex).to.equal(0);
          expect(next.activeIndexes).to.have.members([1]);
        });
        it('should choose 2 from [a b | c] with 0, 2', function() {
          var state = {
            partition: new nishe.Partition([['a', 'b'], ['c']]),
            activeIndexes: [0, 2]
          };
          var next = nisheviz.next(state);
          expect(next.activeIndex).to.equal(2);
          expect(next.activeIndexes).to.have.members([0]);
        });
      });
      describe('from accumulate adjacent cells', function() {
        it('should add nbhd index and adjacency counts', function() {
          var state = {
            graph: new nishe.Graph({a: ['b']}),
            partition: new nishe.Partition([['a', 'b']]),
            activeIndex: 0,
            activeIndexIndex: 0
          };
          var next = nisheviz.next(state);
          expect(next.nbhdIndex).to.equal(0);
          expect(next.adjacencyCounts.b).to.equal(1);
        });
        it('should continue previous state', function() {
          var state = {
            graph: new nishe.Graph({a: ['b', 'c']}),
            partition: new nishe.Partition([['a', 'b', 'c']]),
            activeIndex: 0,
            activeIndexIndex: 0,
            nbhdIndex: 0,
            adjacencyCounts: {
              c: 41
            }
          };
          var next = nisheviz.next(state);
          expect(next.nbhdIndex).to.equal(1);
          expect(next.adjacencyCounts.c).to.equal(42);
        });
        it('should increment the active index\'s index when the nbhd index is exhausted', function() {
          var state = {
            graph: new nishe.Graph({a: ['b', 'c']}),
            partition: new nishe.Partition([['a', 'b', 'c']]),
            activeIndex: 0,
            activeIndexIndex: 0,
            nbhdIndex: 1
          };
          var next = nisheviz.next(state);
          expect(next.nbhdIndex).to.equal(undefined);
          expect(next.activeIndexIndex).to.equal(1);
        });
        it('should remove the active index\'s index when the cell is exhausted', function() {
          var state = {
            graph: new nishe.Graph({a: ['b', 'c']}),
            partition: new nishe.Partition([['a', 'b', 'c']]),
            activeIndex: 0,
            activeIndexIndex: 2,
            nbhdIndex: 0,
            adjacencyCounts: {}
          };
          var next = nisheviz.next(state);
          expect(next.nbhdIndex).to.equal(undefined);
          expect(next.activeIndexIndex).to.equal(undefined);
          expect(next.adjacencyCounts).to.not.equal(undefined);
        });
      });
    });
    describe('isChooseActiveIndex', function() {
      it('returns true if there are active indexes but no active index', function() {
        var state = {
          activeIndexes: [1]
        };
        expect(nisheviz.isChooseActiveIndex(state)).to.equal(true);
      });
      it('returns false if there are active indexes and an active index', function() {
        var state = {
          activeIndexes: [1],
          activeIndex: 0
        };
        expect(nisheviz.isChooseActiveIndex(state)).to.equal(false);
      });
    });
  });
});
