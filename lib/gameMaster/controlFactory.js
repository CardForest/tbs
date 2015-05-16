'use strict';

module.exports = {
  get: function (numOfPlayers) {
    return {
      rootPropertyName: 'game',
      changeSetPerPlayer: null,
      startChangeLog: function () {
        this.changeSetPerPlayer = Array(numOfPlayers);
        // ES use Array.prototype.fill when available
        for (var i = 0; i < numOfPlayers; i++) {
          this.changeSetPerPlayer[i] = [];
        }
      },
      getAndClearChangeLog: function () {
        var changeSetPerPlayer = this.changeSetPerPlayer;
        // clear ref to allow for garbage collection
        this.changeSetPerPlayer = null;

        return changeSetPerPlayer;
      },
      onChange: function (type, payload, factoryOption) {
        if (this.changeSetPerPlayer != null) {
          var change = {type: type, payload: payload};
          if (type === 'setValue') {
            if (factoryOption.scope === 'player') {
              this.changeSetPerPlayer[payload.trgKeyPath[1]].push(change);
            } else if (factoryOption.scope !== 'master') {
              for (var i = 0; i < numOfPlayers; i++) {
                this.changeSetPerPlayer[i].push(change);
              }
            }
          }
        }
      }
    };
  }
};
