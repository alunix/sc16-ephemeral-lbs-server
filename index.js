"use strict";

/* Change accordingly. */
var webport = 8080;

/* The database settings... */
var dbport = 5984;
var dbserver = "http://localhost";
var zonesdb = "zones";
var msgdb = "messages";

/* The last date we care about. */
var lastDate = new Date(7500,10,30);

var express = require('express');
var bodyParser = require("body-parser");
var Validator = require('jsonschema').Validator;
var zoneModel = require('./zonemodel');
var msgModel = require('./msgmodel');
var schemata = require('./schemata');

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

/* This configures body-parser. */
server.use(bodyParser.urlencoded({
    extended: false
}));
server.use(bodyParser.json());

/* Set up database and models... */
var connection = require('nano')( {
    'url': dbserver + ':' + dbport,
    'requestDefaults' : { 'proxy' : null }
});
zoneModel.configure(connection, msgdb, zonesdb);
msgModel.configure(connection, msgdb, zonesdb);

/* Handle basic requests... */

/* These two function get injected into the model function calls to respond to the HTTP requests. */

var outputResponder = function(errCode, data, res) {
    if(!errCode) {
        res.json(data);
    }
    else {
        res.status(errCode).send(data);
    }
};

var inputResponder = function(errCode, msg, res) {
    res.status(errCode ? errCode : 201).send(msg);
};

server.get('/api/zones', function(req, res) {

    zoneModel.getZones(res, lastDate, outputResponder);
});

server.get('/api/zones/:zoneid', function(req, res) {

    zoneModel.getZoneById(res, lastDate, outputResponder, req.params.zoneid);
});

server.post('/api/addzone', function(req, res) {

    let validator = new Validator();
    let vresult = validator.validate(req.body, schemata.zone);
    if(!vresult.valid) {
        inputResponder(404, 'Validation error:' + vresult.errors, res);
        return;
    }

    zoneModel.addZone(res, inputResponder, req.body);
});

server.get('/api/zones-search', function(req, res) {

    if (!req.query.q) {
        outputResponder(404, "Query parameter 'q' missing.", res);
        return;
    }

    let search_string = req.query.q.toLowerCase();
    zoneModel.searchZones(res, lastDate, outputResponder, search_string);
});

server.get('/api/zones/:zoneid/dailyactivity', function(req, res) {
    zoneModel.getDailyActivity(res, outputResponder, req.params.zoneid);
});

server.get('/api/messages', function(req, res) {

    if (!req.query.zone) {
        outputResponder(404, "Zone parameter missing.", res);
        return;
    }

    msgModel.getMessages(res, lastDate, outputResponder, req.query.zone);
});

server.post('/api/addmessages', function(req, res) {

    let validator = new Validator();
    let vresult = validator.validate(req.body, schemata.messages);
    if(!vresult.valid) {
        res.status(404).send('Validation error:' + vresult.errors);
        return;
    }

    var msgTable = nano.use(msgdb);

    let messages = req.body.Messages;

    // modify messages to save space
    for(let mCount = 0; mCount < messages.length; mCount += 1) {
        let messageID = messages[mCount]["Message-id"];
        messages[mCount]["_id"] = messageID;
        delete messages[mCount]["Message-id"];
    }

    // bulk insert/update into database
    msgTable.bulk({ "docs" : messages }, undefined, function(err, body) {
        if (err) {
            res.status(404).send('Database error:' + err.message);
            return;
        } else {
            res.status(201).send("Message(s) uploaded!");
        }

    });

});

/* We start the server from the specified port. */
server.listen(webport, function() {
    console.log('Smart Cities SS16 server now running on port ' + webport);
});
