"use strict";
var db = require('./database.js')

/* The last date we care about. */
var lastDate = new Date(7500, 10, 30);

/* get all zones from database */
module.exports.getZones = function(callback) {
    var nowDate = new Date();
    var zones = {
        "Zones": []
    };
    db.zones.view('zone_design', 'by_date', {
            include_docs: true,
            startkey: [nowDate.toJSON()]
        },
        function(err, body, header) {
            if (!err) {
                for (var zCount = 0; zCount < body.rows.length; zCount++) {
                    // make Zone-id the _id and delete _id and _rev
                    let zoneID = body.rows[zCount].doc["_id"];
                    body.rows[zCount].doc["Zone-id"] = zoneID;
                    delete body.rows[zCount].doc["_id"];
                    delete body.rows[zCount].doc["_rev"];
                    zones.Zones.push(body.rows[zCount].doc);
                }
                callback(null, zones);
            } else {
                callback({ status: 404, error: "Database error: Couldn't fetch zones." }, null);
            }
        });
}

/* get a zone by id */
module.exports.getZoneById = function(zoneid, callback) {
    var nowDate = new Date();

    db.zones.view('zone_design', 'by_id_and_date', {
        startkey: [zoneid, nowDate.toJSON()],
        endkey: [zoneid, lastDate.toJSON()],
        include_docs: true
    }, function(err, body) {
        if (!err) {
            if (body.rows.length != 0) {
                let result = body.rows[0].doc;
                // make Zone-id the _id and delete _id and _rev
                let zoneID = result["_id"];
                result["Zone-id"] = zoneID;
                delete result["_id"];
                delete result["_rev"];
                callback(null, result);
            } else {
                callback({ status: 404, error: 'Zone non-existent or expired' }, null);
            }

        } else {
            callback({ status: 404, error: 'Database error: ' + err }, null);
        }
    });

};

/* add a zone */
module.exports.addZone = function(zone, callback) {
    db.zones.insert(zone, {}, function(err, body) {
        if (err) {
            callback({ status: 404, error: 'DB error:' + err }, null);
        } else {
            callback(null, 'Zone created');
        }
    });
};

/* search for zones */
module.exports.searchZones = function(search_string, callback) {
    var nowDate = new Date();
    db.zones.view('zone_design', 'by_zone_name_and_date', {
        startkey: [search_string, nowDate.toJSON()],
        endkey: [search_string, lastDate.toJSON()],
        include_docs: true
    }, function(err, body) {
        if (!err) {
            if (body.rows.length != 0) {
                let zoneResult = [];

                for (let zCount = 0; zCount < body.rows.length; zCount++) {
                    let result = body.rows[zCount].doc;
                    // set Zone-id, remove _id and _rev
                    let zoneID = result["_id"];
                    result["Zone-id"] = zoneID;
                    delete result["_id"];
                    delete result["_rev"];
                    zoneResult.push(result);
                }
                callback(null, zoneResult);
            } else {
                callabck(null, []);
            }

        } else {
            callback({ status: 404, error: 'Database error: ' + err }, null);
        }
    });
};

/* get statistics about daily activity in a zone */
module.exports.getDailyActivity = function(id, callback) {
    db.msgs.view("message_design", "zone_activity_by_time", {
            startkey: [id, 0],
            endkey: [id, 23],
            group: true
        },
        function(err, body) {
            if (!err) {
                var output = [];
                for (var i = 0; i <= 23; i++) {
                    output[i] = 0
                }
                for (var row in body.rows) {
                    output[body.rows[row]['key'][1]] = body.rows[row]['value'];
                }
                callback(null, output);
            } else {
                callback({ status: 404, error: 'Database error: ' + err }, null);
            }
        });
};
