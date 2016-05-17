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
        "Type": "Zones",
        "Zones": []
    };
    zonesTbl.list({
        include_docs: true
    }, function(err, body, header) {
        if (!err) {
            for (var i = 0; i < body.rows.length; i++) {
                zones.Zones.push(body.rows[i].doc);
            }
            res.json(zones);
        } else {
            res.status(404).send('Database error! Couldn\'t fetch zones.');
        }
    });
});

server.post('/api/addzone', function(req, res) {
    var zonesTbl = nano.use(zonedb);

    if (req.body.Type !== "Zone") {
        res.status(404).send("Wrong data type " + req.body.type + ".");
        return;
    }

    try {
        let zone = {
            "Geometry": {
                "Type": req.body.Geometry.Type,
                "Coordinates": req.body.Geometry.Coordinates
            },
            "Properties": {
                "Name": req.body.Properties.Name,
                "Zone-id": req.body.Properties["Zone-id"],
                "Expired-at": req.body.Properties["Expired-at"]
            }
        }
        zonesTbl.insert(zone);
    } catch (err) {
        res.status(404).send('JSON error:' + err);
    }

});

server.get('/api/messages', function(req, res) {
    var msgTable = nano.use(msgdb);

    if (!req.query.zone) {
        res.status(404).send("Zone parameter missing.");
        return;
    }

    msgTable.list({
        include_docs: true
    }, function(err, body) {
        if (!err) {

            let result = {
                "Type": "Messages",
                "Messages": []
            };

            for (let i = 0; i < body.rows.length; i++) {
                if (body.rows[i].doc["Header"]["Zone-id"] == parseInt(req.query.zone)) {
                    result["Messages"].push(body.rows[i].doc);
                }
            }

            res.json(result);
        } else {
            res.status(404).send('Database error! Couldn\'t fetch messages.');
        }
    });
});

server.post('/api/addmessages', function(req, res) {

    if (req.body.Type !== "Messages") {
        res.status(404).send("Wrong data type " + req.body.type + ".");
        return;
    }

    var msgTable = nano.use(msgdb);
    try {
        var error = null;
        for (let i = 0; i < req.body.Messages.length; i++) {
            let message = req.body.Messages[i];
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
    }
    /* In case the message wasn't valid... TODO: better validation */
    catch (err) {
        res.status(404).send('JSON error:' + err);
    }
});

/* We start the server from the specified port. */
server.listen(webport, function() {
    console.log('Smart Cities SS16 server now running on port ' + webport);
});
