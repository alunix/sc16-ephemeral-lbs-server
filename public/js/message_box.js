// Get message box
function update(){
  $.ajax({
     url: '/api/messages?zone=1',
     type: 'get',
     dataType: 'json',
     success: function(data) {
       for(var i = 0; i< data['Messages'].length; i++) {
         console.log(data['Messages'][i]);
         $('#messagearea').append('<div class="message">'+data['Messages'][i]['Body']['Title']+'</div>');
       }
     }
  });




}
