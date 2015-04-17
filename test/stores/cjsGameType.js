'use strict';

var assert = require('assert');
var path = require('path');
var gameTypeStore = require('../../lib/service/stores/cjsGameType')(path.join(__dirname, 'gameTypes'));

describe('CommonJS based game type store', function () {
  it('can retrieve game types by id', function (done) {
    gameTypeStore.get('whist').then(function (gameType) {
      assert.strictEqual(gameType.id, 'whist');
      done();
    });
  });

  it('can retrieve all game types', function (done) {
    gameTypeStore.getAll().then(function (allGameTypes) {
      assert.strictEqual(Object.keys(allGameTypes).length, 2);
      assert(allGameTypes.hasOwnProperty('whist'));
      assert(allGameTypes.hasOwnProperty('otherGame'));
      done();
    });
  });
});
