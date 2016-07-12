"use strict";

/* Change accordingly. */
var webport = 8080;

/* The last date we care about. */
var lastDate = new Date(7500,10,30);

var express = require('express');
var bodyParser = require("body-parser");
var Validator = require('jsonschema').Validator;
var models = require('./models');
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

    let responder = function(success, data){
        if(success) {
            res.json(data);
        }
        else {
            res.status(404).send(data);
        }
    };
    models.getZones(lastDate, responder);

});

server.get('/api/zones/:zoneid', function(req, res) {
    let responder = function(success, data) {
        if(success) {
            res.json(data);
        }
        else {
            res.status(404).send(data);
        }
    };
    models.getZoneById(lastDate, responder, req.params.zoneid);

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

server.get('/api/zones-search', function(req, res) {

    var zonesTbl = nano.use(zonesdb);
    var nowDate = new Date();

    if (!req.query.q) {
        res.status(404).send("Query parameter 'q' missing.");
        return;
    }

    let search_string = req.query.q.toLowerCase();

    zonesTbl.view('zone_design', 'by_zone_name_and_date', {
        startkey:[search_string, nowDate.toJSON()],
        endkey:[search_string, lastDate.toJSON()],
        include_docs: true
    }, function(err, body) {
        if (!err) {
            if (body.rows.length != 0) {
                let zoneResult = [];

                for (let zCount = 0; zCount < body.rows.length; zCount++){
                    let result = body.rows[zCount].doc;
                    let zoneID = result["_id"];
                    result["Zone-id"] = zoneID;
                    delete result["_id"];
                    delete result["_rev"];
                    zoneResult.push(result);
                }
                res.json(zoneResult);

            }
            else{
                res.json([]);
            }

        } else {
            res.status(404).send('Database error: ' + err);
        }
    });
});

server.get('/api/zones/:zoneid/dailyactivity', function(req, res) {
  var msgTable = nano.use(msgdb);

  msgTable.view("message_design", "zone_activity_by_time",
      {startkey:[req.params.zoneid,0,0],
      endkey:[req.params.zoneid,6,23],
      group:true},
      function(err, body) {
        if (!err) {
          var output=[];
          for (var i = 0; i<=6; i++){
            output[i]=[]
            for (var j=0; j<=23; j++){
              output[i][j] = 0
            }
          }
          for(var row in body.rows){
            output[body.rows[row]['key'][1]][body.rows[row]['key'][2]] = body.rows[row]['value'];
          }
          res.json(output);
        } else {
          res.status(404).send('Database error: ' + err);
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
                                let message = mbody.rows[mCount].doc;
                                delete message["_rev"];
                                let messageID = message["_id"];
                                message["Message-id"] = messageID;
                                delete message["_id"];
                                result["Messages"].push(message);
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
