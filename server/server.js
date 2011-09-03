var webHost = require("./web");
var port = process.env.PORT || 3000;
webHost.app.listen(port);
console.log('example running on port '+port)
