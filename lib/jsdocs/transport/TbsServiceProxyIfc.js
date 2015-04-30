/**
 * Interface for {@link TbsService} parts that are exposed to {@link TbsClient clients}
 *
 * @interface TbsServiceProxy
 */

/**
 * Relays to {@link GameRoomService#createGameRoom}
 *
 * @method
 * @name TbsServiceProxy#createGameRoom
 * @param {!String} gameTypeId
 * @returns {external:Promise.<GameRoomProxy>}
 */

/**
 * Relays to {@link GameRoomService#joinGameRoom}
 *
 * @method
 * @name TbsServiceProxy#joinGameRoom
 * @param {!String} gameRoomId
 * @returns {external:Promise.<GameRoomProxy>}
 */

/**
 * Relays to {@link GameRoomService#readyToPlay}
 *
 * @method
 * @name TbsServiceProxy#readyToPlay
 */

/**
 * Relays to {@link GameRoomService#performGameAction}
 *
 * @method
 * @name TbsServiceProxy#performGameAction
 * @param {!Array<String|number>|String|number} actionId
 * @param {...*} actionParams
 */
