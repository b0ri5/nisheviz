// Set up jquery as recommended here:
//   http://requirejs.org/docs/jquery.html#noconflictmap
define(['jquery'], function(jquery) {
  'use strict';
  return jquery.noConflict(true);
});
