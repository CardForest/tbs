'use strict';

module.exports = {
  get: function (out, roomId) {
    return {
      rootPropertyName: 'game',
      isChangeAllowed: false,
      onMutatorCall: function (keyPath, params, mutator) {
        out.send('gameRooms', 'gameMutatorCall', {
          gameRoomId: roomId,
          keyPath: keyPath,
          params: params
        });
      },
    };
  }
};
