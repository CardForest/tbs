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
        req.userId = req.query.ticket;
        return done();
      }

      done({
        message: 'Authentication required',
        authenticate: 'Bearer'
      });
    }
  });

  primus.on('connection', function connection(spark) {
    var clientProxy = {
      userId: spark.request.userId,
      setGameRoom: function(gameRoom, roomMemberIdx) {
        spark.write({
          type: 'setGameRoom',
          gameRoom: gameRoom,
          roomMemberIdx: roomMemberIdx
        });
      },
      gameStarted: function(game) {
        spark.write({
          type: 'gameStarted',
          game: game
        });
      },
      addGameRoomMember: function(newMemberIdx, member) {
        spark.write({
          type: 'addGameRoomMember',
          newMemberIdx: newMemberIdx,
          member: member
        });
      },
      applyGameChangeSet: function(changeSet) {
        spark.write({
          type: 'applyGameChangeSet',
          changeSet: changeSet
        });
      }
    };

    console.log('spark! ' + spark.id);
    spark.on('data', function(msg) {
      try {
        switch (msg.type) {
          case 'createGameRoom':
            tbsService.gameRooms.create(clientProxy, msg.gameTypeId);
            break;
          case 'joinGameRoom':
            tbsService.gameRooms.join(clientProxy, msg.gameRoomId);
            break;
          case 'readyToPlay':
            tbsService.gameRooms.readyToPlay(clientProxy, msg.gameRoomId);
            break;
          case 'gameMutatorCall':
            tbsService.gameRooms.gameMutatorCall(clientProxy, msg.gameRoomId, msg.keyPath, msg.params);
            break;
          default:
            console.error('got unknown message: ' + JSON.stringify(msg));
        }
      } catch (e) {
        console.error((e.hasOwnProperty('stack')) ? e.stack : e);
      }
    });
  });
};

module.exports = PrimusTransportService;
