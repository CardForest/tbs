'use strict';

var M = require('master-class');
var controlFactory = require('./controlFactory');

function GamePlayer(opt) {
  var playersArrOpt = {
    elem: M.Object({
      props: opt.player
    })
  };

  this.masterClassOpt = {
    props: {
      currentPlayer: M.Ref(),
      players: M.Array(playersArrOpt)
    }
  };
}

GamePlayer.prototype.load = function (value, out, roomId) {
  this.control = controlFactory.get(out, roomId);
  this.game = M(this.masterClassOpt).createInstance(value, this.control);
};

module.exports = GamePlayer;
