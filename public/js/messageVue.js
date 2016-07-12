Vue.component('messageinfo', {
    template: '#message-info-template',
    props: ['title', 'message', 'topic']
});

var vmMessage = new Vue({
    el: '#messagearea',
    parent: vue_broadcaster,
    data: {
        messages:  [],

        state: false
    },
    events: {
        'switchZone': function (id) {
            this.getMessages(id);
        },
        'switchVue': function () {
            this.state = !this.state;
        },
        'firstInit': function(){
            this.state = true;
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
