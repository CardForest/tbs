'use strict';

/**
 * A transport that directly links client to service, without any serialization/networking
 *
 * @class
 * @implements {TransportClient}
 * @implements {TransportService}
 */
function NoOpTransport() {}

NoOpTransport.prototype.setService = function (service) {
  this.service = service;
};

NoOpTransport.prototype.connect = function (client) {
  var service = this.service;
  var res = {};
  Object.keys(service.exports).forEach(function (methodName) {
    res[methodName] = function() {
      return service.exports[methodName](arguments, service, client);
    };
  });
  return res;
};

module.exports = NoOpTransport;
