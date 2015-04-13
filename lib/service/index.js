'use strict';

function Service(transport) {
  transport.setService(this);
}

Service.prototype.exports = {
  hello: function () {
    console.log('hello');
  }
};

module.exports = function(transport) {
  return new Service(transport);
};
