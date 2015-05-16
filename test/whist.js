'use strict';

var path = require('path');
var M = require('master-class');

function shuffle(array) {
  var count = array.length,
    rand,
    temp;
  while (count) {
    rand = Math.random() * count-- | 0;
    temp = array[count];
    array[count] = array[rand];
    array[rand] = temp;
  }
}

module.exports = {
  id: 'whist',//path.basename(__filename, '.js'),
  numOfPlayers: 2,
  MasterClass: M({
    props: {
      currentPlayerIdx: M.Number(),
      players: M.Array({
        defaultLength: 2,
        elem: M.Object({
          props: {
            cards: M.Array({
              defaultLength: 13,
              elem: M.Number({scope: 'player'})
            }),
            down: M.Number({initialValue: -1})
          }
        })
      }),
      putDownCard: M.Mutator({
        fn: function (requesterIdx, cardIdx) {
          this.players[requesterIdx].down = this.players[requesterIdx].cards[cardIdx];
          this.players[requesterIdx].cards[cardIdx] = -1;
        }
      }),
      onStart: M.Mutator({
        fn: function () {
          var i, deck = [];
          for (i = 0; i < 52; i++) {
            deck.push(i);
          }
          shuffle(deck);
          for (i = 0; i < 13; i++) {
            this.players[0].cards[i] = deck[i];
            this.players[1].cards[i] = deck[i + 13];
            //this.players[2].cards[i] = deck[i + 26];
            //this.players[3].cards[i] = deck[i + 39];
          }
        }
      }),
    }
  })
};

