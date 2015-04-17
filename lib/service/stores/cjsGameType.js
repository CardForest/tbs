'use strict';

// CommonJS based game type store

var path = require('path');
var requireDir = require('require-dir');

var Promise = require("bluebird");

module.exports = function (baseGameTypeDir) {
  return {
    getAll: function () {
      return Promise.resolve(requireDir(baseGameTypeDir));
    },
    get: function (gameTypeId) {
      return Promise.resolve(require(path.join(baseGameTypeDir, gameTypeId)));
    }
  };
};
