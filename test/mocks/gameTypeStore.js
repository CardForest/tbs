'use strict';


function GameTypeStore() {
}

GameTypeStore.prototype.findById = function (gameTypeId) {
  return require('./gameTypes/' + gameTypeId);
};
