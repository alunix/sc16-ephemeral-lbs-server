var zones = require('./mockdata_zones.js').mock_zones;
var lorem = require('lorem-ipsum');

var dbport = 5984;
var dbserver = 'http://localhost';
var nano = require('nano')({'url': dbserver + ':' + dbport,
    'requestDefaults' : { 'proxy' : null }});
var msgdb = nano.use('messages');
var zonedb = nano.use('zones');

const MS_IN_DAY = 86400000;

function insertMocks(zns, numberMsgPerZone) {
    for (var zone in zns) {
        zonedb.insert(zns[zone], function(err, body) {
            if (err) {
                console.log('DB error:' + err)
            }
            else {
              zns[zone]['_id'] = body['id']
              var msgs = generateMessages(numberMsgPerZone, zns[zone]);
              for (var msg in msgs) {
                  msgdb.insert(msgs[msg], function(err, body) {
                      if (err) {
                          console.log('DB error:' + err)
                      }
                  })
              }
            }
        })
    }


}



//returns random value from 1 to end
function getRandom(end) {
    return Math.floor((Math.random() * end) + 1);
}

function generateMessages(number, zone) {
    var messages = [];

    for (var i = 0; i < number; i++) {
        var message = {};
        var topics = zone['Topics']
        message['Zone-id'] = zone['_id'];
        message['Topic'] = topics[Math.floor(Math.random() * topics.length)];
        message['Title'] = generateTitle();
        message['Message'] = generateMsg();

        var date = new Date();
        date.setTime(date.getTime() - (getRandom(7) * MS_IN_DAY)+(Math.random() * MS_IN_DAY))
        message['Created-at'] = date.toJSON();
        date.setTime(date.getTime() + (getRandom(30) + (10 * MS_IN_DAY)+(Math.random() * MS_IN_DAY)))
        message['Expired-at'] = date.toJSON();
        messages.push(message);
    }
    return messages;
}

function generateTitle() {
    return lorem({
        count: getRandom(12),
        units: 'words',
        sentenceLowerBound: 5,
        sentenceUpperBound: 15,
        format: 'plain'
    })
}

function generateMsg() {
    return lorem({
        count: getRandom(6),
        units: 'sentences',
        sentenceLowerBound: 1,
        sentenceUpperBound: 15,
        format: 'plain'
    })
}


insertMocks(zones, 200);
