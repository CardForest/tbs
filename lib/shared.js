'use strict';

/**
 * @namespace Shared
 */

/**
 * Enum for game room status
 *
 * @memberof Shared
 * @readonly
 * @enum {String}
 */
var GameRoomStatus = {
  NOT_STARTED: 'not started',
  IN_PROGRESS: 'in progress',
  ENDED: 'ended'
};

module.exports = {
  GameRoomStatus: GameRoomStatus
};
