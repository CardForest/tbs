'use strict';

// CommonJS based game type store

var path = require('path');

module.exports = function (baseGameTypeDir) {
  return {
    findById: function (gameTypeId) {
      return require(path.join('.', baseGameTypeDir, gameTypeId));
    }
  };
};
