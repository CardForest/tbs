'use strict';

module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['browserify', 'mocha'],
    preprocessors: {
      'test/transport/browser/primus.js': [ 'browserify' ]
    },
    browserify: {
      debug: true
    },
    singleRun: true,
    files: [
      'test/transport/browser/primus.js'
    ],
    reporters: ['mocha'],
    client: {
     // captureConsole: true,
      mocha: {
        bail: true
      }
    }
  });
};
