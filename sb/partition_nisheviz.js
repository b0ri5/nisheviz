require.config({
  paths: {
    'nisheviz': '../nisheviz'
  }
});
require(['nisheviz'], function() {
  'use strict';
  console.log('running');
});
