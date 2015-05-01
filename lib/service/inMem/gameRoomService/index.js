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

    return newGameRoom.join(client);
  });
};

InMemGameRoomService.prototype.join = function (client, gameRoomId) {
  return this.gameRooms[gameRoomId].join(client);
};

InMemGameRoomService.prototype.readyToPlay = function (client) {
  this.gameRooms[client.gameRoomId].readyToPlay(client);
};

InMemGameRoomService.prototype.gameMutatorCall = function (client, actionKeyPath, actionParams) {
  this.gameRooms[client.gameRoomId].gameMutatorCall(client, actionKeyPath, actionParams);
};

module.exports = InMemGameRoomService;
