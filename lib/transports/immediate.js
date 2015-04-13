'use strict';

function ImmediateTransport() {

}

ImmediateTransport.prototype.setService = function (service) {
  this.service = service;
};

ImmediateTransport.prototype.getServiceProxy = function () {
  return this.service.exports;
};

module.exports = function () {
  return new ImmediateTransport();
};
