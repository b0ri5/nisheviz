define([], function() {
  'use strict';

  var isRefineStart = function(state) {
    var keys = Object.keys(state);
    return keys.length == 1 && keys[0] == 'partition';
  };

  return {
    isRefineStart: isRefineStart
  };
});
