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

  var next = function(state) {
    if (isRefineStart(state)) {
      return nextRefineStart(state);
    }
    if (isChooseActiveIndex(state)) {
      return nextChooseActiveIndex(state);
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

  return {
    isChooseActiveIndex: isChooseActiveIndex,
    isRefineStart: isRefineStart,
    next: next
  };
});
