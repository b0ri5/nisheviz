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

  return {
    isChooseActiveIndex: isChooseActiveIndex,
    isRefineStart: isRefineStart,
    next: next
  };
});
