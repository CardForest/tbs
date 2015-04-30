'use strict';

var forOwn = require('lodash.forown');

/**
 * @lends Client.prototype
 */
var clientExports = {
  setGameRoom: function(room) {
    this.room = room;
    this.gameRoomId = room.id;
    this.member = room.members[room.memberIdx];
  },

  addGameRoomMember: function(newMemberIdx, member) {
    this.room.members[newMemberIdx] = member;
  },

  memberReadyToPlay: function(memberIdx) {
    this.room.members[memberIdx].readyToPlay = true;
  },

  gameStarted: function(game) {
    this.room.gameStarted = true;
    this.room.game = game;
  },

  gameOver: function(gameOver) {
    this.room.gameOver = gameOver;
  },

  applyChangeSet: function(changeSet) {
    for (var i = 0, l = changeSet.length; i < l; i++) {
      var change = changeSet[i];

      this[change.type].apply(this, change.payload);
    }
  }
};

// wrap each exported method with an event emission
forOwn(clientExports, function(value, key) {
  clientExports[key] = function () {
    var argsArray = Array.prototype.slice.call(arguments, 0);

    this.emit.apply(this, ['before_' + key].concat(argsArray));

    value.apply(this, arguments);

    this.emit.apply(this, ['after_' + key].concat(argsArray));
  };
});

module.exports = clientExports;

