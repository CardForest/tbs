'use strict';

var assert = require('assert');
var sinon = require('sinon');

var noOpTransport = require('../../lib/shared/noOpTransport')();

describe('no-operation transport', function () {
  it('can call client via proxy', function () {
    var serviceSpy = sinon.spy();
    var clientSpy = sinon.spy();
    noOpTransport.setService({
      onConnection: function (clientProxy) {
        clientProxy.callClientSpy();
      },
      exports: {
        callServiceSpy: serviceSpy
      }
    });

    var serviceProxy = noOpTransport.connect({
      exports: {
        callClientSpy: clientSpy
      }
    });

    assert(clientSpy.calledOnce);

    serviceProxy.callServiceSpy();

    assert(serviceSpy.calledOnce);
  });
});
