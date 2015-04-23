'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var transientUserCount = 0;

/**
 * @class
 *
 * @param {TransportClient}
 *
 */
function Client(transport, credentials) {
  this.credentials = credentials || {userId: '' + transientUserCount++, transient: true};
  // transport must be called after credentials have been set
  // it will exports 'credentials' property, observed change handling methods, and 'applyChangeSet' method
  /**
   * @member
   */
  this.serviceProxy = transport.connect(this);
}
util.inherits(Client, EventEmitter);

Client.prototype._setGameRoom = function(room) {
  /**
   * @member Client#room
   */
  this.room = room;
  /**
   * @member Client#member
   */
  this.member = room.members[room.memberIdx];
};

Client.prototype._addGameRoomMember = function(newMemberIdx, member) {
  this.room.members[newMemberIdx] = member;
};

Client.prototype._memberReadyToPlay = function(memberIdx) {
  this.room.members[memberIdx].readyToPlay = true;
};

Client.prototype._gameStarted = function(game) {
  this.room.gameStarted = true;
  this.room.game = game;
};

Client.prototype._gameOver = function(gameOver) {
  this.room.gameOver = gameOver;
};

Client.prototype.applyChangeSet = function(changeSet) {
  for (var i = 0, l = changeSet.length; i < l; i++) {
    var change = changeSet[i];

    this[change.type].apply(this, change.payload);
  }
};

Client.prototype.createGameRoom = function(gameTypeId) {
  var self = this;
  return this.serviceProxy.createGameRoom(gameTypeId).then(function (room) {
    self.setGameRoom(room);
    return room;
  });
};

Client.prototype.joinGameRoom = function(gameRoomId) {
  var self = this;
  return this.serviceProxy.joinGameRoom(gameRoomId).then(function (room) {
    self.setGameRoom(room);
    return room;
  });
};

Client.prototype.readyToPlay = function() {
  this.serviceProxy.readyToPlay(this.room.id);
};

Client.prototype.performGameAction = function(actionId) {
  var rest = Array.prototype.slice.call(arguments, 1);
  this.serviceProxy.performGameAction({
    gameRoomId: this.room.id,
    actionKeyPath: [actionId],
    params: rest
  });
};

function wrapChangeHandlerWithObserver(changeType) {
  return function () {
    var argsArray = Array.prototype.slice.call(arguments, 0);
    this.emit.apply(this, ['before_' + changeType].concat(argsArray));

    this['_' + changeType].apply(this, arguments);

    this.emit.apply(this, ['after_' + changeType].concat(argsArray));
  };
}
var changeTypes = ['setGameRoom', 'addGameRoomMember', 'memberReadyToPlay', 'gameStarted', 'gameOver'];
for (var i = 0, l = changeTypes.length; i < l; i++) {
  var changeType = changeTypes[i];
  Client.prototype[changeType] = wrapChangeHandlerWithObserver(changeType);
}

module.exports = Client;
