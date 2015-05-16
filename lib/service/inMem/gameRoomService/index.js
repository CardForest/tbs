'use strict';

var GameRoom = require('./gameRoom');

/**
 * @class
 * @implements GameRoomService
 * @this TbsService
 */
function InMemGameRoomService() {
  /**
   * Inner game room list
   * @type {Array.<GameRoomService.GameRoom>}
   */
  this.gameRooms = [];
}

InMemGameRoomService.prototype.setService = function (service) {
  this.service = service;
};

InMemGameRoomService.prototype.fetchGameRoomsIdx = function (client) {
  var gameRoomsIdx = [];
  for (var i = 0, l = this.gameRooms.length; i < l; i++) {
    var gameRoom = this.gameRooms[i];
    gameRoomsIdx.push({
      gameTypeId: gameRoom.gameType.id,
      id: gameRoom.id,
      numberOfPlayers: gameRoom.memberSet.numOfPlayers
    });
  }
  client.send('setGameRoomsIdx', {
    gameRoomsIdx: gameRoomsIdx
  });
};

InMemGameRoomService.prototype.create = function (client, opt) {
  var self = this;
  var gameTypeId = opt.gameTypeId;

  this.service.gameTypes.get(client, gameTypeId).then(function (gameType) {
    var newGameRoomId = self.gameRooms.length;
    var newGameRoom = new GameRoom(self.service, newGameRoomId, gameType);

    self.gameRooms.push(newGameRoom);

    newGameRoom.join(client);
  });
};

InMemGameRoomService.prototype.join = function (client, opt) {
  var gameRoomId = opt.gameRoomId;

  if (this.gameRooms.hasOwnProperty(gameRoomId)) {
    this.gameRooms[gameRoomId].join(client);
  } else {
    throw Error('could not not find game room \'' + gameRoomId + '\'');
  }
};

InMemGameRoomService.prototype.leave = function (client, opt) {
  var gameRoomId = opt.gameRoomId;

  if (this.gameRooms.hasOwnProperty(gameRoomId)) {
    this.gameRooms[gameRoomId].leave(client);
  } else {
    throw Error('could not not find game room \'' + gameRoomId + '\'');
  }
};

InMemGameRoomService.prototype.readyToPlay = function (client, opt) {
  var gameRoomId = opt.gameRoomId;

  if (this.gameRooms.hasOwnProperty(gameRoomId)) {
    this.gameRooms[gameRoomId].readyToPlay(client);
  } else {
    throw Error('could not not find game room \'' + gameRoomId + '\'');
  }
};

InMemGameRoomService.prototype.gameMutatorCall = function (client, opt) {
  var gameRoomId = opt.gameRoomId, actionKeyPath = opt.keyPath, actionParams = opt.params;

  if (this.gameRooms.hasOwnProperty(gameRoomId)) {
    this.gameRooms[gameRoomId].gameMutatorCall(client, actionKeyPath, actionParams);
  } else {
    throw Error('could not not find game room \'' + gameRoomId + '\'');
  }
};

module.exports = InMemGameRoomService;
