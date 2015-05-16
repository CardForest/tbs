'use strict';

var KeyPath = require('key-path');
var GamePlayer = require('../gamePlayer');

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

  if (room.hasOwnProperty('game')) {
    this.setGame({game: room.game});
  }
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

  console.log('memberRemoved');
  this.client.emit('memberRemoved');
};

ClientIncoming.prototype.memberReadyToPlay = function (msg) {
  var memberIdx = msg.memberIdx;

  this.client.room.members[memberIdx].readyToPlay = true;

  this.client.emit('memberReadyToPlay');
};


ClientIncoming.prototype.setGame = function (msg) {
  var gamePlayer = new GamePlayer(this.client.gameType);
  gamePlayer.load(msg.game, this.client.out, this.client.room.id);

  this.client.game = gamePlayer.game;
  this.client.gameControl = gamePlayer.control;

  this.client.emit('setGame');

  if (msg.hasOwnProperty('changeSet')) {
    this.applyGameChangeSet(msg);
  }
};

ClientIncoming.prototype.applyGameChangeSet = function (msg) {
  var changeSet = msg.changeSet;

  var i, l, change;
  var game = this.client.game;
  var gameControl = this.client.gameControl;
  for (i = 0, l = changeSet.length; i < l; i++) {
    change = changeSet[i];
    if (change.type === 'setValue') {
      gameControl.isChangeAllowed = true;
      KeyPath.get(change.payload.trgKeyPath.concat(change.payload.key)).setValueFrom(game, change.payload.newValue);
      gameControl.isChangeAllowed = false;
    }
  }

  this.client.emit('applyGameChangeSet');
};


ClientIncoming.prototype.error = function (msg) {
  this.client.emit('error', msg.errMsg);
};

module.exports = ClientIncoming;
