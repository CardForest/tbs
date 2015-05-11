"use strict";

module.exports = function endGame(status) {
  throw {
    type: 'EndGame',
    status: status || 'Game Ended'
  };
};
