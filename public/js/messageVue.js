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
        ],
        state: true
    },
    events: {
        'switchZone': function (id) {
            //this.getMessages(id);
        },
        'switchVue': function () {
            this.state = !this.state;
            console.log(this.state)
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