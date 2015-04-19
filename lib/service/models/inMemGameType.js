'use strict';

var Promise = require("bluebird");

function GameTypeStore(gameTypes) {
  this.gameTypes = gameTypes;
}

GameTypeStore.prototype.getAll = function () {
  return Promise.resolve(this.gameTypes);
};

GameTypeStore.prototype.get = function (gameTypeId) {
  return Promise.resolve(this.gameTypes[gameTypeId]);
};

module.exports = GameTypeStore;
