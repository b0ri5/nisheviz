define([], function() {
  'use strict';
  function refine(g, p) {
    var activeIndexes = p.indexes();
    var refined = p;
    while (activeIndexes.length > 0) {
      var activeIndex = activeIndexes.pop();
      var activeCell = refined.cell(activeIndex);
      var adjacencyCounts = {};
      for (var i = 0; i < activeCell.length; i++) {
        var u = activeCell[i];
        var nbhd = g.nbhd(u);
        for (var j = 0; j < nbhd.length; j++) {
          var v = nbhd[j];
          if (v in adjacencyCounts) {
            adjacencyCounts[v]++;
          } else {
            adjacencyCounts[v] = 1;
          }
        }
      }
      var oldIndexes = refined.indexes();
      refined = refined.sortAndSplit(adjacencyCounts);
      var newIndexes = refined.indexes();
      for (i = 0; i < newIndexes.length; i++) {
        var index = newIndexes[i];
        if (oldIndexes.indexOf(index) == -1) {
          activeIndexes.push(index);
        }
      }
    }
    return refined;
  }

  function Graph(adjacencyObj) {
    var nbhds = {};

    (function() {
      var vertexes = Object.keys(adjacencyObj);
      for (var i = 0; i < vertexes.length; i++) {
        var u = vertexes[i];
        var nbhrs = adjacencyObj[u];
        for (var j = 0; j < nbhrs.length; j++) {
          var v = nbhrs[j];
          if (u == v) {
            throw new Error('Self loop on ' + u + ' detected');
          }
          if (u in nbhds) {
            if (nbhds[u].indexOf(v) == -1) {
              nbhds[u].push(v);
            }
          } else {
            nbhds[u] = [v];
          }
          if (v in nbhds) {
            if (nbhds[v].indexOf(v) == -1) {
              nbhds[v].push(u);
            }
          } else {
            nbhds[v] = [u];
          }
        }
      }
    })();
    (function() {
      var vertexes = Object.keys(nbhds);
      for (var i = 0; i < vertexes.length; i++) {
        var u = vertexes[i];
        nbhds[u].sort();
      }
    })();

    this.nbhd = function(u) {
      if (u in nbhds) {
        return nbhds[u];
      } else {
        throw new Error(u + ' is not a vertex');
      }
    };

    this.vertexes = function() {
      var vertexes = Object.keys(nbhds);
      vertexes.sort();
      return vertexes;
    };
  }

  function Partition(arrayOfCells) {
    var domain = [];
    var images = {};
    var indexSizes = {};

    (function() {
      (function() {
        for (var i = 0; i < arrayOfCells.length; i++) {
          var cell = arrayOfCells[i];
          if (cell.length === 0) {
            throw new Error('All cells in ' + arrayOfCells +
                ' must be nonempty');
          }
          for (var j = 0; j < cell.length; j++) {
            var x = cell[j];
            if (domain.indexOf(x) != -1) {
              throw new Error(x + ' has been seen twice, ' +
                  arrayOfCells + ' is not disjoint');
            }
            domain.push(x);
          }
        }
      })();

      domain.sort();

      (function() {
        var index = 0;
        for (var i = 0; i < arrayOfCells.length; i++) {
          var cell = arrayOfCells[i];
          for (var j = 0; j < cell.length; j++) {
            var x = cell[j];
            images[x] = domain[index];
          }
          indexSizes[index] = cell.length;
          index += cell.length;
        }
      })();
    })();

    this.image = function(x) { return images[x];
    };

    this.domain = function() {
      var keys = Object.keys(images);
      keys.sort();
      return keys;
    };

    this.indexes = function() {
      var keys = Object.keys(indexSizes).map(function(i) {
        return +i;
      });
      keys.sort();
      return keys;
    };

    this.indexSize = function(index) {
      if (index in indexSizes) {
        return indexSizes[index];
      }
      throw new Error(index + ' is not a key in ' + indexSizes);
    };

    this.cell = function(index) {
      var cell = [];
      for (var i = 0; i < domain.length; i++) {
        var e = domain[i];
        if (domain.indexOf(images[e]) == index) {
          cell.push(e);
        }
      }
      return cell;
    };

    this.cells = function() {
      var cells = [];
      var indexes = this.indexes();
      for (var i = 0; i < indexes.length; i++) {
        var index = indexes[i];
        cells.push(this.cell(index));
      }
      return cells;
    };

    this.unorderedCells = function() {
      var cells = this.cells();
      cells.sort(function(a, b) {
        return a[0] < b[0];
      });
      return cells;
    };

    this.sortAndSplit = function(keys) {
      var cells = [];
      var indexes = this.indexes();
      var comparator = function(a, b) {
        return keys[a] - keys[b];
      };
      for (var i = 0; i < indexes.length; i++) {
        var index = indexes[i];
        var cell = this.cell(index);
        cell.sort(comparator);
        var keyStart = 0;
        var key = keys[cell[0]];
        for (var j = 1; j < cell.length; j++) {
          var nextKey = keys[cell[j]];
          if (nextKey != key) {
            cells.push(cell.slice(keyStart, j));
            keyStart = j;
            key = nextKey;
          }
        }
        cells.push(cell.slice(keyStart, cell.length));
      }
      if (cells.length == indexes.length) {
        return this;
      }
      return new Partition(cells);
    };
  }

  return {
    refine: refine,
    Graph: Graph,
    Partition: Partition
  };
});
