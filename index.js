"use strict";

/* Change accordingly. */
var webport = 8080;
var dbport = 5984;
var dbserver = "http://localhost";
/* These two databases have to exist in your CouchDB instance. */
var zonesdb = "zones";
var msgdb = "messages";


var express = require('express');
var nano = require('nano')(dbserver + ':' + dbport);

/*
 * We set up the server to serve static files from /public,
 * in case it should deliver static files.
 */
var server = express();
server.use(express.static('./public'));

/* This adds CORS-string into the header of each response. */
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

/* Handle basic requests... */
server.get('/api/zones', function(req, res) {
    var zones = nano.use(zonesdb);

    zones.list(function(err, body) {
        if (!err) {
            res.json(body);
        }
        else {
            res.status(400).send('Database error! Couldn\'t fetch zones.');
        }
    });
});

server.get('/api/messages', function(req, res) {
    var messages = nano.use(msgdb);

    messages.list(function(err, body) {
        if (!err) {
            res.json(body);
        }
        else {
            res.status(400).send('Database error! Couldn\'t fetch messages.');
        }
    });
});

/* We start the server from the specified port. */
server.listen(webport, function(){
    console.log('Smart Cities SS16 server now running on port ' + webport);
});
