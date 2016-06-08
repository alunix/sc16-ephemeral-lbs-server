// the two designs inserted into the tables zones and messages
var zonedesign = {
    {
        "_id": "_design/zone_design",
        "views": {
            "id_zones": {
                "map": "function(doc){emit(doc['Zone-id'], null)}"
            },
            "expire_zones": {
                "map": "function(doc){emit(doc['Expired-at'],null)}"
            }
        }
    }
};
var messagedesign = {
    {
        "_id": "_design/message_design",
        "views": {
            "message_view": {
                "map": "function(doc){emit([doc.Zone-id, doc.Expired-at], null)}"
            }
        }
    }
};

var dbport = 5984;
var dbserver = "http://localhost";
var nano = require('nano')(dbserver + ':' + dbport);

// creating the databases
nano.db.create('zones', function(err, body) {
    if (err) {
        console.log('There was an error creating the database zones: ' + err);
    }
});

nano.db.create('messages', function(err, body) {
    if (err) {
        console.log('There was an error creating the database messages: ' + err);
    }
});

//adding views to the two databases
var msgdb = nano.use('messages');
var zonedb = nano.use('zones')

msgdb.insert(messagedesign, function(err, body) {
        if (err) {
            console.log('There was an error: ' + err)
        }
    }

);

zonedb.insert(zonedesign, function(err, body) {
    if (err) {
        console.log('There was an error: ' + err)
    }
});
