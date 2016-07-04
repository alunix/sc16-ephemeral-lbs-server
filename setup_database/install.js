// the two designs inserted into the tables zones and messages
var zonedesign = {
    "_id": "_design/zone_design",
    "views": {
        "by_date": {
            "map": "function(doc){ emit([doc['Expired-at']], doc)}"
        },
        "by_id_and_date": {
            "map": "function(doc){ emit([doc['_id'], doc['Expired-at']], doc)}"
        },
        "by_zone_name_and_date": {
            "map": "function(doc) { var i; var text = doc['Name'].toLowerCase();for (i = 0; i < text.length; i += 1) { emit([ text.slice(0, i+1), doc['Expired-at']], doc); } var t = 0; for(t = 0; t < doc['Topics'].length; t+=1){ emit([ doc['Topics'][t].toLowerCase(), doc['Expired-at']], doc); } }"
        }
    }
};
var messagedesign = {
    "_id": "_design/message_design",
    "views": {
        "by_zoneid_and_date": {
           "map": "function(doc){ emit([doc['Zone-id'],doc['Expired-at']], doc)}"
        },
        "by_id_and_date": {
           "map": "function(doc){ emit([doc['_id'],doc['Expired-at']], doc)}"
        },
        "by_zone_name_and_date": {
           "map": "function(doc){ emit([doc['Name'],doc['Expired-at']], doc)}"
        },
        "zone_activity_by_time":{
          "map": "function(doc){var date = new Date(doc['Created-at']); var day = date.getDay(); var hour = date.getHours(); emit([doc['Zone-id'],day, hour],1)}",
          "reduce":"_sum"
        },
        "zone_activity_by_date":{
          "map": "function(doc){ emit([doc['Zone-id'],doc['Created-at']],null)}",
          "reduce" : "_count"
        }
    }
};

var dbport = 5984;
var dbserver = "http://localhost";
var nano = require('nano')({'url': dbserver + ':' + dbport,
    'requestDefaults' : { 'proxy' : null }});

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

msgdb.get('_design/message_design', function(err, body){
  if(err &&  err.error!='not_found'){
    console.log(err);
  }
  else{
    if(!err){
      messagedesign['_rev'] = body['_rev'];
    }
    msgdb.insert(messagedesign, function(err, body) {
            if (err) {
                console.log('There was an error: ' + err)
            }
        }

    );
  }
})

zonedb.get('_design/zone_design', function(err, body){
  if(err &&  err.error!='not_found'){
    console.log(err);
  }
  else{
    if(!err){
      zonedesign['_rev'] = body['_rev'];
    }
    zonedb.insert(zonedesign, function(err, body) {
        if (err) {
            console.log('There was an error: ' + err)
        }
    });

  }
})
