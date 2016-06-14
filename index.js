"use strict";

/* Change accordingly. */
var webport = 8080;
var dbport = 5984;
var dbserver = "http://localhost";
/* The last date we care about. */
var lastDate = new Date(7500,10,30);

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
    var nowDate = new Date();


    var zones = {
        "Zones": []
    };

    zonesTbl.view('zone_design', 'by_date', {
        include_docs: true,
        startkey: [ nowDate.toJSON() ]
    }, function(err, body, header) {
        if (!err) {
            for (var zCount = 0; zCount < body.rows.length; zCount++) {
                zones.Zones.push(body.rows[zCount].doc);
            }
            res.json(zones);
        } else {
            res.status(404).send('Database error! Couldn\'t fetch zones.');
        }
    });
});

server.get('/api/zones/:zoneid', function(req, res) {

    var zonesTbl = nano.use(zonesdb);
    var nowDate = new Date();

    zonesTbl.view('zone_design', 'by_id_and_date', {
        startkey:[req.params.zoneid, nowDate.toJSON()],
        endkey:[req.params.zoneid, lastDate.toJSON()],
        include_docs: true
    }, function(err, body) {
        if (!err) {
            if (body.rows.length != 0){
              res.json(body.rows[0].doc);
            }else{
              res.status(404).send('Zone non-existent or expired');
            }

        } else {
            res.status(404).send('Database error: ' + err);
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
    zonesTbl.insert(req.body, {}, function(err, body) {
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

    var nowDate = new Date();
    var zone;

    if (!req.query.zone) {
        res.status(404).send("Zone parameter missing.");
        return;
    }else{
      zone = req.query.zone;
    }

    zonesTable.view("zone_design", "by_id_and_date",
        {startkey:[zone, nowDate.toJSON()],
        endkey:[zone, lastDate.toJSON()],
        include_docs: true},
        function(err, zbody) {
        if (!err) {
            // check if the zone exists
            if (zbody.rows.length == 0) {
                res.status(404).send('Zone ID nonexistent or expired.');
                return;
            }else{
                msgTable.view("message_design", "by_zoneid_and_date",
                    {include_docs: true,
                    startkey:[zone, nowDate.toJSON()],
                    endkey:[zone, lastDate.toJSON()]},
                    function(err, mbody) {
                        if (!err) {
                          let result = { "Messages": [] };

                          for (let mCount = 0; mCount < mbody.rows.length; mCount++) {
                              result["Messages"].push(mbody.rows[mCount].doc);
                          }

                          res.json(result);
                        } else {
                            res.status(404).send('Database error! Couldn\'t fetch messages: ' + err);
                        }
                    }
                );
            }
        } else {
            res.status(404).send('Database error! Couldn\'t fetch messages: '+ err);
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
