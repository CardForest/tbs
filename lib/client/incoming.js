'use strict';

var KeyPath = require('key-path');

/**
 * Locally handles commands requested by {@link TbsService} via a {@link TbsClientProxy}
 * @class
 */
function ClientIncoming(client) {
  this.client = client;
}

ClientIncoming.prototype.setGameRoomsIdx = function (msg) {
  var gameRoomsIdx = msg.gameRoomsIdx;

  console.log('got roomsIdx ' + gameRoomsIdx);
  this.client.gameRoomsIdx = gameRoomsIdx;
  this.client.emit('setGameRoomsIdx');
};

ClientIncoming.prototype.setGameRoom = function (msg) {
  var room = msg.gameRoom;
  var roomMemberIdx = msg.roomMemberIdx;

  console.log(this.client.credentials.userId + ' setting game room');

  this.client.room = room;
  this.client.roomMemberIdx = roomMemberIdx;

  this.client.emit('setGameRoom', room.id);
};

ClientIncoming.prototype.memberAdded = function (msg) {
  var newMemberIdx = msg.newMemberIdx;
  var member = msg.member;

  this.client.room.members[newMemberIdx] = member;

  this.client.emit('memberAdded');
};

ClientIncoming.prototype.memberRemoved = function (msg) {
  var memberIdx = msg.memberIdx;

  this.client.room.members.splice(memberIdx, 1);
  if (this.client.roomMemberIdx > memberIdx) {
    this.client.roomMemberIdx--;
  }

  console.log('memberRemoved')
  this.client.emit('memberRemoved');
};

ClientIncoming.prototype.memberReadyToPlay = function (msg) {
  var memberIdx = msg.memberIdx;

  this.client.room.members[memberIdx].readyToPlay = true;

  this.client.emit('memberReadyToPlay');
};


ClientIncoming.prototype.gameStarted = function (msg) {
  var game = msg.game;

  if (this.client.gameType.id !== game.typeId) {
    var out = this.client.out;
    var roomId = this.client.room.id;
    this.client.room.game = this.client.gameType.MasterClass.createInstance(game, {
      onMutatorCall: function (keyPath, params, mutator) {
        out.send('gameRooms', 'gameMutatorCall', {
          gameRoomId: roomId,
          keyPath: keyPath,
          params: params
        });
      },
      isChangeAllowed: false
    });
    this.client.emit('gameStarted');
  } else {
    throw Error('expected \'' + this.client.gameType.id + '\', got \'' + game.typeId + '\' instead')
  }
};

ClientIncoming.prototype.applyGameChangeSet = function (msg) {
  var changeSet = msg.changeSet;

  console.log('____');
  console.log('changeSet for client ' + this.client.credentials.userId);
  console.log(changeSet);
  console.log('¯¯¯¯');

  var i, l, change;
  var game = this.client.room.game;
  for (i = 0, l = changeSet.length; i < l; i++) {
    change = changeSet[i];
    if (change.type === 'setValue') {
      game.control.isChangeAllowed = true;
      KeyPath.get(change.payload.trgKeyPath.concat(change.payload.key)).setValueFrom(game, change.payload.newValue);
      game.control.isChangeAllowed = false;
    }
  }
};


ClientIncoming.prototype.error = function (msg) {
  this.client.emit('error', msg.errMsg);
};

module.exports = ClientIncoming;
