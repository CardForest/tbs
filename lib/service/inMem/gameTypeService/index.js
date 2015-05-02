'use strict';

var Promise = require("bluebird");

/**
 * @class
 * @implements GameTypeService
 * @this TbsService
 *
 * @param {Array.<GameType>=}
 */
function InMemGameTypeService(gameTypes) {
  this.gameTypes = gameTypes || {};
}

InMemGameTypeService.prototype.setService = function (service) {
  this.service = service;
};

InMemGameTypeService.prototype.getAll = function (client) {
  return Promise.resolve(this.gameTypes);
};

InMemGameTypeService.prototype.get = function (client, gameTypeId) {
  if (this.gameTypes.hasOwnProperty(gameTypeId)) {
    return Promise.resolve(this.gameTypes[gameTypeId]);
  } else {
    return Promise.reject('could not not find game type \'' + gameTypeId + '\'');
  }
};

module.exports = InMemGameTypeService;
