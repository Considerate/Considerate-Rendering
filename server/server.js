var webHost = require("./web");
var port = process.env.PORT || 3000;
webHost.app.listen(3000);
console.log('example running on port '+port)
