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
// TODO remove this
//TbsClient.prototype._setGameRoom = function (room, roomMemberIdx) {
//  this.room = room;
//  this.roomMemberIdx = roomMemberIdx;
//};

TbsClient.prototype.createGameRoom = function(gameType) {
  this.gameType = gameType;
  this.out.createGameRoom(gameType.id);
  //return this.out.createGameRoom(gameTypeId).spread(this._setGameRoom.bind(this));
};

TbsClient.prototype.joinGameRoom = function(gameType, gameRoomId) {
  this.gameType = gameType;
  this.out.joinGameRoom(gameRoomId);
  //return this.out.joinGameRoom(gameRoomId).spread(this._setGameRoom.bind(this));
};

TbsClient.prototype.readyToPlay = function() {
  return this.out.readyToPlay();
};

module.exports = TbsClient;
