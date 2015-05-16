/* jshint browser: true */
'use strict';

var Primus = require('primusClient');
var Client = require('../../client');

function PrimusClientFactory(port) {
  this.port = port;
}

PrimusClientFactory.prototype.connect = function (credentials) {
  var primus = Primus.connect(
    window.location.protocol +
    '//' + window.location.hostname +
    ':' + this.port +
    '?' +
      'ticket=' + credentials.userId, // TODO real encoding
    {
      strategy: [
        // make sure we avoid timeout strategy since it does not detect authorization errors properly
        'disconnect', 'online'
      ]
    }
  );

  var client = new Client(credentials);

  primus.on('data', function(msg) {
    if (!(msg.type in client.in)) {
      var errMsg = 'client got unknown message: ' + JSON.stringify(msg);
      console.error(errMsg);
      client.emit('error', errMsg);
    } else {
      client.in[msg.type].call(client.in, msg.payload);
    }
  });

  client.out = {
    send: function(api, msgType, payload) {
      primus.write({
        api: api,
        type: msgType,
        payload: payload
      });
    }
  };

  primus.on('open', function open() {
    console.log('Connection is alive and kicking');
    client.emit('open');
  });

  primus.on('error', function error(err) {
    console.error('Something horrible has happened', err.stack);
  });

  primus.on('reconnected', function (opts) {
    console.log('It took %d ms to reconnect', opts.duration);
    // rejoin game room if needed
    if (client.hasOwnProperty('room')) {
      client.out.send('gameRooms', 'join', {gameRoomId: client.room.id});
    }
  });

  return client;
};

module.exports = PrimusClientFactory;
