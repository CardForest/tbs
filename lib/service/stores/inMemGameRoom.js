'use strict';

function GameRoom(id, gameType) {
  this.id = id;
  this.gameType = gameType;

  this.players = [];
  this.playerProfiles = [];

  this.gameStarted = false;
}

GameRoom.prototype.getPlayerView = function (playerIdx) {
  var gameRoomgetPlayerView = {
    id: this.id,
    gameTypeId: this.gameType.id,
    playerProfiles: this.playerProfiles,
    gameStarted: this.gameStarted,
    playerIdx: playerIdx
  };

  if (this.gameStarted) {
    gameRoomgetPlayerView.game = this.masterGame.snapshot(playerIdx);
  }

  return gameRoomgetPlayerView;
};



GameRoom.prototype.getPlayer = function(clientProxy) {
  for (var i = 0, l = this.players.length; i < l; i++) {
    var player = this.players[i];

    if (player.userId === clientProxy.userId) {
      // this user is part of the game

      // make sure we have the latest clientProxy
      player.clientProxy = clientProxy;

      return player;
    }
  }
};

GameRoom.prototype.join = function (service, clientProxy) {
  var player = this.getPlayer(clientProxy);

  if (player != null) {
    clientProxy.onGameRoomChange(this.getPlayerView(player.idx));
    return;
  }

  // this is a new user

  if (this.gameStarted) {
    throw Error('game already started');
  }
  if (this.players.length === this.gameType.maxNumOfPlayers) {
    throw Error('game room is full');
  }

  var self = this;
  service.User.getPublicProfile(clientProxy.userId, service, clientProxy).then(function (newUserPublicProfile){
    // TODO verify no async modifications
    var newPlayerIdx = this.players.length;
    this.players.push({
      idx: newPlayerIdx,
      readToPlay: false,
      userId: clientProxy.userId,
      clientProxy: clientProxy
    });

    self.playerProfiles.push(newUserPublicProfile);

    // notify other players
    for (var i = 0; i < newPlayerIdx; i++) {
      self.players[i].clientProxy.notifyPlayerAdded({
        playerIdx: newPlayerIdx,
        playerProfile: newUserPublicProfile
      });
    }

    // notify the new player
    clientProxy.onGameRoomChange(this.getPlayerView(newPlayerIdx));
  });
};

GameRoom.prototype.notifyGameRoomChange = function() {
  for (var i = 0, l = this.players.length; i < l; i++) {
    this.players[i].clientProxy.onGameRoomChange(this.getPlayerView(i));
  }
};

GameRoom.prototype.notifyGameStateChange = function(changeSet) {
  for (var i = 0, l = this.players.length; i < l; i++) {
    this.players[i].clientProxy.onGameStateChange(changeSet.getPlayerView(i));
  }
};

GameRoom.prototype.readyToPlay = function (service, clientProxy) {
  var player = this.getPlayer(clientProxy);

  if (player == null) {
    throw Error('the requesting client is not a player of this game');
  }

  if (this.gameStarted) {
    throw Error('game already started');
  }

  player.readToPlay = true;

  var numOfPlayers = this.players.length;
  if (numOfPlayers >= this.gameType.minNumOfPlayers) {
    for (var i = 0; i < numOfPlayers; i++) {
      if (!this.players[i].readToPlay) {
        return;
      }
    }
    // all players are ready and we passed the min num of players -> start game
    this.gameMaster = this.gameType.Game.createInstance({players: {length: numOfPlayers}});
  }

  this.notifyGameRoomChange();
};

GameRoom.prototype.performAction = function (actionKeyPath, service, clientProxy) {
  var player = this.getPlayer(clientProxy);

  if (player == null) {
    throw Error('the requesting client is not a player of this game');
  }

  if (!this.gameStarted) {
    throw Error('game not started');
  }

  this.notifyGameStateChange(this.gameMaster.performAction(actionKeyPath));
};

function InMemGameRoomStore() {
  this.gameRooms = [];
}

InMemGameRoomStore.prototype.create = function(gameTypeId, service, clientProxy) {
  var self = this;

  service.GameType.get(gameTypeId, service, clientProxy).then(function(gameType) {
    var newGameRoomId = self.gameRooms.length;
    var newGameRoom = new GameRoom(newGameRoomId, gameType);

    self.gameRooms.push(newGameRoom);

    newGameRoom.join(service, clientProxy);
  });
};

InMemGameRoomStore.prototype.join = function(gameRoomId, service, clientProxy) {
  this.gameRooms[gameRoomId].join(service, clientProxy);
};

InMemGameRoomStore.prototype.readyToPlay = function(gameRoomId, service, clientProxy) {
  this.gameRooms[gameRoomId].readyToPlay(service, clientProxy);
};

InMemGameRoomStore.prototype.performAction = function(params, service, clientProxy) {
  this.gameRooms[params.gameRoomId].performAction(params.actionKeyPath, service, clientProxy);
};

module.exports = function () {
  return new InMemGameRoomStore();
};
