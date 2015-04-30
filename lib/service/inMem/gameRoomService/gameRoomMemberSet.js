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
  return this.membersByUserId[client.credentials.userId];
};

InMemGameRoomMemberSet.prototype.addMember = function(tbsService, client) {
  var self = this;
  return tbsService.users.getPublicProfile(client).then(function (profile) {
    var userId = client.credentials.userId;

    var idx = self.membersPublicInfo.length;
    var member = {
      client: client,
      publicInfo: {
        readyToPlay: false,
        profile: profile
      }
    };
    self.membersByUserId[userId] = member;

    // notify other members
    for (var i = 0; i < idx; i++) {
      self.members[i].client.addGameRoomMember(idx, member.publicInfo);
    }

    self.members[idx] = member;
    self.membersPublicInfo[idx] = member.publicInfo;

    return idx;
  });
};

InMemGameRoomMemberSet.prototype.readyToPlay = function (client) {
  var member = this.findMember(client);
  if (member == null) {
    throw Error('the requesting client is not a member of this game');
  }
  member.publicInfo.readyToPlay = true;
  // notify members
  //for (var i = 0, l = this.numOfPlayers; i < l; i++) {
  //  this.members[i].client.memberReadyToPlay(member.idx);
  //}
};

InMemGameRoomMemberSet.prototype.getMembersPublicInfo = function() {
  return this.membersPublicInfo;
};

module.exports = InMemGameRoomMemberSet;
