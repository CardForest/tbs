'use strict';

function Service(transport, GameRoom, GameType, User) {
  this.exports = {
    // game type API
    getAllGameTypes: GameType.getAll.bind(GameType),

    // game room API
    createGameRoom: GameRoom.create.bind(GameRoom),
    joinGameRoom: GameRoom.join.bind(GameRoom),
    readyToPlay: GameRoom.readyToPlay.bind(GameRoom),
    performGameAction: GameRoom.performAction.bind(GameRoom)
  };

  this.tansport = transport;
  this.GameRoom = GameRoom;
  this.GameType = GameType;
  this.User = User;

  transport.setService(this);
}

module.exports = function(transport) {
  return new Service(transport);
};
