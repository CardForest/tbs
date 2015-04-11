'use strict';



function GameRoomStore(gameTypeStore, server) {
  this.store = [];
  this.gameTypeStore = gameTypeStore;
  this.server = server;
}

GameRoomStore.prototype.newRoom = function (userId, gameTypeId) {
  return this.store.push({
      notReadyCount: 1,
      gameTypeId: gameTypeId,
      players: [{userId: userId}]
    }) - 1;
};

GameRoomStore.prototype.joinRoom = function (userId, gameRoomId) {
  var gameRoom = this.store[gameRoomId];
  gameRoom.notReadyCount++;
  return gameRoom.players.push({userId: userId}) - 1;
};

GameRoomStore.prototype.playerReady = function (playerIdx, gameRoomId) {
  var gameRoom = this.store[gameRoomId];
  gameRoom.notReadyCount--;

  if (gameRoom.notReadyCount === 0) {
    var gameType = this.gameTypeStore.findById(gameRoom.gameTypeId);

  }
};

module.exports = GameRoomStore;
