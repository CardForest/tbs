
var tbs = {
  Service: require('./index'),
  inMem: {
    GameRoomService: require('./inMem/gameRoomService'),
    GameTypeService: require('./inMem/gameTypeService'),
    UserService: require('./inMem/userService'),
  },
  TransportService: require('../transport/primus/transportService')
};

module.exports = function (webServer) {
  new tbs.Service(
    new tbs.inMem.GameRoomService(),
    new tbs.inMem.GameTypeService({whist: require('../../test/whist')}),
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
    new tbs.TransportService(webServer)
  );
  console.log('basic launcher setup');
};
