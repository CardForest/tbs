'use strict';

var M = require('master-class');

function shuffle( array ){
  var count = array.length,
    rand,
    temp;
  while( count ){
    rand = Math.random() * count-- | 0;
    temp = array[count];
    array[count] = array[rand];
    array[rand] = temp;
  }
}

module.exports = {
  numOfPlayers: 4,
  MasterClass: M({
    props: {
      players: M.Array({
        defaultLength: 2,
        elem: M.Object({
          props: {
            cards: M.Array({
              defaultLength: 26,
              elem:  M.Number(),
              scope: 'player'
            }),
            down: M.Number()
          }
        })
      }),
      onStart: M.Mutator(function () {
        var i, deck = [];
        for (i = 0; i < 52; i++) {
         deck.push(i);
        }
        shuffle(deck);
        for (i = 0; i < 26; i++) {
          this.players[0].cards[i] = deck[i];
          this.players[1].cards[i] = deck[i + 26];
        }
      }),
    }
  })
};

