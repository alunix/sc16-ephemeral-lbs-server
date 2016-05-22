new Vue({
    el: '#messagearea',
    data: {
        messages: []
    },
    created: function() {
        this.getMessages();
    },
    methods: {
        getMessages: function() {
            this.$http.get('/api/messages?zone=1', function(data) {
                this.$set('messages', data['Messages']);
            });
        }
    }
});
