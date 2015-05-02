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

InMemGameRoomService.prototype.create = function (client, gameTypeId) {
  var self = this;

  return this.service.gameTypes.get(client, gameTypeId).then(function (gameType) {
    var newGameRoomId = self.gameRooms.length;
    var newGameRoom = new GameRoom(self.service, newGameRoomId, gameType);

    self.gameRooms.push(newGameRoom);

    newGameRoom.join(client);
  });
};

InMemGameRoomService.prototype.join = function (client, gameRoomId) {
  if (this.gameRooms.hasOwnProperty(gameRoomId)) {
    this.gameRooms[gameRoomId].join(client);
  } else {
    throw Error('could not not find game room \'' + gameRoomId + '\'');
  }
};

InMemGameRoomService.prototype.readyToPlay = function (client, gameRoomId) {
  if (this.gameRooms.hasOwnProperty(gameRoomId)) {
    this.gameRooms[gameRoomId].readyToPlay(client);
  } else {
    throw Error('could not not find game room \'' + gameRoomId + '\'');
  }
};

InMemGameRoomService.prototype.gameMutatorCall = function (client, gameRoomId, actionKeyPath, actionParams) {
  if (this.gameRooms.hasOwnProperty(gameRoomId)) {
    this.gameRooms[gameRoomId].gameMutatorCall(client, actionKeyPath, actionParams);
  } else {
    throw Error('could not not find game room \'' + gameRoomId + '\'');
  }
};

module.exports = InMemGameRoomService;
