"use strict";

var webport = 8080;

var express = require('express');

/*
 * We set up the server to serve static files from the subfolder "public",
 * in case it needs to deliver images, css, js files and static html files.
 */
var server = express();
server.use(express.static('./public'));

//TODO: handle application and web frontend requests

/* We start the server from the specified port. */
server.listen(webport, function(){
    console.log('Smart Cities SS16 server now running on port ' + webport);
});
