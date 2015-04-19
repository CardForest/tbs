'use strict';

function Client(transport) {
  this.transport = transport;
  //this.service = transport.connect(this);
}

//Client.prototype.exports = {
//  setGameRoom: function (newGameRoom, playerIdx) {
//    this.gameRoom = newGameRoom;
//  },
//  applyGameChanges: function (gameRoomId, changeSet) {
//
//  }
//};

module.exports = Client;
