'use strict';

/**
 * @class
 */
function InMemGameRoomMemberSet() {
  /**
   * Inner member list
   * @type {Array.<GameRoomService.Member>}
   */
  this.members = [];
  /**
   * References to members' public info
   * @type {Array.<GameRoomService.MemberPublicInfo>}
   */
  this.membersPublicInfo = [];
  /**
   * Maps from user Ids to members
   * @type {object}
   */
  this.membersByUserId = {};
}

Object.defineProperty(InMemGameRoomMemberSet.prototype, 'numOfPlayers', {
  get: function() {return this.membersPublicInfo.length;}
});

InMemGameRoomMemberSet.prototype.findMember = function(client) {
  return this.membersByUserId[client.userId];
};

InMemGameRoomMemberSet.prototype.addMember = function(tbsService, client) {
  var self = this;
  return tbsService.users.getPublicProfile(client).then(function (profile) {
    var userId = client.userId;

    var idx = self.membersPublicInfo.length;
    var member = {
      idx: idx,
      client: client,
      publicInfo: {
        readyToPlay: false,
        profile: profile
      }
    };
    self.membersByUserId[userId] = member;

    // notify other members
    for (var i = 0; i < idx; i++) {
      self.members[i].client.send('memberAdded', {
        newMemberIdx: idx,
        member: member.publicInfo
      });
    }

    self.members[idx] = member;
    self.membersPublicInfo[idx] = member.publicInfo;

    return idx;
  });
};

InMemGameRoomMemberSet.prototype.removeMember = function(tbsService, userId) {
  var idx = this.membersByUserId[userId].idx;
  console.log('removing ' + userId + ' with idx ' + idx);
  this.members.splice(idx, 1);
  this.membersPublicInfo.splice(idx, 1);
  delete this.membersByUserId[userId];

  // notify other members
  for (var i = 0, l = this.numOfPlayers; i < l; i++) {
    var member = this.members[i];
    member.idx = i;
    member.client.send('memberRemoved', {
      memberIdx: idx
    });
  }
};


InMemGameRoomMemberSet.prototype.readyToPlay = function (client) {
  var member = this.findMember(client);
  if (member == null) {
    throw Error('the requesting client is not a member of this game');
  }
  member.publicInfo.readyToPlay = true;
  // notify members
  for (var i = 0, l = this.numOfPlayers; i < l; i++) {
    this.members[i].client.send('memberReadyToPlay', {
      memberIdx: member.idx
    });
  }
};

InMemGameRoomMemberSet.prototype.getMembersPublicInfo = function() {
  return this.membersPublicInfo;
};

module.exports = InMemGameRoomMemberSet;
