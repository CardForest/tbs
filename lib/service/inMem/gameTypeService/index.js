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
  return Promise.resolve(this.gameTypes[gameTypeId]);
};

module.exports = InMemGameTypeService;
