'use strict';

var util = require('util');
var assign = require('object-assign');


var transientUserCount = 0;

/**
 * @class
 * @implements ClientExports
 * @implements ServiceExports
 * @implements external:EventEmitter
 *
 * @param {TransportClient}
 * @param {Object=}
 *
 */
function Client(transport, credentials) {
  this.credentials = credentials || {userId: '' + transientUserCount++, transient: true};

  // transport must be called after credentials have been set
  this.serviceProxy = transport.connect(this);

  this.room = null;

  this.member = null;
}

util.inherits(Client, require('events').EventEmitter);

assign(Client.prototype, require('./clientExports'));

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
  this.serviceProxy.readyToPlay();
};

Client.prototype.performGameAction = function() {
  this.serviceProxy.performGameAction.apply(this.serviceProxy, arguments);
};

module.exports = Client;
