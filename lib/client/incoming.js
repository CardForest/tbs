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
  this.room = room;
  this.roomMemberIdx = roomMemberIdx;
};

ClientIncoming.prototype.addGameRoomMember = function(newMemberIdx, member) {
  this.client.room.members[newMemberIdx] = member;
};

ClientIncoming.prototype.gameStarted = function(game) {
  var out = this.client.out;
  this.client.room.game = this.client.room.gameType.MasterClass.createInstance(game, {
    onMutatorCall: function(keyPath, params, mutator) {
      out.gameMutatorCall(keyPath, params);
    },
    isChangeAllowed: false
  });
  this.client.emit('gameStarted');
};

ClientIncoming.prototype.applyGameChangeSet = function(changeSet) {
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
