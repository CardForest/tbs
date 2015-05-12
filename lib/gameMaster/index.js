'use strict';

var M = require('master-class');
var controlFactory = require('./controlFactory');
var endGame = require('./endGame');

function GameMaster(opt) {
  opt.player.idx = M.Getter(function () {
    return this.keyPath[1];
  });
  opt.player.boundary = M.Mutator(function () {
    this.game.playersBoundary.setPlayerReached(this.idx);
  });

  var playersArrOpt = {
    elem: M.Object({
      props: opt.player
    })
  };
  if (opt.hasOwnProperty('numOfPlayers')) {
    this.numOfPlayers = playersArrOpt.defaultLength = opt.numOfPlayers;
  }

  this.masterClassOpt = {
    props: {
      playersBoundary: M.Object({
        props: {
          playersReached: M.Array({
            defaultLength: 4, // TODO
            elem: M.Boolean()
          }),
          reset: M.Mutator(function () {
            for (var i = 0, l = this.playersReached.length; i < l; i++) {
              this.playersReached[i] = false;
            }
          }),
          setPlayerReached: M.Mutator(function (playerIdx) {
            this.playersReached[playerIdx] = true;
            console.log('players reached: ' + this.playersReached.join(','));
            for (var i = 0, l = this.playersReached.length; i < l; i++) {
              if (!this.playersReached[i]) {
                return;
              }
            }
            this.onBoundary();
          }),
          onBoundary: M.Mutator(function () {
            console.log('yeah!');
            this.reset();
          }),
        }
      }),
      currentPlayer: M.Ref(),
      players: M.Array(playersArrOpt),
      end: M.Mutator(endGame),
      nextTurnCW: M.Mutator(function () {
        this.game.currentPlayer = this.game.players[(this.game.currentPlayer.idx + 1) % this.game.players.length];
      }),
      nextTurnCCW: M.Mutator(function () {
        this.game.currentPlayer = this.game.players[(this.game.currentPlayer.idx === 0) ? this.game.players.length - 1 : this.game.currentPlayer.idx - 1];
      })
    }
  };

  this.onStart = opt.onStart;
}

GameMaster.prototype.start = function (numOfPlayers) {
  if (numOfPlayers != null) {
    if (this.hasOwnProperty('numOfPlayers')) {
      throw Error('can\'t reinitialize \'numOfPlayer\'');
    }
    this.numOfPlayers = numOfPlayers;
  } else if (!this.hasOwnProperty('numOfPlayers')) {
    throw Error('\'numOfPlayer\' must be initialized');
  }

  this.load({players: {length: this.numOfPlayers}});

  return this.performGameAction(this.onStart, this.game, []);
};

GameMaster.prototype.load = function (value) {
  this.control = controlFactory.get(value.players.length);
  this.game = M(this.masterClassOpt).createInstance(value, this.control);

  this.game.currentPlayer = this.game.players[0];
};

GameMaster.prototype.performGameAction = function (fn, trg, params) {
  this.control.startChangeLog();

  var changeSetPerPlayer;
  try {
    fn.apply(trg, params);
    // FUTURE if needed, consider bubbling up 'fn' the return value instead of silencing it here
  } catch (e) {
    // we consider break throws as a valid game flow interrupt
    if (e.type === 'EndGame') {
      this.endStatus = e.status;
    } else {
      throw e;
    }
  } finally {
    // we make sure 'getAndClearChangeLog' is always called
    changeSetPerPlayer = this.control.getAndClearChangeLog();
  }

  return changeSetPerPlayer;
};

GameMaster.prototype.performPlayerMove = function (playerIdx, moveName, params) {
  var trg = this.game.players[playerIdx];
  return this.performGameAction(trg[moveName], trg, params);
};

module.exports = GameMaster;

var master = new GameMaster(
  {
    player: {
      cards: M.Array({
        defaultLength: 13,
        elem: M.Number({scope: 'player', initialValue: -1})
      }),
      down: M.Number({initialValue: -1}),
      makeMove: M.Mutator({
        guard: function () {
          return this === this.game.currentPlayer;
        },
        fn: function () {
          console.log("I\'m here with player " + this.idx);
          //
          //if (this.idx === 1) {
          //  this.cards[2] = 312;
          //  this.game.end('nice ending!');
          //}
          this.game.nextTurnCCW();
          this.boundary();
        }
      })
    },
    numOfPlayers: 4,
    onStart: function () {
      this.players[1].cards[0] = 2;
      console.log('on start ' + this.players[1].cards);
    }
  }
);

master.start();
master.performPlayerMove(0, 'makeMove')
master.performPlayerMove(3, 'makeMove')
master.performPlayerMove(2, 'makeMove')
master.performPlayerMove(1, 'makeMove')
//console.log(master.performPlayerMove(0, 'makeMove'));
//console.log(master.performPlayerMove(3, 'makeMove'));
//console.log(master.performPlayerMove(2, 'makeMove'));
//
//console.log(master.endStatus);
////console.log(x[1][0].payload)
