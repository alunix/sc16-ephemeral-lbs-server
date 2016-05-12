$.ajax({
   url: 'http://giv-oct.uni-muenster.de:5984/',
   type: 'get',
   dataType: 'jsonp',
   success: function(data) {
      alert(data.couchdb);
      alert(data.version);
   }
});