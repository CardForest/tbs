'use strict';

module.exports = {
  snapshotMapper: function (playerIdx) {
    return function (opt, instance, keyPath, snapshotFn) {
      if (opt.hasOwnProperty('scope')) {
        if (opt.scope === 'player') {
          if (keyPath.length < 2 || keyPath[0] !== 'players') {
            throw Error('the \'player\' scope must be used inside of the \'players\' array');
          } else if (keyPath[1] !== playerIdx) {
            return '$hidden';
          }
        } else {
          // (master scope)
          return '$hidden';
        }
      }

      return snapshotFn();
    };
  }
};
