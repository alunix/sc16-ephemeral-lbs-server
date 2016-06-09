new Vue({
    el: '#zonearea',
    data: {
        zone: {}
    },
    created: function() {
        this.getZone(1);
    },
    methods: {
        getZone: function(id) {
            this.$http.get('/api/zones/'+id, function(data) {
                this.$set('zone', data);
            });
        }
    }
});
