'use strict';

var util = require('util');
var ClientIncoming = require('../client/incoming');
var EventEmitter = require('events').EventEmitter;

/**
 * @class
 * @extends external:EventEmitter
 *
 * @param {Object=}
 */
function TbsClient(credentials) {
  EventEmitter.call(this);
  this.credentials = credentials || {userId: '' + TbsClient.transientUserCount++, transient: true};
  this.in = new ClientIncoming(this);
}
util.inherits(TbsClient, EventEmitter);

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


TbsClient.prototype.fetchGameRoomsIdx = function() {
  this.out.send('gameRooms', 'fetchGameRoomsIdx');
  //return this.out.createGameRoom(gameTypeId).spread(this._setGameRoom.bind(this));
};

TbsClient.prototype.createGameRoom = function(gameType) {
  this.gameType = gameType;
  this.out.send('gameRooms', 'create', {gameTypeId: gameType.id});
};

TbsClient.prototype.joinGameRoom = function(gameType, gameRoomId) {
  this.gameType = gameType;
  this.out.send('gameRooms', 'join', {gameRoomId: gameRoomId});
};

TbsClient.prototype.leaveGameRoom = function() {
  this.out.send('gameRooms', 'leave', {gameRoomId: this.room.id});
  delete this.room;
  delete this.roomMemberIdx;
};

TbsClient.prototype.readyToPlay = function() {
  return this.out.send('gameRooms', 'readyToPlay', {gameRoomId: this.room.id});
};

module.exports = TbsClient;
