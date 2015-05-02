'use strict';

var KeyPath = require('key-path');

/**
 * Locally handles commands requested by {@link TbsService} via a {@link TbsClientProxy}
 * @class
 */
function ClientIncoming(client) {
 this.client = client;
}

ClientIncoming.prototype.setGameRoom = function(room, roomMemberIdx) {
  console.log(this.client.credentials.userId + ' setting game room');

  this.client.room = room;
  this.client.roomMemberIdx = roomMemberIdx;

  this.client.emit('setGameRoom');
};

ClientIncoming.prototype.addGameRoomMember = function(newMemberIdx, member) {
  this.client.room.members[newMemberIdx] = member;
};

ClientIncoming.prototype.gameStarted = function(game) {
  if (this.client.gameType.id !== game.typeId) {
    var out = this.client.out;
    this.client.room.game = this.client.gameType.MasterClass.createInstance(game, {
      onMutatorCall: function(keyPath, params, mutator) {
        out.gameMutatorCall(keyPath, params);
      },
      isChangeAllowed: false
    });
    this.client.emit('gameStarted');
  } else {
    throw Error('expected \'' + this.client.gameType.id + '\', got \'' + game.typeId + '\' instead')
  }
};

ClientIncoming.prototype.applyGameChangeSet = function(changeSet) {
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



module.exports = ClientIncoming;
