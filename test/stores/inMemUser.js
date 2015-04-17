'use strict';

var assert = require('assert');

var userStore = require('../../lib/service/stores/inMemUser')();

describe('in memory based user store', function () {
  it('can create users and retrieve their profile by id game types by id', function (done) {
    var myPublicProfile = {displayName: 'I-AM'};
    userStore.create(myPublicProfile).then(function (userId) {
      userStore.getPublicProfile(userId).then(function (publicProfile) {
        assert.equal(publicProfile, myPublicProfile);
        done();
      });
    });
  });
});
