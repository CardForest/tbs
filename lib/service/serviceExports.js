'use strict';

//  // game type API
//  //getAllGameTypes: GameType.getAll.bind(GameType),
//
//  // game room API
//  createGameRoom: GameRoom.create.bind(GameRoom),
//  joinGameRoom: GameRoom.join.bind(GameRoom),
//  readyToPlay: GameRoom.readyToPlay.bind(GameRoom),
//  performGameAction: GameRoom.performAction.bind(GameRoom)

/** @lends Service.prototype */
var serviceExports = {
  /**
   * Called by {@link TransportService} on {@link ServiceExports#createGameRoom} call
   *
   * @method
   * @name ServiceExports#createGameRoom
   * @param {ClientExports} clientProxy
   * @param {String} gameTypeId
   *
   * @returns {external:Promise.<GameRoom>}
   */
  createGameRoom: function(clientProxy, gameTypeId) {
    return this.GameRoom.create(this, clientProxy);
  },

  /**
   * Called by {@link TransportService} on {@link ServiceExports#joinGameRoom} call
   *
   * @method
   * @param {ClientExports} clientProxy
   * @param {String} gameRoomId
   *
   * @returns {external:Promise.<GameRoom>}
   */
  joinGameRoom: function(clientProxy, gameRoomId) {
    return this.GameRoom.join(this, clientProxy, gameRoomId);
  },

  /**
   * Called by {@link TransportService} on {@link ServiceExports#readyToPlay} call
   *
   * @method
   * @param {ClientExports} clientProxy
   */
  readyToPlay: function(clientProxy) {
    this.GameRoom.readyToPlay(this, clientProxy);
  },

  /**
   * Called by {@link TransportService} on {@link ServiceExports#performGameAction} call
   *
   * @method
   * @param {ClientExports} clientProxy
   * @param {Array<String|number>|String|number} actionId
   * @param {...*} actionParams
   */
  performGameAction: function() {
    Array.prototype.unshift.call(arguments, this);
    this.GameRoom.performGameAction.apply(this.GameRoom, arguments);
  }
};

module.exports = serviceExports;

