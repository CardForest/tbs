var TransportService = require('./transportService');

var http = require('http');
var server = http.createServer();
server.listen(9001);

var t = new TransportService(server);

t.setService();
