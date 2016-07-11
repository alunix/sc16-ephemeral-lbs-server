Vue.component('zoneinfo', {
    template: '#zone-info-template',
    props: ['name', 'expire', 'topic']
});

// create a new Vue instance and mount it to our div element above with the id of info
var vmZone = new Vue({
    el: '#zonearea',
    parent: vue_broadcaster,
    data: {
        zone: null,
        state: false
    },
    events: {
        'switchZone': function (id) {
            this.getZone(id);
        },
        'switchVue': function () {
            this.state = !this.state;
        },
        'firstInit': function(){
            this.state = true;
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
