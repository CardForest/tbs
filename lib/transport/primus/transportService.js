'use strict';

var Primus = require('primus');

function PrimusTransportService(webServer) {
  this.webServer = webServer;
}

PrimusTransportService.prototype.setService = function (tbsService) {
  var primus = new Primus(this.webServer, {
    transformer: 'websockets',
    authorization: function (req, done) {
      if (req.query.ticket) {
        // TODO real decoding
        req.user = req.query.ticket;
        return done();
      }

      done({
        message: 'Authentication required',
        authenticate: 'Bearer'
      });
    }
  });

  var clientProxy = {
    setGameRoom: function(gameRoom, roomMemberIdx) {
      primus.write({
        type: 'setGameRoom',
        gameRoom: gameRoom,
        roomMemberIdx: roomMemberIdx
      });
    },
    gameStarted: function(game) {
      primus.write({
        type: 'gameStarted',
        game: game
      });
    },
    addGameRoomMember: function(newMemberIdx, member) {
      primus.write({
        type: 'addGameRoomMember',
        newMemberIdx: newMemberIdx,
        member: member
      });
    },
    applyGameChangeSet: function(changeSet) {
      primus.write({
        type: 'applyGameChangeSet',
        changeSet: changeSet
      });
    }
  };

  primus.on('connection', function connection(spark) {
    primus.on('data', function(msg) {
      switch (msg.type) {
        case 'createGameRoom':
          tbsService.gameRooms.create(clientProxy, msg.gameTypeId);
          break;
        case 'joinGameRoom':
          tbsService.gameRooms.join(clientProxy, msg.gameRoomId);
          break;
        case 'readyToPlay':
          tbsService.gameRooms.readyToPlay(clientProxy);
          break;
        case 'gameMutatorCall':
          tbsService.gameRooms.gameMutatorCall(clientProxy, msg.keyPath, msg.params);
          break;
        default:
          console.error('got unknown message: ' + JSON.stringify(msg));
      }
    });
  });
};

module.exports = PrimusTransportService;
