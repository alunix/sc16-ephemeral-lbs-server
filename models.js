/* This file contains most aspects of the database connection, including configuration. */
exports.dbport = 5984;
exports.dbserver = "http://localhost";
/* These two databases have to exist in your CouchDB instance. */
exports.zonesdb = "zones";
exports.msgdb = "messages";

/* set up database */ 
exports.nano = require('nano')( {
    'url': exports.dbserver + ':' + exports.dbport,
    'requestDefaults' : { 'proxy' : null }
});

/* get all zones from database */
exports.getZones = function(enddate, responder) {
    var zonesTbl = exports.nano.use(exports.zonesdb);

    var nowDate = new Date();
    var zones = {
        "Zones": []
    };
    zonesTbl.view('zone_design', 'by_date', {
        include_docs: true,
        startkey: [ nowDate.toJSON() ]},
        function(err, body, header) {
        if (!err) {
            for (var zCount = 0; zCount < body.rows.length; zCount++) {
                // make Message-id the id and delete _id and _rev
                let zoneID = body.rows[zCount].doc["_id"];
                body.rows[zCount].doc["Zone-id"] = zoneID;
                delete body.rows[zCount].doc["_id"];
                delete body.rows[zCount].doc["_rev"];
                zones.Zones.push(body.rows[zCount].doc);
            }
            responder(true, zones);
        } else {
            responder(false, "Database error: Couldn't fetch zones.");
        }
    });
}

/* get a zone by id */
exports.getZoneById = function(enddate, responder, zoneid) {
    var zonesTbl = exports.nano.use(exports.zonesdb);
    var nowDate = new Date();

    zonesTbl.view('zone_design', 'by_id_and_date', {
        startkey:[zoneid, nowDate.toJSON()],
        endkey:[zoneid, enddate.toJSON()],
        include_docs: true
    }, function(err, body) {
        if (!err) {
            if (body.rows.length != 0){
                let result = body.rows[0].doc;
                // make Message-id the id and delete _id and _rev
                let zoneID = result["_id"];
                result["Zone-id"] = zoneID;
                delete result["_id"];
                delete result["_rev"];
                responder(true, result);
            }else{
                responder(false, 'Zone non-existent or expired');
            }

        } else {
            responder(false, 'Database error: ' + err);
        }
    });

};