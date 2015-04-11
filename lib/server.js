'use strict';

function Server(opt) {
  this.gameRoomStore = opt.gameRoomStore;
  this.gameTypeStore = opt.gameTypeStore;
}

Server.prototype.newRoom = function(userId, gameTypeId) {
  return this.gameRoomStore.newRoom(userId, gameTypeId);
};

Server.prototype.joinRoom = function(userId, gameRoomId) {
  return this.gameRoomStore.joinRoom(userId, gameRoomId);
};

Server.prototype.playerReady = function(playerIdx, gameRoomId) {
  var gameRoom = this.gameRoomStore.playerReady(playerIdx, gameRoomId);

  if (gameRoom.isReady) {
    var gameType = this.gameTypeStore.findById(gameRoom.gameTypeId);

    gameRoom.master = gameType.MasterClass.createInstance();

    gameRoom.master.onStart();
  }
};

module.exports = Server;
