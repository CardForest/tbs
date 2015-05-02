'use strict';

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

  clientProxy.transient = client.credentials.transient;
  clientProxy.userId = client.credentials.userId;

  Object.defineProperty(clientProxy, 'gameRoomId', {
    get: function() {return client.room.id;}
  });

  var service = this.service;
  client.out = {
    createGameRoom: function(gameTypeId) {
      return service.gameRooms.create(clientProxy, gameTypeId);
    },
    joinGameRoom: function(gameRoomId) {
      return service.gameRooms.join(clientProxy, gameRoomId);
    },
    readyToPlay: function() {
      return service.gameRooms.readyToPlay(clientProxy, client.room.id);
    },
    gameMutatorCall: function(keyPath, params) {
      return service.gameRooms.gameMutatorCall(clientProxy, client.room.id, keyPath, params);
    }
  };

  return client;
};

module.exports = DirectTransport;
