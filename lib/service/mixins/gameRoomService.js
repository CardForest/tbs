'use strict';

var GameRoom = require('../GameRoom');

function InMemGameRoomService() {
  this.gameRooms = [];
}

InMemGameRoomService.prototype.createGameRoom = function (clientProxy, gameTypeId) {
  var self = this;

  return this.getGameType(clientProxy, gameTypeId).then(function (gameType) {
    var newGameRoomId = this.gameRooms.length;
    var newGameRoom = new GameRoom(newGameRoomId, gameType);

    self.gameRooms.push(newGameRoom);

    return newGameRoom.join(service, clientProxy);
  });
};

InMemGameRoomService.prototype.join = function (args, service, clientProxy) {
  var gameRoomId = args[0];
  return this.gameRooms[gameRoomId].join(service, clientProxy);
};

InMemGameRoomService.prototype.readyToPlay = function (args, service, clientProxy) {
  this.gameRooms[clientProxy.gameRoomId].readyToPlay(service, clientProxy);
};

InMemGameRoomService.prototype.performAction = function (args, service, clientProxy) {
  var actionId = args[0];
  if (typeof actionId === 'string') {
    actionId = [actionId];
  }
  var actionParams = Array.prototype.slice.call(args, 1);

  this.gameRooms[clientProxy.gameRoomId].performAction(actionId, actionParams, service, clientProxy);
};

module.exports = InMemGameRoomService;
