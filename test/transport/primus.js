'use strict';

var assert = require('assert');
var Runner = require('../run');

describe('primus transport browser tests', function () {
  it('passes browser-side tests', function (done) {
    // allow for a long timeout since this runs entire browser suite
    this.timeout(20000);

    var karma = require('karma').server;

    var runner = new Runner(function () {
      karma.start({
        configFile: __dirname + '/../../karma.conf.js'
      }, function(exitCode) {
        assert.equal(0, exitCode);
        runner.close(done);
      });
    });
  });
});
