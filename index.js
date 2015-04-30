'use strict';
module.exports = {
  Client: require('./lib/client'),
  DirectTransport: require('./lib/transport/directTransport'),
  Service: require('./lib/service'),
  inMem: {
    GameRoomService: require('./lib/service/inMem/gameRoomService'),
    GameTypeService: require('./lib/service/inMem/gameTypeService'),
    UserService: require('./lib/service/inMem/userService'),
  }
};
