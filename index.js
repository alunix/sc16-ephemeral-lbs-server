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
var bodyParser = require("body-parser");
var Validator = require('jsonschema').Validator;
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


/* Handle basic requests... */
server.get('/api/zones', function(req, res) {
    var zonesTbl = nano.use(zonesdb);

    var zones = {
        "Zones": []
    };
    zonesTbl.list({
        include_docs: true
    }, function(err, body, header) {
        if (!err) {
            for (var zCount = 0; zCount < body.rows.length; zCount++) {
                let zoneDate = new Date(body.rows[zCount].doc["Expired-at"]);
                let nowDate = new Date();
                if(zoneDate > nowDate.getTime()) {
                    zones.Zones.push(body.rows[zCount].doc);
                }
            }
            res.json(zones);
        } else {
            res.status(404).send('Database error! Couldn\'t fetch zones.');
        }
    });
});

server.post('/api/addzone', function(req, res) {
    let zonesTbl = nano.use(zonesdb);

    let validator = new Validator();
    let vresult = validator.validate(req.body, schemata.zone);
    if(!vresult.valid) {
        res.status(404).send('Validation error:' + vresult.errors);
        return;
    }
    
    let zone = {
        "Geometry": {
            "Type": req.body.Geometry.Type,
            "Coordinates": req.body.Geometry.Coordinates
        },
        "Name": req.body.Name,
        "Zone-id": req.body["Zone-id"],
        "Expired-at": req.body["Expired-at"],
        "Topics": req.body["Topics"]
    };

    zonesTbl.insert(zone, {}, function(err, body) {
        if(err) {
            res.status(404).send('DB error:' + err);
        }
        else {
            res.status(201).send('Zone created');
        }
    });

});

server.get('/api/messages', function(req, res) {
    var msgTable = nano.use(msgdb);
    var zonesTable = nano.use(zonesdb);

    if (!req.query.zone) {
        res.status(404).send("Zone parameter missing.");
        return;
    }

    msgTable.list({
        include_docs: true
    }, function(err, mbody) {
        if (!err) {

            zonesTable.list({
                include_docs: true
            }, function(err, zbody) {
                if (!err) {

                    let nowDate = new Date();

                    // check if the zone expired    
                    for (let zCount = 0; zCount < zbody.rows.length; zCount++) {
                        if(zbody.rows[zCount].doc["Zone-id"] == parseInt(req.query.zone)) {
                            let zoneDate = new Date(zbody.rows[zCount].doc["Expired-at"])
                            if(zoneDate <= nowDate.getTime()) {
                                // if it expired, send an empty messages object
                                res.json({Messages:[]});
                                return;
                            }
                            break;
                        }
                    }

                    let result = {
                        "Messages": []
                    };
                    
                    for (let mCount = 0; mCount < mbody.rows.length; mCount++) {
                        // filter the zone id
                        if (mbody.rows[mCount].doc["Zone-id"] == parseInt(req.query.zone)) {
                            //check if the message expired
                            let msgDate = new Date(mbody.rows[mCount].doc["Expired-at"]);
                            if(msgDate > nowDate.getTime()) {
                                result["Messages"].push(mbody.rows[mCount].doc);
                            }
                        }
                    }

                    res.json(result);
            
                } else {
                    res.status(404).send('Database error! Couldn\'t fetch messages.');
                }
            });
            
        } else {
            res.status(404).send('Database error! Couldn\'t fetch messages.');
        }
    });
});

server.post('/api/addmessages', function(req, res) {

    let validator = new Validator();
    let vresult = validator.validate(req.body, schemata.messages);
    if(!vresult.valid) {
        res.status(404).send('Validation error:' + vresult.errors);
        return;
    }

    var msgTable = nano.use(msgdb);

    var error = null;
    for (let mCount = 0; mCount < req.body.Messages.length; mCount++) {
        let message = req.body.Messages[mCount];

        msgTable.insert(message, undefined, function(err, body) {
            if (err) {
                res.status(404).send('Database error:' + err.message);
                error = err.message;
                return;
            }
        });
        if (error) break;
    }

    if (!error) {
        res.status(201).send("Message uploaded!");
    }

});

/* We start the server from the specified port. */
server.listen(webport, function() {
    console.log('Smart Cities SS16 server now running on port ' + webport);
});
