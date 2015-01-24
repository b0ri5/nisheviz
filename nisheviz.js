define([], function() {
  'use strict';

  var hasExactProperties = function(obj) {
    var keys = Object.keys(obj);
    keys.sort();
    var args = [];
    for (var i = 1; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.sort();
    if (keys.length != args.length) {
      return false;
    }
    for (i = 0; i < keys.length; i++) {
      if (keys[i] != args[i]) {
        return false;
      }
    }
    return true;
  };

  var isRefineStart = function(state) {
    return hasExactProperties(state, 'partition') ||
        hasExactProperties(state, 'partition', 'individualizedIndex');
  };

  var isChooseActiveIndex = function(state) {
    var keys = Object.keys(state);
    return keys.indexOf('activeIndexes') != -1 && keys.indexOf('activeIndex') == -1;
  };

  var isChosenActiveIndex = function(state) {
    var keys = Object.keys(state);
    return keys.indexOf('activeIndex') != -1 && keys.indexOf('activeIndexIndex') == -1;
  };

  var isAccumulateAdjacentCells = function(state) {
    return Object.keys(state).indexOf('activeIndexIndex') != -1;
  };

  var isSortAndSplit = function(state) {
    var keys = Object.keys(state);
    return keys.indexOf('nbhdIndex') == -1 &&
           keys.indexOf('activeIndexIndex') == -1 &&
           keys.indexOf('adjacencyCounts') != -1;
  };

  var next = function(state) {
    if (isRefineStart(state)) {
      return nextRefineStart(state);
    }
    if (isChooseActiveIndex(state)) {
      return nextChooseActiveIndex(state);
    }
    if (isChosenActiveIndex(state)) {
      return nextChosenActiveIndex(state);
    }
    if (isAccumulateAdjacentCells(state)) {
      return nextAccumulateAdjacentCells(state);
    }
    if (isSortAndSplit(state)) {
      return nextSortAndSplit(state);
    }
  };

  var nextRefineStart = function(state) {
    return {
      partition: state.partition,
      activeIndexes: state.partition.indexes()
    };
  };

  var nextChooseActiveIndex = function(state) {
    var smallestActiveIndex = state.activeIndexes[0];
    var smallestActiveIndexSize = state.partition.indexSize(smallestActiveIndex);
    var smallestActiveIndexIndex = 0;
    for (var i = 1; i < state.activeIndexes.length; i++) {
      var activeIndex = state.activeIndexes[i];
      var size = state.partition.indexSize(activeIndex);
      if (size < smallestActiveIndexSize) {
        smallestActiveIndexSize = size;
        smallestActiveIndex = activeIndex;
        smallestActiveIndexIndex = i;
      }
    }
    var activeIndexes = state.activeIndexes.splice(0);
    activeIndexes.splice(smallestActiveIndexIndex, 1);
    return {
      partition: state.partition,
      activeIndexes: activeIndexes,
      activeIndex: smallestActiveIndex
    };
  };

  var nextChosenActiveIndex = function(state) {
    return {
      partition: state.partition,
      activeIndexes: state.activeIndexes,
      activeIndex: state.activeIndex,
      activeIndexIndex: 0
    };
  };

  var nextAccumulateAdjacentCells = function(state) {
    var nbhdIndex = state.nbhdIndex + 1 || 0;
    var adjacencyCounts = state.adjacencyCounts || {};
    var u = state.partition.cell(state.activeIndex)[state.activeIndexIndex];
    var nbhd = state.graph.nbhd(u);
    var nextState = {
      graph: state.graph,
      partition: state.partition,
      activeIndexes: state.activeIndexes,
      activeIndex: state.activeIndex,
      activeIndexIndex: state.activeIndexIndex,
      adjacencyCounts: adjacencyCounts
    };
    if (nbhdIndex == nbhd.length) {
      nextState.nbhdIndex = undefined;
      nextState.activeIndexIndex++;
      if (nextState.activeIndexIndex == state.partition.indexSize(state.activeIndex)) {
        nextState.activeIndexIndex = undefined;
      }
      return nextState;
    }
    var v = nbhd[nbhdIndex];
    if (v in adjacencyCounts) {
      adjacencyCounts[v]++;
    } else {
      adjacencyCounts[v] = 1;
    }
    nextState.nbhdIndex = nbhdIndex;
    return nextState;
  };

  var nextSortAndSplit = function(state) {
    // TODO: Implement.
  };

  // A map from string to width,height objects
  var elementDimensions = {};

  var populateUnseenDimensions = function(elements, svg) {
    var unseen = [];
    for (var i = 0 ; i < elements.length; i++) {
      var e = elements[i];
      if (!elementDimensions[e]) {
        unseen.push(e);
      }
    }
    var texts = svg.append('defs')
      .classed('dimensions-to-remove', true)
      .selectAll('text')
        .data(unseen)
      .enter().append('text')
        .text(function(d) { return d; });

    texts.each(function (d) {
      var bbox = this.getBBox();
      elementDimensions[d] = {width: bbox.width, height: bbox.height};
    });

    svg.select('.dimensions-to-remove')
      .remove();
  };

  var partitionBlockDimensions = function(elements, svg) {
    var blockWidth = 0;
    var blockHeight = 0;
    console.log(elements);
    populateUnseenDimensions(elements, svg);
    for (var i = 0; i < elements.length; i++) {
      var e = elements[i];
      var dims = elementDimensions[e];
      blockWidth = Math.max(dims.width, blockWidth);
      blockHeight = Math.max(dims.height, blockHeight);
    }
    return {width: blockWidth * 1.818, height: blockHeight * 1.1};
  };

  var appendLine = function(enter, blockWidth, blockHeight) {
    var multiplyByBlockWidth = function(d) {
      return blockWidth * d;
    };
    return enter.append('line')
        .attr('y1', 0)
        .attr('y2', blockHeight)
        .attr('x1', multiplyByBlockWidth)
        .attr('x2', multiplyByBlockWidth)
        .style('stroke', 'black')
        .classed('cellseparator', true);
  };

  var renderPartition = function(p, blockWidth, blockHeight, group) {
    var elements = p.domain();
    var indexes = p.indexes();

    group.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', blockWidth * elements.length)
        .attr('height', blockHeight)
        .style({
          fill: 'none',
          stroke: 'black',
          'stroke-width': 1
        });

    var lineselect = group.selectAll('line');
    appendLine(lineselect.data(indexes).enter(), blockWidth, blockHeight);

    var positions = {};

    (function() {
      var pos = 0;
      var cells = p.cells();
      for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        for (var j = 0; j < cell.length; j++) {
          var e = cell[j];
          positions[e] = pos;
          pos++;
        }
      }
    })();

    var elementsselect = group.selectAll('svg');
    elementsselect.data(elements)
      .enter().append('svg')
        .attr('x', function(d) {
          return blockWidth * positions[d];
        })
        .attr('y', 0)
        .attr('width', blockWidth)
        .attr('height', blockHeight)
        .classed('elementholder', true)
        .append('text')
            .text(function(d) { return d; })
            .attr('text-anchor', 'middle')
            .attr('x', '50%')
            .attr('y', '50%')
            .style('dominant-baseline', 'central');

    return new RenderedPartition(group, blockWidth, blockHeight);
  };

  function RenderedPartition(group, blockWidth, blockHeight) {
    
    this.transitionToPartition = function(newElements, newIndexes) {
      var lineselect = group.selectAll('line.cellseparator')
        .data(newIndexes, function(d) { return d; });
      appendLine(lineselect.enter(), blockWidth, blockHeight)
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1);
      lineselect.exit()
        .transition()
        .duration(1000)
        .style('opacity', 0)
        .each("end", function() {
          d3.select(this).remove();
        });
        
      var newPositions = {};
      for (var i = 0; i < newElements.length; i++) {
        var e = newElements[i];
        newPositions[e] = i;
      }
      group.selectAll('.elementholder')
        .transition()
        .duration(1000)
        .attr('x', function(d) {
          return blockWidth * newPositions[d];
        });
    }
  }

  return {
    isChooseActiveIndex: isChooseActiveIndex,
    isRefineStart: isRefineStart,
    next: next,
    renderPartition: renderPartition,
    partitionBlockDimensions: partitionBlockDimensions
  };
});
