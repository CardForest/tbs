/**
 * Interface for managing game rooms
 *
 * @interface GameRoomService
 */

/**
 * Creates a new room of a given game type
 *
 * @method
 * @name GameRoomService#createGameRoom
 * @param {!TbsClientProxy} client
 * @param {!String} gameTypeId
 * @returns {external:Promise.<GameRoomService.GameRoom>}
 */

/**
 * Join an existing game room
 *
 * @method
 * @name GameRoomService#joinGameRoom
 * @param {!TbsClientProxy} client
 * @param {!String} gameRoomId
 * @returns {external:Promise.<GameRoomService.GameRoom>}
 */

/**
 * Mark that this client as 'ready to play'
 *
 * Requires that this connection owned by a player in pre-started game
 *
 * @method
 * @name GameRoomService#readyToPlay
 * @param {!TbsClientProxy} client
 */

/**
 * Perform an action on the connected game
 *
 * Requires that this connection owned by a player in started game
 *
 * @method
 * @name GameRoomService#performGameAction
 * @param {!TbsClientProxy} clientProxy
 * @param {!Array<String|number>|String|number} actionId
 * @param {...*} actionParams
 */

/**
 * @typedef {Object} GameRoomService.Member
 * @property {ClientProxy} clientProxy
 * @property {GameRoomService.MemberPublicInfo} publicInfo
 */

/**
 * @typedef {Object} GameRoomService.MemberPublicInfo
 * @property {boolean} readyToPlay
 * @property {UserService.PublicProfile} profile
 */

/**
 * @typedef {Object} GameRoomService.GameRoom
 * @property {(String|number)} id
 * @property {Array.<object>} members
 * @property {GameTypeService.GameType} gameType
 * @property {Shared.GameRoomStatus} status
 */

