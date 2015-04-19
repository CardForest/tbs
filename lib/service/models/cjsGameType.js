'use strict';

// CommonJS based game type store

var path = require('path');
var requireDir = require('require-dir');

var Promise = require("bluebird");
function GameTypeStore(baseGameTypeDir) {
  this.baseGameTypeDir = baseGameTypeDir;
}

GameTypeStore.prototype.getAll = function () {
  return Promise.resolve(requireDir(baseGameTypeDir));
};
GameTypeStore.prototype.get = function (gameTypeId) {
  return Promise.resolve(require(path.join(baseGameTypeDir, gameTypeId)));
};

module.exports = GameTypeStore;
