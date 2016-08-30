/* The database settings... */
var dbport = 5984;
var dbserver = "http://localhost";
var zonesdb = "zones";
var msgdb = "messages";

/* Set up database and models... */
var nano = require('nano')({
    'url': dbserver + ':' + dbport,
    'requestDefaults': { 'proxy': null }
});

module.exports.zones = nano.use(zonesdb);

module.exports.msgs = nano.use(msgdb);
