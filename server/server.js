/*var webHost = require("./web");
var port = process.env.PORT || 3000;
webHost.app.listen(3000);
console.log('example running on port '+port)*/


var http = require('http');
 
var server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Hello world\n");
});
 
server.listen(process.env.PORT || 8001);
