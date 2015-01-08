require.config({
  paths: {
    'chai': 'node_modules/chai/chai',
    'jquery': 'node_modules/jquery/dist/jquery',
    'mocha': 'node_modules/mocha/mocha',
    'nishe': 'node_modules/nishe/nishe'
  },
  shim: {
    'mocha': {
      init: function() {
        'use strict';
        this.mocha.setup('bdd');
        return this.mocha;
      }
    }
  },
  // Set up jquery as recommended here:
  //   http://requirejs.org/docs/jquery.html#noconflictmap
  map: {
    '*': { 'jquery': 'jquery-private' },
    'jquery-private': { 'jquery': 'jquery' }
  }
});
require(['mocha'], function() {
  'use strict';
  mocha.setup('bdd');
  require(['nisheviz_test'], function() {
    if (window.mochaPhantomJS) {
      mochaPhantomJS.run();
    } else {
      mocha.checkLeaks();
      mocha.run();
    }
  });
});
