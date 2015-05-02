var TransportService = require('./transportService');

var http = require('http');
var server = http.createServer();
server.listen(9001);

var tbs = {
  Service: require('../../service'),
  inMem: {
    GameRoomService: require('../../service/inMem/gameRoomService'),
    GameTypeService: require('../../service/inMem/gameTypeService'),
    UserService: require('../../service/inMem/userService'),
  }
};

new tbs.Service(
  new tbs.inMem.GameRoomService(),
  new tbs.inMem.GameTypeService({whist: require('../../../test/whist')}),
  new tbs.inMem.UserService({
    amit: {
      publicProfile: {
        displayName: 'Amit P'
      }
    },
    noa: {
      publicProfile: {
        displayName: 'Noa P'
      }
    }
  }),
  new TransportService(server)
);
