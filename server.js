// Import the games model
require('./server/models/users');
require('./server/models/games');
// setup Express and Routes

var app = require('./server/configs/express');

// setup API
var routes = require('./server/controllers/routes');
routes(app);

// setup Mongo connection
require('./server/configs/mongo');

// start the server
var server = app.listen(3000, function() {
    console.log("Started on port 3000");
    var host = server.address().address;
    var port = server.address().port;
});
