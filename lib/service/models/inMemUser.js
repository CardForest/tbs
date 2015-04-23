'use strict';

var Promise = require("bluebird");

function User(id, publicProfile) {
  this.id = id;
  this.publicProfile = publicProfile;
}

function InMemUserStore() {
  this.users = [];
}

InMemUserStore.prototype.create = function(publicProfile) {
  var newUser = new User(this.users.length, publicProfile);
  this.users.push(newUser);

  return Promise.resolve(newUser.id);
};

InMemUserStore.prototype.getPublicProfile = function(credentials) {
  if (credentials.transient) {
    return Promise.resolve({
      displayName: 'transient ' + credentials.userId
    });
  }
  return Promise.resolve(this.users[credentials.userId].publicProfile);
};

module.exports = InMemUserStore;
