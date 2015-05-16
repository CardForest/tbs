'use strict';

var M = require('master-class');

module.exports = {
  id: 'crazyEights',
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
  numOfPlayers: 2,
  onStart: function () {
    var i, deck = [];
    for (i = 0; i < 26; i++) {
      deck.push(i);
    }
    for (i = 0; i < 13; i++) {
      this.players[0].cards[i] = deck[i];
      this.players[1].cards[i] = deck[i + 13];
    }
    console.log('game onStart called!');
  }
};
