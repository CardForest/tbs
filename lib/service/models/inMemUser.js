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

InMemUserStore.prototype.getPublicProfile = function(userId) {
  return Promise.resolve(this.users[userId].publicProfile);
};

module.exports = InMemUserStore;
