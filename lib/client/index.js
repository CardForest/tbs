'use strict';

var util = require('util');
var ClientIncoming = require('../client/incoming');

/**
 * @class
 * @extends external:EventEmitter
 *
 * @param {Object=}
 */
function TbsClient(credentials) {
  this.credentials = credentials || {userId: '' + TbsClient.transientUserCount++, transient: true};
  this.in = new ClientIncoming(this);
}
util.inherits(TbsClient, require('events').EventEmitter);

TbsClient.transientUserCount = 0;
/**
 * Set this client current game room
 * @private
 * @param {!GameRoomService.GameRoom} gameRoom
 */
TbsClient.prototype._setGameRoom = function (room, roomMemberIdx) {
  this.room = room;
  this.roomMemberIdx = roomMemberIdx;
};

TbsClient.prototype.createGameRoom = function(gameTypeId) {
  return this.out.createGameRoom(gameTypeId).spread(this._setGameRoom.bind(this));
};

TbsClient.prototype.joinGameRoom = function(gameRoomId) {
  return this.out.joinGameRoom(gameRoomId).spread(this._setGameRoom.bind(this));
};

TbsClient.prototype.readyToPlay = function() {
  return this.out.readyToPlay();
};

//
//Client.prototype.joinGameRoom = function(gameRoomId) {
//  var self = this;
//  return this.serviceProxy.joinGameRoom(gameRoomId).then(function (room) {
//    self.setGameRoom(room);
//    return room;
//  });
//};
//
//Client.prototype.readyToPlay = function() {
//  this.serviceProxy.readyToPlay();
//};
//
//Client.prototype.performGameAction = function() {
//  this.serviceProxy.performGameAction.apply(this.serviceProxy, arguments);
//};

module.exports = TbsClient;
