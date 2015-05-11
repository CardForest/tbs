'use strict';

module.export = {
  snapshotMapper: function (playerIdx) {
    return function (opt, instance, keyPath, snapshotFn) {
      if (opt.scope === 'player') {
        if (keyPath.length < 2 || keyPath[0] !== 'players') {
          throw Error('the \'player\' scope must be used inside of the \'players\' array');
        } else {
          if (keyPath[1] !== playerIdx) {
            return '$hidden';
          }
        }
      } else if (!opt.hasOwnProperty('scope')) {
        return snapshotFn();
      } else {
        // master scope
        return '$hidden';
      }
    };
  }
};
