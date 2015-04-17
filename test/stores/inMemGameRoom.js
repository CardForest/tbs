'use strict';

var assert = require('assert');
var gameRoomStore = require('../../lib/service/stores/inMemGameRoom')();

describe.skip('in memory based game room store', function () {
  it('can save and retrieve game rooms by id', function () {
    var gameRoom = {};
    var gameRoomId = gameRoomStore.save(gameRoom);

    assert.strictEqual(gameRoomStore.findById(gameRoomId), gameRoom);
  });
});
