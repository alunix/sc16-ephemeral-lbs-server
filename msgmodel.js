exports.nano = null;
exports.zonesdb = null;
exports.msgdb = null;

exports.configure = function(db, msgDb, zoneDb) {
    exports.nano = db;
    exports.zonesdb = zoneDb;
    exports.msgdb = msgDb;
};