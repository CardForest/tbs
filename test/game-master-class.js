"use strict";

var M = require('master-class');

var Game = M({
  props: {
    currentPlayer: M.Ref(),
    players: M.Array({
      elem: M.Object({
        props: {
          makeMove: M.Mutator({
            guard: function () {
              return this === this.root.currentPlayer;
            },
            fn: function () {
              console.log("I\'m here with player " + this.idx);

              this.endTurn();
              if (this.idx === 0)
                throw 'x';
              return 'xx'
            }
          }),
          idx: M.Getter(function () {
            return this.keyPath[1];
          }),
          next: M.Getter(function () {
            return this.root.players[(this.root.currentPlayer.idx + 1) % this.root.players.length];
          }),
          endTurn: M.Mutator(function (){
            this.root.currentPlayer = this.next;
          })
        }
      })
    }),
    onStart: M.Mutator(function() {
      this.currentPlayer = this.players[0];
    })
  }
});

var game = Game.createInstance({players: {length: 3}});

game.onStart();

console.log(game.currentPlayer.idx);
try {
  game.players[0].makeMove();
} catch (e) {
  console.log(e);
}

console.log(game.currentPlayer.idx);
game.players[1].makeMove();

console.log(game.currentPlayer.idx);
console.log(game.players[2].makeMove());


console.log(game.players[0].makeMove.guard + ' - ' + game.players[1].makeMove.guard + ' - ' + game.players[2].makeMove.guard);
