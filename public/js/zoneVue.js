Vue.component('zoneinfo', {
    template: '#zone-info-template',
    props: ['name', 'expire', 'topic']
});

// create a new Vue instance and mount it to our div element above with the id of info
var vm = new Vue({
    el: '#zonearea',
    parent: vue_broadcaster,
    data: {
        zone: null
    },
    events: {
        'switchZone': function (id) {
            this.getZone(id);
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
