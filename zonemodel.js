exports.nano = null;
exports.zonesdb = null;
exports.msgdb = null;

exports.configure = function(db, msgDb, zoneDb) {
    exports.nano = db;
    exports.zonesdb = zoneDb;
    exports.msgdb = msgDb;
};

/* get all zones from database */
exports.getZones = function(res, enddate, responder) {
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
            responder(null, zones, res);
        } else {
            responder(404, "Database error: Couldn't fetch zones.", res);
        }
    });
}

/* get a zone by id */
exports.getZoneById = function(res, enddate, responder, zoneid) {
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
                responder(null, result, res);
            }else{
                responder(404, 'Zone non-existent or expired', res);
            }

        } else {
            responder(404, 'Database error: ' + err, res);
        }
    });

};

/* add a zone */
exports.addZone = function(res, responder, zone) {
    let zonesTbl = exports.nano.use(exports.zonesdb);

    zonesTbl.insert(zone, {}, function(err, body) {
        if(err) {
            responder(404, 'DB error:' + err, res);
        }
        else {
            responder(null, 'Zone created', res);
        }
    });
};

/* search for zones */
exports.searchZones = function(res, enddate, responder, search_string) {

    var nowDate = new Date();
    var zonesTbl = exports.nano.use(exports.zonesdb);
       zonesTbl.view('zone_design', 'by_zone_name_and_date', {
        startkey:[search_string, nowDate.toJSON()],
        endkey:[search_string, enddate.toJSON()],
        include_docs: true
    }, function(err, body) {
        if (!err) {
            if (body.rows.length != 0) {
                let zoneResult = [];

                for (let zCount = 0; zCount < body.rows.length; zCount++){
                    let result = body.rows[zCount].doc;
                    // set Message-id, remove _id and _rev
                    let zoneID = result["_id"];
                    result["Zone-id"] = zoneID;
                    delete result["_id"];
                    delete result["_rev"];
                    zoneResult.push(result);
                }
                responder(null, zoneResult, res);
            }
            else{
                responder(null, [], res);
            }

        } else {
            responder(404, 'Database error: ' + err, res);
        }
    });
};