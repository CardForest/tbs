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
  if (client.credentials.transient) {
    return Promise.resolve({
      displayName: 'transient ' + client.credentials.userId
    });
  }
  return Promise.resolve(this.users[client.credentials.userId].publicProfile);
};

module.exports = InMemUserService;
