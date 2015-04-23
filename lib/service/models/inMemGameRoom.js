'use strict';

var Promise = require("bluebird");

/**
 *
 * @param id
 * @param {GameType} gameType
 * @class
 */
function GameRoom(id, gameType) {
  this.id = id;
  this.gameType = gameType;

  this.members = [];

  this.gameStarted = false;
}

GameRoom.prototype.getMemberView = function (memberIdx) {
  var membersView = [];
  for (var i = 0, l = this.members.length; i < l; i++) {
    var member = this.members[i];
    if (member) {
      membersView[member.idx] = {
        profile: member.profile,
        readyToPlay: member.readyToPlay
      };
    }
  }


  var gameRoomMemberView = {
    id: this.id,
    gameTypeId: this.gameType.id,
    members: membersView,
    gameStarted: this.gameStarted,
    memberIdx: memberIdx
  };

  if (this.gameStarted) {
    gameRoomMemberView.game = this.game.getMemberView(memberIdx);
  }

  return gameRoomMemberView;
};


GameRoom.prototype.getMember = function (clientProxy) {
  for (var i = 0, l = this.members.length; i < l; i++) {
    var member = this.members[i];

    if (member && member.userId === clientProxy.credentials.userId) {
      // this user is part of the game

      // make sure we have the latest clientProxy
      member.clientProxy = clientProxy;

      return member;
    }
  }
};

GameRoom.prototype.join = function (service, clientProxy) {
  var member = this.getMember(clientProxy);

  if (member != null) {
    return Promise.resolve(this.getMemberView(member.idx));
  }

  // this is a new user

  if (this.gameStarted) {
    throw Error('game already started');
  }
  if (this.members.length === this.gameType.maxNumOfPlayers) {
    // TODO distinguish between members and players
    throw Error('game room is full');
  }

  var self = this;
  return service.User.getPublicProfile(clientProxy.credentials, service, clientProxy).then(function (newMemberPublicProfile) {
    // TODO verify no async modifications
    var newMemberIdx = self.members.length;
    self.members.push({
      idx: newMemberIdx,
      readyToPlay: false,
      userId: clientProxy.credentials.userId,
      clientProxy: clientProxy,
      profile: newMemberPublicProfile
    });

    // notify other members
    for (var i = 0; i < newMemberIdx; i++) {
      self.members[i].clientProxy.addGameRoomMember(newMemberIdx, {
        profile: newMemberPublicProfile,
        readyToPlay: false
      });
    }

    // notify the new member
    return self.getMemberView(newMemberIdx);
  });
};

//GameRoom.prototype.notifyGameRoomChange = function() {
//  for (var i = 0, l = this.members.length; i < l; i++) {
//    this.members[i].clientProxy.onGameRoomChange(this.getMemberView(i));
//  }
//};
//
//GameRoom.prototype.notifyGameStateChange = function(changeSet) {
//  for (var i = 0, l = this.members.length; i < l; i++) {
//    this.members[i].clientProxy.onChangeSet(changeSet.getMemberView(i));
//  }
//};

GameRoom.prototype.readyToPlay = function (service, clientProxy) {
  var i;
  var member = this.getMember(clientProxy);

  if (member == null) {
    throw Error('the requesting client is not a member of this game');
  }

  if (this.gameStarted) {
    throw Error('game already started');
  }

  member.readyToPlay = true;

  var numOfPlayers = this.members.length;

  // notify members
  for (i = 0; i < numOfPlayers; i++) {
    var oMember = this.members[i];
    if (oMember) {
      oMember.clientProxy.memberReadyToPlay(member.idx);
    }
  }


  if (numOfPlayers >= this.gameType.minNumOfPlayers) {
    // TODO distinguish between members and players
    for (i = 0; i < numOfPlayers; i++) {
      if (!this.members[i].readyToPlay) {
        return;
      }
    }
    // all players are ready and we passed the min num of players -> start game
    this.gameStarted = true;
    this.game = this.gameType.Game.createInstance({players: {length: numOfPlayers}});

    // notify members
    for (i = 0; i < numOfPlayers; i++) {
      var oMember = this.members[i];
      if (oMember) {
        oMember.clientProxy.gameStarted(this.game.getMemberView(oMember.idx));
      }
    }
  }
};

GameRoom.prototype.performAction = function (actionKeyPath, service, clientProxy) {
  console.log('got perform game action!' + actionKeyPath);
  return;
  var member = this.getMember(clientProxy);

  if (member == null) {
    // TODO distinguish between members and players
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

InMemGameRoomStore.prototype.create = function (gameTypeId, service, clientProxy) {
  console.log('creating ' + gameTypeId);
  var self = this;

  return service.GameType.get(gameTypeId, service, clientProxy).then(function (gameType) {
    var newGameRoomId = self.gameRooms.length;
    var newGameRoom = new GameRoom(newGameRoomId, gameType);

    self.gameRooms.push(newGameRoom);

    return newGameRoom.join(service, clientProxy);
  });
};

InMemGameRoomStore.prototype.join = function (gameRoomId, service, clientProxy) {
  return this.gameRooms[gameRoomId].join(service, clientProxy);
};

InMemGameRoomStore.prototype.readyToPlay = function (gameRoomId, service, clientProxy) {
  this.gameRooms[gameRoomId].readyToPlay(service, clientProxy);
};

InMemGameRoomStore.prototype.performAction = function (params, service, clientProxy) {
  this.gameRooms[params.gameRoomId].performAction(params.actionKeyPath, service, clientProxy);
};

module.exports = InMemGameRoomStore;