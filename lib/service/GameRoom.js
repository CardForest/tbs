'use strict';

var Promise = require("bluebird");

/**
 * Manages the lifecycle of a game
 *
 * @param {String} id
 * @param {GameType} gameType
 * @class
 */
function GameRoom(id, gameType) {
  this.id = id;
  this.gameType = gameType;

  this.members = [];

  /** indicates that this room's game started */
  this.gameStarted = false;
}

/**
 * A member specific view of a {@link GameRoom}
 *
 * @typedef {Object} MemberView
 * @memberof GameRoom
 * @property {String} id this room's ID
 * @property {Array<MemberPublicInfo>} members room members' public profile and ready to play status
 * @property {boolean} gameStarted {@link GameRoom#gameStarted}
 * @property {number} memberIdx the index of the member this view was built for
 */

/**
 *
 * @param memberIdx
 * @returns {GameRoom.MemberView}
 */
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
    gameType: this.gameType,
    members: membersView,
    gameStarted: this.gameStarted,
    memberIdx: memberIdx
  };

  if (this.gameStarted) {
    gameRoomMemberView.game = this.game.getMemberView(memberIdx);
  }

  if (this.gameOver) {
    gameRoomMemberView.gameOver = this.gameOver;
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

GameRoom.prototype.performAction = function (actionKeyPath, params, service, clientProxy) {
  var member = this.getMember(clientProxy);

  if (member == null) {
    // TODO distinguish between members and players
    throw Error('the requesting client is not a player of this game');
  }

  if (!this.gameStarted) {
    throw Error('game not started');
  }

  if (this.gameOver) {
    throw Error('game is already over');
  }

  var gameOver = this.game[actionKeyPath[0]].apply(this.game, [member.idx].concat(params));
  if (gameOver) {
    this.gameOver = gameOver;
  }

  for (var i = 0, numOfPlayers = this.members.length; i < numOfPlayers; i++) {
    var oMember = this.members[i];
    if (oMember) {
      oMember.clientProxy.gameStarted(this.game.getMemberView(oMember.idx));
    }
    if (gameOver) {
      oMember.clientProxy.gameOver(gameOver);
    }
  }
};

module.exports = GameRoom;
