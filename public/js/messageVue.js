Vue.component('messageinfo', {
    template: '#message-info-template',
    props: ['title', 'message']
});

var vm = new Vue({
    el: '#messagearea',
    parent: vue_broadcaster,
    data: {
        messages:  [
            {
                Title: "bla",
                Message: "rofl kopter roflt rum"
            },
            {
                Title: "cool",
                Message: "toll"
            }],

        state: true
    },
    events: {
        'switchZone': function (id) {
            this.getMessages(id);
        },
        'switchVue': function () {
            this.state = !this.state;
        }
    },
    methods: {
        getMessages: function (zoneid) {
            this.$http.get('/api/messages?zone=' + zoneid, function (data) {
                this.$set('messages', data['Messages']);
                console.log(this.messages)
            });
        }
    }
});