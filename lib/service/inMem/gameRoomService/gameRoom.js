'use strict';

var MemberSet = require('./gameRoomMemberSet');
var GameRoomStatus = require('../../../shared').GameRoomStatus;
var Promise = require("bluebird");

var playerScopeMapper = function (playerIdx) {
  return function (opt, instance, keyPath, snapshotFn) {
    if (opt.scope === 'master') {
      return '$hidden';
    } else if (opt.scope === 'player') {
      if (keyPath.length < 2 || keyPath[0] !== 'players') {
        throw Error('the \'player\' scope must be used inside of the \'players\' array');
      } else {
        if (keyPath[1] !== playerIdx) {
          return '$hidden';
        }
      }
    }
    return snapshotFn();
  };
};

/**
 *
 * @class
 *
 * @param {TbsService}
 * @param {!(String|number)}
 * @param {!GameType}
 */
function InMemGameRoom(service, id, gameType) {
  this.service = service;
  this.id = id;
  this.gameType = gameType;
  this.memberSet = new MemberSet();
  this.status = GameRoomStatus.NOT_STARTED;
}

/**
 *
 * @param memberIdx
 * @returns {{id: *, gameType: *, members, status: *, memberIdx: *}}
 */
InMemGameRoom.prototype.getViewForMember = function (memberIdx) {
  var view = {
    id: this.id,
    gameType: this.gameType,
    members: this.memberSet.getMembersPublicInfo(),
    status: this.status
  };

  if (this.status === GameRoomStatus.IN_PROGRESS) {
    view.game = this.game.snapshot(playerScopeMapper(memberIdx));
  } else if (this.status === GameRoomStatus.ENDED) {
    view.gameEndReport = this.gameEndReport;
  }

  return view;
};

/**
 * @param {client} client
 * @returns {external:Promise.<GameRoomService.GameRoom>}
 */
InMemGameRoom.prototype.join = function (client) {
  var member = this.memberSet.findMember(client);
  if (member) {
    member.client = client;
    return Promise.resolve(this.getViewForMember(member.idx));
  }

  if (this.status !== GameRoomStatus.NOT_STARTED) {
    throw Error('game already started');
  }

  if (this.memberSet.numOfPlayers === this.gameType.maxNumOfPlayers) {
    throw Error('game room is full');
  }

  var self = this;
  return this.memberSet.addMember(this.service, client).then(function (memberIdx) {
    return [self.getViewForMember(memberIdx), memberIdx];
  });
};

/**
 * @param client
 */
InMemGameRoom.prototype.readyToPlay = function (client) {
  if (this.status !== GameRoomStatus.NOT_STARTED) {
    throw Error('game already started');
  }

  this.memberSet.readyToPlay(client);

  var numOfPlayers = this.memberSet.numOfPlayers;
  if (this.gameType.numOfPlayers != null && numOfPlayers === this.gameType.numOfPlayers ||
    numOfPlayers >= this.gameType.minNumOfPlayers) {
    // check if everyone in this room is ready
    for (var i = 0; i < numOfPlayers; i++) {
      if (!this.memberSet.members[i].publicInfo.readyToPlay) {
        return;
      }
    }

    // all players are ready and we passed the min num of players -> start game

    var control = {
      changeSet: [],
      isChangeAllowed: true,
      set: function (cb, newValue, keyPath, key, factoryOptions) {
        if (!this.isChangeAllowed) {
          throw Error('change is not allowed in this context');
        }
        cb();
        this.onChange('setValue', {newValue: newValue, trgKeyPath: keyPath, key: key}, factoryOptions);
      },
      onChange: function (type, payload, factoryOptions) {
        console.log('set ' + payload.newValue + ' to ' + JSON.stringify(payload.trgKeyPath.concat(payload.key)) + ' || scope = ' + factoryOptions.scope);
        this.changeSet.push({
          type: type,
          payload: payload,
          scope: factoryOptions.scope
        });
      },
      getChangeSetViewForMember: function (playerIdx) {
        var change, i, l, res = [];
        for (i = 0, l = this.changeSet.length; i < l; i++) {
          change = this.changeSet[i];
          if (change.type === 'setValue') {
            if (change.scope !== 'master' && (change.scope !== 'player' || change.payload.trgKeyPath[1] === playerIdx)) {
              res.push({type: change.type, payload: change.payload});
            }
          }
        }
        return res;
      }
    };

    this.status = GameRoomStatus.IN_PROGRESS;
    this.game = this.gameType.MasterClass.createInstance({players: {length: numOfPlayers}}, control);
    this.game.onStart();

    // notify members
    for (i = 0; i < numOfPlayers; i++) {
      var oMember = this.memberSet.members[i];
      if (oMember) {
        oMember.client.gameStarted(this.game.snapshot(playerScopeMapper(oMember.idx)));
      }
    }
  }
};

/**
 * @param actionKeyPath
 * @param params
 * @param service
 * @param client
 */
InMemGameRoom.prototype.gameMutatorCall = function (client, actionKeyPath, actionParams) {
  var member = this.memberSet.findMember(client);

  if (member == null) {
    throw Error('the requesting client is not a player of this game');
  }

  if (this.status !== GameRoomStatus.IN_PROGRESS) {
    throw Error('game not in progress');
  }

  this.game.control.changeSet.length = 0;
  var gameEndReport = this.game[actionKeyPath[0]].apply(this.game, [member.idx].concat(actionParams));
  if (gameEndReport) {
    this.status = GameRoomStatus.ENDED;
    this.gameEndReport = gameEndReport;
  }

  for (var i = 0, numOfPlayers = this.memberSet.numOfPlayers; i < numOfPlayers; i++) {
    var oMember = this.memberSet.members[i];
    if (oMember) {
      oMember.client.applyGameChangeSet(this.game.control.getChangeSetViewForMember(oMember.idx));
    }
    if (gameEndReport) {
      oMember.client.gameOver(gameEndReport);
    }
  }
};

module.exports = InMemGameRoom;