new Vue({
  parent: vue_dispatcher,
  el: '#map',
  data: {
      map: null
  },
  created: function(){
    var map = L.map('map').setView([51.959, 7.623], 14);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    this.$set('map', map);
    this.get_zones();
  },
  methods: {
    switch_zone: function(zoneid){
      this.$dispatch('zoneSelected', zoneid)
    },
    get_zones: function(){
      this.$http.get('/api/zones/', function(data) {
          for (var i = 0; i < data['Zones'].length; i++) {
            console.log('zone' + data['Zones'][i])
            polygon = L.polygon(data['Zones'][i]['Geometry']['Coordinates'])
              .bindPopup(data['Zones'][i]['Name'])
              .on('click', dispatchZoneID(data['Zones'][i]['Zone-id'], this))
              .addTo(this.map);
          }
      })
    }
  }
});

function dispatchZoneID(id, vue){
  return function(){
    vue.$dispatch('zoneSelected', id)
  }
}
