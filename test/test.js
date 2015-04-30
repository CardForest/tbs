'use strict';
var assert = require('assert');
var tbs = require('../');
var Promise = require('bluebird');

var gameTypes = {
  'test-game': {
    minNumOfPlayers: 2,
    Game: {
      createInstance: function() {return {
        getViewForMember: function () {return 'test-game-instance';}
      };}
    }
  }
};

var localGameFactory = require('../lib/localGameFactory');

describe('tbs module', function () {
  it('inline local game', function (done) {
    var service = new tbs.Service(
      new tbs.inMem.GameRoomService(),
      new tbs.inMem.GameTypeService(gameTypes),
      new tbs.inMem.UserService(),
      new tbs.DirectTransport()
    );

    Promise.all([service.transport.connect(), service.transport.connect()])
    .spread(function (client1, client2) {
        client1.createGameRoom('test-game').then(function () {
          client2.joinGameRoom(client1.room.id).then(function () {
            client1.on('gameStarted', function() {
              assert.equal(client1.room.game, 'test-game-instance');
              done();
            });

            client1.readyToPlay();
            client2.readyToPlay();

          });
        });
    });
  });

  it('localGameFactory', function (done) {
    localGameFactory(gameTypes['test-game']).spread(function (client1, client2) {
      assert.equal(client1.credentials.userId, '0');
      assert.equal(client2.credentials.userId, '1');

      assert.equal(client1.room.game, 'test-game-instance');
      assert.equal(client2.room.game, 'test-game-instance');

      done();
    });
  });
});
