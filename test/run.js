'use strict';

var express = require('express');
var http = require('http');

var app = express();

app.use(express.static(__dirname + '/../dist'));
app.use('bower_components', express.static(__dirname + '/../bower_components'));


var server = http.createServer(app);
server.listen(9001);

require('../lib/service/basicLauncher')(server);

