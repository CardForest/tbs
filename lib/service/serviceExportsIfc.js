/**
 * Interface for {@link Service} parts that are exposed to {@link Client clients}
 *
 * @interface ServiceExports
 */

/**
 * Creates a new room for a given {@link GameType game type}
 *
 * @method
 * @name ServiceExports#createGameRoom
 * @param {String} gameTypeId
 *
 * @returns {external:Promise.<GameRoom>}
 */

/**
 * Join an existing {@link GameRoom room}
 *
 * @method
 * @name ServiceExports#joinGameRoom
 * @param {String} gameRoomId
 *
 * @returns {external:Promise.<GameRoom>}
 */

/**
 * Mark that this client as 'ready to play'
 *
 * Assumes this connection owned by a player in pre-started game
 *
 * @method
 * @name ServiceExports#readyToPlay
 *
 */

/**
 * Perform an action on the connected {@link Game}
 *
 * Assumes this connection owned by a player in started game
 *
 * @method
 * @name ServiceExports#performGameAction
 * @param {Array<String|number>|String|number} actionId
 * @param {...*} actionParams
 */
