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
  var service = new Service(
    new InMemGameRoomService(),
    new InMemGameTypeService({
      'gameType': gameType
    }),
    new InMemUserService(),
    new DirectTransport()
  );

  var i;
  var clientPromises = [];
  for (i = 0; i < numOfPlayers; i++) {
    clientPromises.push(service.transport.connect());
  }
  return Promise
    .all(clientPromises)
    .then(function (clients) {
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

        // create a new game room
        clients[0].createGameRoom('gameType').then(function () {
          // make sure first client is ready
          clients[0].readyToPlay();
          var roomId = clients[0].room.id;

          // make sure all others join the room
          var joinAndReady = function (client) {
            client.joinGameRoom(roomId).then(function () {
              client.readyToPlay();
            }, reject);
          };
          for (i = 1; i < numOfPlayers; i++) {
            joinAndReady(clients[i]);
          }
        }, reject);

      });
    });
};
