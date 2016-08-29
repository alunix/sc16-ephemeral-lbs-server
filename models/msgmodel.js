"use strict";
var db = require('./database.js')

/* The last date we care about. */
var lastDate = new Date(7500, 10, 30);

/* get all messages of a specified zone from the database */
module.exports.getMessages = function(zone, callback) {
    var nowDate = new Date();

    db.zones.view("zone_design", "by_id_and_date", {
            startkey: [zone, nowDate.toJSON()],
            endkey: [zone, lastDate.toJSON()],
            include_docs: true
        },
        function(err, zbody) {
            if (!err) {
                // check if the zone exists
                if (zbody.rows.length == 0) {
                    callback({ status: 404, error: 'Zone ID nonexistent or expired.' }, null);
                    return;
                } else {
                    db.msgs.view("message_design", "by_zoneid_and_date", {
                            include_docs: true,
                            startkey: [zone, nowDate.toJSON()],
                            endkey: [zone, lastDate.toJSON()]
                        },
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

                                callback(null, result);
                            } else {
                                callback({ status: 404, error: 'Database error! Couldn\'t fetch messages: ' + err }, null);
                            }
                        }
                    );
                }
            } else {
                callback({ status: 404, error: 'Database error! Couldn\'t fetch messages: ' + err }, null);
            }
        });
};

/* adds multiple messages in one move into the database */
module.exports.addMessages = function(messages, callback) {
    // convert Message-id to _id messages to save space
    for (let mCount = 0; mCount < messages.length; mCount += 1) {
        let messageID = messages[mCount]["Message-id"];
        messages[mCount]["_id"] = messageID;
        delete messages[mCount]["Message-id"];
    }

    // bulk insert/update into database
    db.msgs.bulk({ "docs": messages }, undefined, function(err, body) {
        if (err) {
            callback({ status: 404, error: 'Database error:' + err.message }, null);
            return;
        } else {
            callback(null, "Message(s) uploaded!");
        }

    });
};
