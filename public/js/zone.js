new Vue({
    parent: vue_dispatcher,
    el: '#zonearea',
    data: {
        zone: {}
    },
    events:{
      'switchZone': function(id){
        this.getZone(id);
      }
    },
    methods: {
        getZone: function(id) {
            this.$http.get('/api/zones/'+id, function(data) {
                this.$set('zone', data);
            });
        }
    }
});
