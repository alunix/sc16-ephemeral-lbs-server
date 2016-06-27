new Vue({
    parent: vue_dispatcher,
    el: '#messagearea',
    data: {
        messages: []
    },
    events:{
      'switchZone': function(id){
        this.getMessages(id);
      }
    },
    methods: {
        getMessages: function(zoneid) {
            this.$http.get('/api/messages?zone='+zoneid, function(data) {
                this.$set('messages', data['Messages']);
            });
        }
    }
});
