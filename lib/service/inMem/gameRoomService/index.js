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

InMemGameRoomService.prototype.performAction = function (client, actionId) {
  if (!Array.isArray(actionId)) {
    actionId = [actionId];
  }
  var actionParams = Array.prototype.slice.call(arguments, 2);

  this.gameRooms[client.gameRoomId].performAction(client, actionId, actionParams);
};

module.exports = InMemGameRoomService;
