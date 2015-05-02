'use strict';

var Service = require('./service');
var InMemGameRoomService = require('./service/inMem/gameRoomService');
var InMemGameTypeService = require('./service/inMem/gameTypeService');
var InMemUserService = require('./service/inMem/UserService');
var DirectTransport = require('./transport/directTransport');

var Promise = require('bluebird');

module.exports = function (gameType, numOfPlayers) {
  if (numOfPlayers == null) {
    if (gameType.numOfPlayers != null) {
      numOfPlayers = gameType.numOfPlayers;
    } else {
      numOfPlayers = gameType.minNumOfPlayers;
    }
  }
  var gameTypes = {};
  gameTypes[gameType.id] = gameType;
    var service = new Service(
    new InMemGameRoomService(),
    new InMemGameTypeService(gameTypes),
    new InMemUserService(),
    new DirectTransport()
  );

  var i;
  var clients = [];
  for (i = 0; i < numOfPlayers; i++) {
    clients.push(service.transport.connect());
  }

  return new Promise(function (resolve, reject) {
    var gameStartedCount = 0;
    var onGameStarted = function () {
      gameStartedCount++;
      if (gameStartedCount === numOfPlayers) {
        resolve(clients);
      }
    };

    for (i = 0; i < numOfPlayers; i++) {
      clients[i].once('gameStarted', onGameStarted);
    }

    clients[0].createGameRoom(gameType);
    clients[0].once('setGameRoom', function () {
      clients[0].readyToPlay();

      var gameRoomId = clients[0].room.id;
      function joinAndReady(client) {
        client.joinGameRoom(gameType, gameRoomId);
        client.once('setGameRoom', function () {
          client.readyToPlay();
        });
      }
      for (i = 1; i < numOfPlayers; i++) {
        joinAndReady(clients[i]);
      }
    });
  });
};
