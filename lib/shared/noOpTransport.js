'use strict';

function ImmediateTransport() {

}

ImmediateTransport.prototype.setService = function (service) {
  this.service = service;
};

ImmediateTransport.prototype.connect = function (client) {
  this.service.onConnection(client.exports);

  return this.service.exports;
};

module.exports = function () {
  return new ImmediateTransport();
};
