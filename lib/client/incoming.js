'use strict';

/**
 * Locally handles commands requested by {@link TbsService} via a {@link TbsClientProxy}
 * @class
 */
function ClientIncoming(client) {
 this.client = client;
}

ClientIncoming.prototype.addGameRoomMember = function(newMemberIdx, member) {
  this.client.room.members[newMemberIdx] = member;
};

ClientIncoming.prototype.gameStarted = function(game) {
  this.client.room.game = game;
  this.client.emit('gameStarted');
};



module.exports = ClientIncoming;
