'use strict';

var Primus = require('primus');

function PrimusTransportService(webServer) {
  this.webServer = webServer;
}

PrimusTransportService.prototype.setService = function (tbsService) {
  var primus = new Primus(this.webServer, {
    transformer: 'websockets',
    authorization: function (req, done) {
      if (req.query.ticket) {
        // TODO real decoding
        req.userId = req.query.ticket;
        return done();
      }

      done({
        message: 'Authentication required',
        authenticate: 'Bearer'
      });
    }
  });

  primus.on('connection', function connection(spark) {
    console.log('+ got new connection from ' + spark.request.userId + ' (spark.id = ' + spark.id + ')');
    spark.on('end', function () {
      console.log('- ended connection from ' + spark.request.userId + ' (spark.id = ' + spark.id + ')');
    });

    var clientProxy = {
      userId: spark.request.userId,
      send: function(msgType, payload) {
        spark.write({
          type: msgType,
          payload: payload
        });
      },
    };

    spark.on('data', function(msg) {
      try {
        if ( msg.api === 'gameRooms') {
          var api = tbsService[msg.api];
          if (msg.type in api) {
            api[msg.type](clientProxy, msg.payload);
            return;
          }
        }

        var errMsg = 'server got unknown message: ' + JSON.stringify(msg);
        console.error(errMsg);
        spark.write({
          type: 'error',
          errMsg: errMsg
        });

      } catch (e) {
        console.error((e.hasOwnProperty('stack')) ? e.stack : e);
        spark.write({
          type: 'error',
          errMsg: 'server error'
        });
      }
    });
  });
};

module.exports = PrimusTransportService;
