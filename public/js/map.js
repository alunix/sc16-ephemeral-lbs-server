var mapVue = new Vue({
  parent: vue_broadcaster,
  el: '#map',
  data: {
    map: null,
    layer: null,
    zoneid: null
  },
  created: function () {
    var map = L.map('map').setView([51.959, 7.623], 14);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    this.$set('map', map);
    this.get_zones();
  },
  methods: {
    switch_zone: function (zoneid) {
      this.$dispatch('zoneSelected', zoneid)
    },
    get_zones: function () {
      this.$http.get('/api/zones/', function (data) {
        var geoZone = {
          "type": "FeatureCollection",
          "features": []
        };
        for (var i = 0; i < data['Zones'].length; i++) {
          this.$set('zoneid', data['Zones'][i]['Zone-id']);
          geoZone.features.push({
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [[]]
            },
            "properties": {
              "name": "",
              "zoneid": ""
            }
          })
          geoZone.features[i].properties.name = data['Zones'][i]['Name'];
          geoZone.features[i].properties.zoneid = data['Zones'][i]['Zone-id'];
          for (var j = 0; j < data['Zones'][i]['Geometry']['Coordinates'].length; j++) {
            geoZone.features[i].geometry.coordinates[0].push([data['Zones'][i]['Geometry']['Coordinates'][j][1], data['Zones'][i]['Geometry']['Coordinates'][j][0]])
          }
          this.layer = L.geoJson(geoZone)
            .bindPopup(data['Zones'][i]['Name'])
            .on('click', function (e) {
              processClick(e.latlng.lat, e.latlng.lng)
            })
            .addTo(this.map)
        };
      })
    }
  }
});

function processClick(lat, lng) {
  var info = '';
  var point = [lng, lat];
  var match = leafletPip.pointInLayer(point, mapVue.layer, false);
  if (match.length > 1) {
    for (var i = 0; i < match.length; i++) {
      id = match[i].feature.properties.zoneid;
      name = match[i].feature.properties.name;
      info +=
      "<b><a onclick='dispatchZoneID(\"" + id + "\")();'>"+ name + "</a><br>"
    }
  }
  else dispatchZoneID(mapVue.zoneid)();

  if (info) {
    mapVue.map.openPopup(info, [lat, lng]);
  }
};


function dispatchZoneID(id) {
  return function () {
    console.log("dispatchZoneID");
    mapVue.$dispatch('zoneSelected', id)
  }
};