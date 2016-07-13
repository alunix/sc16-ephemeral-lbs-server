"use strict";
exports.nano = null;
exports.zonesdb = null;
exports.msgdb = null;

exports.configure = function(db, msgDb, zoneDb) {
    exports.nano = db;
    exports.zonesdb = zoneDb;
    exports.msgdb = msgDb;
};

exports.getMessages = function(res, enddate, responder, zone) {
    var msgTable = exports.nano.use(exports.msgdb);
    var zonesTable = exports.nano.use(exports.zonesdb);

    var nowDate = new Date();

    zonesTable.view("zone_design", "by_id_and_date",
        {startkey:[zone, nowDate.toJSON()],
        endkey:[zone, enddate.toJSON()],
        include_docs: true},
        function(err, zbody) {
        if (!err) {
            // check if the zone exists
            if (zbody.rows.length == 0) {
                responder(404, 'Zone ID nonexistent or expired.', res);
                return;
            }else{
                msgTable.view("message_design", "by_zoneid_and_date",
                    {include_docs: true,
                    startkey:[zone, nowDate.toJSON()],
                    endkey:[zone, enddate.toJSON()]},
                    function(err, mbody) {
                        if (!err) {
                            let result = { "Messages": [] };

                            for (let mCount = 0; mCount < mbody.rows.length; mCount++) {
                                let message = mbody.rows[mCount].doc;
                                // convert _id into Message-id and remove _rev
                                delete message["_rev"];
                                let messageID = message["_id"];
                                message["Message-id"] = messageID;
                                delete message["_id"];
                                result["Messages"].push(message);
                            }

                            responder(null, result, res);
                        } else {
                            responder(404, 'Database error! Couldn\'t fetch messages: ' + err, res);
                        }
                    }
                );
            }
        } else {
            responder(404, 'Database error! Couldn\'t fetch messages: '+ err, res);
        }
    });
};

/* adds multiple messages in move into the database */
exports.addMessages = function(res, responder, messages) {
    var msgTable = exports.nano.use(exports.msgdb);

    // convert Message-id to _id messages to save space
    for(let mCount = 0; mCount < messages.length; mCount += 1) {
        let messageID = messages[mCount]["Message-id"];
        messages[mCount]["_id"] = messageID;
        delete messages[mCount]["Message-id"];
    }

    // bulk insert/update into database
    msgTable.bulk({ "docs" : messages }, undefined, function(err, body) {
        if (err) {
            responder(404, 'Database error:' + err.message, res);
            return;
        } else {
            responder(null, "Message(s) uploaded!", res);
        }

    });
};
