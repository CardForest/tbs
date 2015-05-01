'use strict';

var Promise = require('bluebird');
var Client = require('../client');
var ClientIncoming = require('../client/incoming');

/**
 * A transport that directly links TBS client to service, without any serialization/networking
 *
 * @class
 * @implements {TransportClient}
 * @implements {TransportService}
 */
function DirectTransport() {
  Client.transientUserCount = 1;
}

DirectTransport.prototype.setService = function (service) {
  this.service = service;
};

DirectTransport.prototype.connect = function (credentials) {
  var client = new Client(credentials);

  var clientProxy = new ClientIncoming(client);
  clientProxy.credentials = client.credentials;
  Object.defineProperty(clientProxy, 'gameRoomId', {
    get: function() {return client.room.id;}
  });

  var service = this.service;
  client.out = {
    createGameRoom: function() {
      Array.prototype.unshift.call(arguments, clientProxy);
      return service.gameRooms.create.apply(service.gameRooms, arguments);
    },
    joinGameRoom: function() {
      Array.prototype.unshift.call(arguments, clientProxy);
      return service.gameRooms.join.apply(service.gameRooms, arguments);
    },
    readyToPlay: function() {
      return service.gameRooms.readyToPlay.call(service.gameRooms, clientProxy);
    },
    gameMutatorCall: function(keyPath, params) {
      return service.gameRooms.gameMutatorCall(clientProxy, keyPath, params);
    }
  };

  return Promise.resolve(client);
};

module.exports = DirectTransport;
