/* jshint browser: true */
'use strict';

var Primus = require('primusClient');
var Client = require('../../client');

function PrimusTransportClient(port) {
  this.port = port;
}

PrimusTransportClient.prototype.connect = function (credentials) {
  var primus = Primus.connect(
    window.location.protocol +
    '//' + window.location.hostname +
    ':' + this.port +
    '?' +
      'ticket=' + credentials.userId, // TODO real encoding
    {
      strategy: [
        // make sure we avoid timeout strategy since it does not detect authorization errors properly
        'disconnect', 'online'
      ]
    }
  );

  var client = new Client(credentials);

  primus.on('data', function(msg) {
    switch (msg.type) {
      case 'setGameRoom':
        client.in.setGameRoom(msg.gameRoom, msg.roomMemberIdx);
        break;
      case 'gameStarted':
        client.in.gameStarted(msg.game);
        break;
      case 'addGameRoomMember':
        client.in.addGameRoomMember(msg.newMemberIdx, msg.member);
        break;
      case 'applyGameChangeSet':
        client.in.applyGameChangeSet(msg.changeSet);
        break;
      default:
        console.error('got unknown message: ' + JSON.stringify(msg));
    }
  });

  client.out = {
    createGameRoom: function(gameTypeId) {
      primus.write({
        type: 'createGameRoom',
        gameTypeId: gameTypeId
      });
    },
    joinGameRoom: function(gameRoomId) {
      primus.write({
        type: 'joinGameRoom',
        gameRoomId: gameRoomId
      });
    },
    readyToPlay: function() {
      primus.write({
        type: 'readyToPlay'
      });
    },
    gameMutatorCall: function(keyPath, params) {
      primus.write({
        type: 'gameMutatorCall',
        keyPath: keyPath,
        params: params
      });
    }
  };

  return client;
};

module.exports = PrimusTransportClient;
