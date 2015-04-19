'use strict';

function NoOpTransport() {}

NoOpTransport.prototype.setService = function (service) {
  this.service = service;
};

NoOpTransport.prototype.connect = function (client) {
  var service = this.service;
  var res = {};
  Object.keys(service.exports).forEach(function (methodName) {
    res[methodName] = function(params) {
      service.exports[methodName](params, service, client.exports);
    };
  });
  return res;
};

module.exports = NoOpTransport;
