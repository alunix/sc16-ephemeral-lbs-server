$.ajax({
   url: 'http://localhost:5984/',
   type: 'get',
   dataType: 'jsonp',
   success: function(data) {
      alert(data.couchdb);
      alert(data.version);
   }
});