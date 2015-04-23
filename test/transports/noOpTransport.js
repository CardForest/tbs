'use strict';

var assert = require('assert');
var sinon = require('sinon');

var noOpTransport = require('.././noOpTransport')();

describe('no-operation transport', function () {
  it('can call client via proxy', function () {
    var serviceSpy = sinon.spy(function(clientProxy) {
      clientProxy.callClientSpy(2);
    });
    var clientSpy = sinon.spy();

    var service = {
      exports: {
        callServiceSpy: serviceSpy
      }
    };
    noOpTransport.setService(service);

    var client = {
      exports: {
        callClientSpy: clientSpy
      }
    };

    noOpTransport.connect(client).callServiceSpy(1);

    assert(serviceSpy.calledOnce);
    assert(serviceSpy.firstCall.calledOn(service));
    assert.deepEqual(serviceSpy.firstCall.args, [client.exports, 1]);

    assert(clientSpy.calledOnce);
    assert.deepEqual(clientSpy.firstCall.args, [2]);
  });
});
