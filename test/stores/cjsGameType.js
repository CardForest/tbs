'use strict';

var assert = require('assert');
var path = require('path');
var gameTypeStore = require('../../lib/service/stores/cjsGameType')(path.join(__dirname, 'gameTypes'));

describe('CommonJS based game type store', function () {
  it('can retrieve game types by id', function () {
    assert.strictEqual(gameTypeStore.findById('whist').id, 'whist');
  });
});
