'use strict';

function ImmediateTransport() {}

ImmediateTransport.prototype.setService = function (service) {
  this.service = service;
};

ImmediateTransport.prototype.connect = function (client) {
  var service = this.service;
  var res = {};
  Object.keys(service.exports).forEach(function (methodName) {
    res[methodName] = function(params) {
      service.exports[methodName](params, service, client.exports);
    };
  });
  return res;
};

module.exports = function () {
  return new ImmediateTransport();
};
