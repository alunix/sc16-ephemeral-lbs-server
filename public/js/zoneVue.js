Vue.component('zoneinfo', {
    template: '#zone-info-template',
    props: ['name', 'expire', 'topic']
});

// create a new Vue instance and mount it to our div element above with the id of info
var vm = new Vue({
    el: '#zonearea',
    parent: vue_broadcaster,
    data: {
        zone: null,
        state: true
    },
    events: {
        'switchZone': function (id) {
            this.getZone(id);
        },
        'switchVue': function () {
            this.state = !this.state;
        }
    },
    methods: {
        getZone: function (id) {
            this.$http.get('/api/zones/' + id, function (data) {
                this.$set('zone', data);

            });
        }
    }
});
