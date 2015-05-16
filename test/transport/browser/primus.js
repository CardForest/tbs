'use strict';

var assert = require('assert');

var ClientFactory = require('../../../lib/transport/primus/clientFactory');

describe('primus transport browser tests', function () {
  it('respond with \'open\' message connection succeeds', function (done) {
    var client = (new ClientFactory(9001 /* assume there is a primus listening */)).connect({userId: 'testUser'});
    client.on('open', function () {
      done();
    });
  });

  it('respond with \'end\' message when connection failes', function (done) {
    // match primus's timeout
    this.timeout(10000);

    var client = (new ClientFactory(0 /* not a used real port */)).connect({userId: 'testUser'});
    client.on('end', function () {
      done();
    });
  });
});
