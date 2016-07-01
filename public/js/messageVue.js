Vue.component('messageinfo', {
    template: '#message-info-template',
    props: ['title', 'message']
});

var vm = new Vue({
    el: '#messagearea',
    parent: vue_broadcaster,
    data: {
        messages: [
            {
                title: "bla",
                message: "rofl kopter roflt rum"
            },
            {
                title: "cool",
                message: "toll"
            }
        ]
    },
    events: {
        'switchZone': function (id) {
            //this.getMessages(id);
        }
    },
    methods: {
        getMessages: function (zoneid) {
            this.$http.get('/api/messages?zone=' + zoneid, function (data) {
                this.$set('messages', data['Messages']);
            });
        }
    }
});