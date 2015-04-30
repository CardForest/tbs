/**
 * Interface for {@link Client} parts that can be called from a {@link Service}
 *
 * @interface ClientExports
 */

/**
 * Sets the client's {@link GameRoom room}
 *
 * @method
 * @name ClientExports#setGameRoom
 * @param {GameRoom} room
 *
 */

/**
 * Locally adds a new member to this client's {@link GameRoom room}
 *
 * @method
 * @name ClientExports#addGameRoomMember
 * @param {number} memberIdx
 * @param {Member} member
 *
 */

/**
 * Locally mark that a member of this client's {@link GameRoom room} is ready to play
 *
 * @method
 * @name ClientExports#memberReadyToPlay
 * @param {number} memberIdx
 */

/**
 * Locally initialize a newly started {@link Game game}
 *
 * @method
 * @name ClientExports#gameStarted
 * @param {Game} game
 */

/**
 * Locally finalize a this client's {@link Game game}
 *
 * @method
 * @name ClientExports#gameOver
 * @param {GameOver} gameOver
 */

/**
 * Locally apply {@link ChangeSet changes} to this client's {@link Game game}
 *
 * @method
 * @name ClientExports#applyChangeSet
 * @param {ChangeSet} changeset
 */

/**
 * Identifies this client's user
 *
 * @type {Object}
 * @name ClientExports#credentials
 */

/**
 * Identifies the current {@link GameRoom}
 *
 * @type {?String}
 * @name ClientExports#gameRoomId
 */
