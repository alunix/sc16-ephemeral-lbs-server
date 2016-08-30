"use strict";
var express = require('express');
var bodyParser = require("body-parser");
var Validator = require('jsonschema').Validator;
var zoneModel = require('./models/zonemodel');
var msgModel = require('./models/msgmodel');
var schemata = require('./schemata');

/* Change accordingly. */
var webport = 8080;

/* Initialize the JSON validator */
var validator = new Validator();

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

server.get('/api/zones', function(req, res) {
    zoneModel.getZones(function(err, data) {
        if (err) {
            res.status(err.status).send(err);
        } else {
            res.json(data);
        }
    })
});

server.get('/api/zones/:zoneid', function(req, res) {
    zoneModel.getZoneById(req.params.zoneid, function(err, data) {
        if (err) {
            res.status(err.status).send(err);
        } else {
            res.json(data);
        }
    })
});

server.post('/api/addzone', function(req, res) {
    let vresult = validator.validate(req.body, schemata.zone);
    if (!vresult.valid) {
        res.status(404).send({
            status: 404,
            error: 'Validation error:' + vresult.errors
        });
        return;
    }
    zoneModel.addZone(req.body, function(err, msg) {
        if (err) {
            res.status(err.status).send({ err });
        } else {
            res.status(201).send(msg);
        }
    })
});

server.get('/api/zones-search', function(req, res) {
    if (!req.query.q) {
        res.status(404).send({ status: 404, error: "Query parameter 'q' missing." });
        return;
    }
    let search_string = req.query.q.toLowerCase();
    zoneModel.searchZones(search_string, function(err, data) {
        if (err) {
            res.status(err.status).send(err);
        } else {
            res.json(data);
        }
    })
});

server.get('/api/zones/:zoneid/dailyactivity', function(req, res) {
    zoneModel.getDailyActivity(req.params.zoneid, function(err, data) {
        if (err) {
            res.status(err.status).send(err);
        } else {
            res.json(data);
        }
    })
});

server.get('/api/messages', function(req, res) {
    if (!req.query.zone) {
        res.status(404).send({ status: 404, error: "Zone parameter missing." })
    } else {
        msgModel.getMessages(req.query.zone, function(err, data) {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.json(data);
            }
        })
    }
});

server.post('/api/addmessages', function(req, res) {
    let vresult = validator.validate(req.body, schemata.messages);
    if (!vresult.valid) {
        res.status(404).send({
            status: 404,
            error: 'Validation error:' + vresult.errors
        });
        return;
    }
    msgModel.addMessages(req.body.Messages, function(err, msg) {
        if (err) {
            res.status(err.status).send({ err });
        } else {
            res.status(201).send(msg);
        }
    })
});

/* We start the server from the specified port. */
server.listen(webport, function() {
    console.log('Smart Cities SS16 server now running on port ' + webport);
});
