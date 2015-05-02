'use strict';

var Promise = require('bluebird');

/**
 *
 * @class
 * @implements UserService
 * @this TbsService
 *
 * @param {Array.<User>=} users
 */
function InMemUserService(users) {
  this.users = users || [];
}

InMemUserService.prototype.setService = function (service) {
  this.service = service;
};

InMemUserService.prototype.getPublicProfile = function(client) {
  if (client.transient) {
    return Promise.resolve({
      displayName: 'transient ' + client.userId
    });
  }
  return Promise.resolve(this.users[client.userId].publicProfile);
};

module.exports = InMemUserService;
