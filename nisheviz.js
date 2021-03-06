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
    for (var i = 0; i < elements.length; i++) {
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

    texts.each(function(d) {
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

  function PartitionRenderer(blockWidth, blockHeight) {
    this.blockWidth = blockWidth;
    this.blockHeight = blockHeight;
    this.appendLine = function(enter) {
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

    this.xfunction = function(positions) {
      return function(d) {
        return blockWidth * positions[d];
      };
    };
  }

  var graphVertexRadius = function(elements, svg) {
    var maxDim = 0;
    populateUnseenDimensions(elements, svg);
    for (var i = 0; i < elements.length; i++) {
      var e = elements[i];
      var dims = elementDimensions[e];
      maxDim = Math.max(maxDim, Math.sqrt(
          dims.width * dims.width + dims.height * dims.height));
    }
    return (maxDim / 2) * 1.1;
  };

  var defaults = {
    highlightElementDuration: 1000,
    highlightIndexDuration: 1000,
    highlightVertexDuration: 1000,
    highlightVertexStrokeWidth: 2,
    highlightEdgeStrokeWidth: 2,
    highlightEdgeDuration: 1000
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
    var renderer = new PartitionRenderer(blockWidth, blockHeight);
    renderer.appendLine(lineselect.data(indexes).enter());

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
        .attr('x', renderer.xfunction(positions))
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

    return new RenderedPartition(p, group, renderer);
  };

  function RenderedPartition(p, group, renderer) {

    this.transitionToPartition = function(newElements, newIndexes) {
      var lineselect = group.selectAll('line.cellseparator')
        .data(newIndexes, function(d) { return d; });
      renderer.appendLine(lineselect.enter())
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1);
      lineselect.exit()
        .transition()
        .duration(1000)
        .style('opacity', 0)
        .each('end', function() {
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
        .attr('x', renderer.xfunction(newPositions));
    };

    var elementToHighlight = {};

    this.highlightElement = function(e, color, duration) {
      duration = duration || defaults.highlightElementDuration;
      // TODO: keep track of where each element is explicitly
      var index = p.domain().indexOf(p.image(e));
      var pos = index + p.cell(index).indexOf(e);
      var highlight = elementToHighlight[e];
      if (!highlight) {
        highlight = group.insert('rect', ':first-child')
          .attr('x', renderer.blockWidth * pos)
          .attr('width', renderer.blockWidth)
          .attr('height', renderer.blockHeight)
          .style('fill', color)
          .style('opacity', 0);
        elementToHighlight[e] = highlight;
      }
      highlight.transition()
        .duration(duration)
        .style('opacity', 0.382);
    };

    this.unhighlightElement = function(e, duration) {
      duration = duration || defaults.highlightElementDuration;
      var highlight = elementToHighlight[e];
      if (!highlight) {
        return;
      }
      highlight.transition()
        .duration(duration)
        .style('opacity', 0)
        .each('end', function() {
            d3.select(this).remove();
            elementToHighlight[e] = undefined;
          });
    };

    var indexToHighlight = {};

    this.highlightIndex = function(i, color, duration) {
      duration = duration || defaults.highlightIndexDuration;
      var cell = p.cell(i);
      var highlight = indexToHighlight[i];
      if (!highlight) {
        highlight = group.insert('rect', ':first-child')
          .attr('x', renderer.blockWidth * i)
          .attr('width', renderer.blockWidth * cell.length)
          .attr('height', renderer.blockHeight)
          .style('fill', color)
          .style('opacity', 0);
        indexToHighlight[i] = highlight;
      }
      highlight.transition()
        .duration(duration)
        .style('opacity', 0.382);
    };

    this.unhighlightIndex = function(i, duration) {
      duration = duration || defaults.highlightIndexDuration;
      var highlight = indexToHighlight[i];
      if (!highlight) {
        return;
      }
      highlight.transition()
        .duration(duration)
        .style('opacity', 0)
        .each('end', function() {
            d3.select(this).remove();
            indexToHighlight[i] = undefined;
          });
    };
  }

  var renderGraph = function(g, radius, width, height, top) {
    var vertexes = g.vertexes();
    var vertexToNode = {};
    var nodes = [];
    (function() {
      for (var i = 0; i < vertexes.length; i++) {
        var v = vertexes[i];
        var node = {v: v};
        nodes.push(node);
        vertexToNode[v] = node;
      }
    })();
    var links = [];
    (function() {
      for (var i = 0; i < vertexes.length; i++) {
        var u = vertexes[i];
        var nbhd = g.nbhd(u);
        for (var j = 0; j < nbhd.length; j++) {
          var v = nbhd[j];
          links.push({source: vertexToNode[u], target: vertexToNode[v]});
        }
      }
    })();
    var lines = top.selectAll('line')
        .data(links)
      .enter().append('line')
        .style('stroke', 'black');
    var vertexGroups = top.selectAll('g')
        .data(nodes)
      .enter().append('g');
    var vertexCircles = vertexGroups.append('circle');
    vertexCircles.attr('r', radius)
        .style('fill', 'white')
        .style('stroke', 'black');
    vertexGroups.append('text')
        .text(function(d) {
          return d.v;
        })
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'middle');

    var tick = function() {
      lines.attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });
      vertexGroups.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    };
    var force = d3.layout.force()
        .size([width, height])
        .nodes(nodes)
        .links(links)
        .linkDistance(4 * radius)
        .friction(0.9)
        .charge(-90)
        .linkStrength(0.02)
        .on('tick', tick);
    vertexGroups.call(force.drag);
    force.start();

    var vertexToGroup = {};
    vertexGroups.each(function(d) {
      vertexToGroup[d.v] = this;
    });
    var vertexToCircle = {};
    vertexCircles.each(function(d) {
      vertexToCircle[d.v] = this;
    });
    var edgeToLine = new Map();
    lines.each(function(d) {
      edgeToLine[[d.source.v, d.target.v]] = this;
      edgeToLine[[d.target.v, d.source.v]] = this;
    });
    return new RenderedGraph(radius, vertexToGroup, vertexToCircle, edgeToLine);
  };

  function RenderedGraph(radius, vertexToGroup, vertexToCircle, edgeToLine) {

    var vertexToHighlight = {};

    this.highlightVertex = function(v, color, duration, strokeWidth) {
      duration = duration || defaults.highlightVertexDuration;
      strokeWidth = strokeWidth || defaults.highlightVertexStrokeWidth
      var highlight = vertexToHighlight[v];
      if (!highlight) {
        highlight = d3.select(vertexToGroup[v])
          .insert('circle', ':nth-child(2)')
          .attr('r', radius)
          .style('fill', color)
          .style('opacity', 0);
        vertexToHighlight[v] = highlight;
      }
      highlight.transition()
        .duration(duration)
        .style('opacity', 0.382);
      d3.select(vertexToCircle[v])
        .transition()
        .duration(duration)
        .style('stroke-width', strokeWidth);
    };

    this.unhighlightVertex = function(v, duration) {
      duration = duration || defaults.highlightVertexDuration;
      var highlight = vertexToHighlight[v];
      if (!highlight) {
        return;
      }
      highlight.transition()
        .duration(duration)
        .style('opacity', 0)
        .each('end', function() {
            d3.select(this).remove();
            vertexToHighlight[v] = undefined;
          });
      d3.select(vertexToCircle[v])
        .transition()
        .duration(duration)
        .style('stroke-width', 1);
    };

    this.highlightEdge = function(u, v, duration, strokeWidth) {
      duration = duration || defaults.highlightEdgeDuration;
      strokeWidth = strokeWidth || defaults.highlightEdgeStrokeWidth;
      d3.select(edgeToLine[[u, v]]).transition()
        .duration(duration)
        .style('stroke-width', strokeWidth);
    };

    this.unhighlightEdge = function(u, v, duration) {
      duration = duration || defaults.highlightEdgeDuration;
      d3.select(edgeToLine[[u, v]]).transition()
        .duration(duration)
        .style('stroke-width', 1);
    };
  }

  return {
    isChooseActiveIndex: isChooseActiveIndex,
    isRefineStart: isRefineStart,
    next: next,
    renderPartition: renderPartition,
    partitionBlockDimensions: partitionBlockDimensions,
    renderGraph: renderGraph,
    graphVertexRadius: graphVertexRadius
  };
});
