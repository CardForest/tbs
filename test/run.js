'use strict';

var express = require('express');
var http = require('http');
var basicLauncher = require('../lib/service/basicLauncher');

function Runner(cb) {
  var app = express();

  app.use(express.static(__dirname + '/../dist'));
  app.use('bower_components', express.static(__dirname + '/../bower_components'));


  var server = http.createServer(app);
  server.listen(9001, cb);

  basicLauncher(server);

  this.server = server;
}

Runner.prototype.close = function(cb) {
  this.server.close(cb);
};

module.exports = Runner;
