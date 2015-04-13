'use strict';

// in memory based game room store

function InMemGameRoom() {
  this.arr = [];
}

InMemGameRoom.prototype.save = function (gameRoom) {
  return this.arr.push(gameRoom) - 1;
};

InMemGameRoom.prototype.findById = function (gameRoomId) {
  return this.arr[gameRoomId];
};

module.exports = function () {
  return new InMemGameRoom();
};
