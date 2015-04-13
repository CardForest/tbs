'use strict';

var assert = require('assert');
var sinon = require('sinon');

var immediateTransport = require('../../lib/transports/immediate')();

describe('immediate transport', function () {
  it('can call server via proxy', function () {
    var spy = sinon.spy();
    immediateTransport.setService({
      exports: {
        callSpy: spy
      }
    });

    immediateTransport.getServiceProxy().callSpy();

    assert(spy.calledOnce);
  });
});
