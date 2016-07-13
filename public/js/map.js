// Vue for map content
var mapVue = new Vue({
  parent: vue_broadcaster,
  el: '#map',
  data: {
    map: null,
    layer: null,
    button_shown: true
  },
  // map initialization
  created: function () {
    var map = L.map('map').setView([51.959, 7.623], 14);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    this.$set('map', map);
    this.get_zones();
	startEditing(map);
  },
  events:{
    'switchState': function (state) {
      if (state == "addzone"){
        this.button_shown = false;
      }
      else{
        this.button_shown = true;
      }
    }
  },
  methods: {
    switch_zone: function (zoneid) {
      this.$dispatch('switchZone', zoneid)
    },
    start_editing: function(){
      this.$dispatch('switchState', 'addzone')
    },
    get_zones: function () {
      this.$http.get('/api/zones/', function (data) {
        // geoZone is a GeoJSON which is needed for finding overlapping zones
        var geoZone = {
          "type": "FeatureCollection",
          "features": []
        };
        for (var i = 0; i < data['Zones'].length; i++) {
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
          // each zone gets a onclick function, where the zone selection is handled
          for (var j = 0; j < data['Zones'][i]['Geometry']['Coordinates'].length; j++) {
            geoZone.features[i].geometry.coordinates[0].push([data['Zones'][i]['Geometry']['Coordinates'][j][1], data['Zones'][i]['Geometry']['Coordinates'][j][0]])
          }
          // the geoZone gets converted into a GeoJSON feature layer
          this.layer = L.geoJson(geoZone)
          // onclick function for every zone
            .on('click', function (e) {
              processClick(e.latlng.lat, e.latlng.lng)
            })
            .addTo(this.map)
        };
      })
    }
  }
});

// function for handling the drawing of polygons on the map
function startEditing(map){
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  L.Draw.Polygon = L.Draw.Polyline.extend({
  	statics: {
  		TYPE: 'polygon'
  	},

  	Poly: L.Polygon,

  	options: {
  		showArea: false,
  		shapeOptions: {
  			stroke: true,
  			color: '#f06eaa',
  			weight: 4,
  			opacity: 0.5,
  			fill: true,
  			fillColor: null, //same as color by default
  			fillOpacity: 0.2,
  			clickable: true
  		}
  	},

  	initialize: function (map, options) {
  		L.Draw.Polyline.prototype.initialize.call(this, map, options);

  		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
  		this.type = L.Draw.Polygon.TYPE;
  	},

  	_updateFinishHandler: function () {
  		var markerCount = this._markers.length;

  		// The first marker should have a click handler to close the polygon
  		if (markerCount === 1) {
  			this._markers[0].on('click', this._finishShape, this);
  		}

  		// Add and update the double click handler
  		if (markerCount > 2) {
  			this._markers[markerCount - 1].on('dblclick', this._finishShape, this);
  			// Only need to remove handler if has been added before
  			if (markerCount > 3) {
  				this._markers[markerCount - 2].off('dblclick', this._finishShape, this);
  			}
  		}
  	},

  	_getTooltipText: function () {
  		var text, subtext;

  		if (this._markers.length === 0) {
  			text = L.drawLocal.draw.handlers.polygon.tooltip.start;
  		} else if (this._markers.length < 3) {
  			text = L.drawLocal.draw.handlers.polygon.tooltip.cont;
  		} else {
  			text = L.drawLocal.draw.handlers.polygon.tooltip.end;
  			subtext = this._getMeasurementString();
  		}

  		return {
  			text: text,
  			subtext: subtext
  		};
  	},

  	_getMeasurementString: function () {
  		var area = this._area;

  		if (!area) {
  			return null;
  		}

  		return L.GeometryUtil.readableArea(area, this.options.metric);
  	},

  	_shapeIsValid: function () {
  		return this._markers.length >= 3;
  	},

  	_vertexChanged: function (latlng, added) {
  		var latLngs;

  		// Check to see if we should show the area
  		if (!this.options.allowIntersection && this.options.showArea) {
  			latLngs = this._poly.getLatLngs();

  			this._area = L.GeometryUtil.geodesicArea(latLngs);
  		}

  		L.Draw.Polyline.prototype._vertexChanged.call(this, latlng, added);
  	},

  	_cleanUpShape: function () {
  		var markerCount = this._markers.length;

  		if (markerCount > 0) {
  			this._markers[0].off('click', this._finishShape, this);

  			if (markerCount > 2) {
  				this._markers[markerCount - 1].off('dblclick', this._finishShape, this);
  			}
  		}
  	}
  });

  L.DrawToolbar.include({
      getModeHandlers: function (map) {
          return [ {
              enabled: true,
              handler: new L.Draw.Polygon(map, this.options.polygon),
              title: 'Draw a Polygon',
  			id: 'drawP'
          }];
      }
  });
  // control element
  var drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {

          polygon: {
              allowIntersection: false,
              showArea: true,
              drawError: {
                  color: '#b00b00',
                  timeout: 1000
              },
              shapeOptions: {
                  stroke: true,
                  color: '#f06eaa',
                  weight: 4,
                  opacity: 0.5,
                  fill: true,
                  fillColor: null, //same as color by default
                  fillOpacity: 0.2,
                  clickable: false
              }
          }
      },
      edit: {
          featureGroup: drawnItems
      }
  });

  map.addControl(drawControl);

  map.on('draw:created', function (e) {
      var type = e.layerType,
          layer = e.layer;

      if (type === 'polygon') {
  	coordinates =[];
  	LatLongs = layer.getLatLngs();
  	for (i=0;i<LatLongs.length;i++){
  		coordinates.push([LatLongs[i].lat, LatLongs[i].lng]);
      }
  	document.getElementById("area").value= coordinates;
  }
      // Do whatever else you need to. (save to db, add to map etc)
      drawnItems.addLayer(layer);
  });

  map.on('draw:edited', function () {
      // Update db to save latest changes.
  });

  map.on('draw:deleted', function () {
  	delete(layer)
      // Update db to save latest changes.
  });
}

// function for processing clicks on zones on the map and handling overlapping zones
function processClick(lat, lng) {
  var info = '';
  var point = [lng, lat];
  var match = leafletPip.pointInLayer(point, mapVue.layer, false);
  // if there are overlapping zones, they get shown in a popup and become clickable
  if (match.length > 1) {
    info = "<h5 style='color:blue'><b> Choose one zone:</b> </h5> <ul>";
    for (var i = 0; i < match.length; i++) {
      id = match[i].feature.properties.zoneid;
      name = match[i].feature.properties.name;
      info +=
      "<li style='margin-left: -20px'><b><a style='cursor: pointer; color: orange' onclick='dispatchZoneID(\"" + id + "\")();'>"+ name + "</a></b></li>"
    }
    info += "</ul>"
  }
  else {
        dispatchZoneID(match[0].feature.properties.zoneid)();
  }

  if (info) {
    mapVue.map.openPopup(info, [lat, lng]);
  }
};
// function for triggering zone selection change
function dispatchZoneID(id) {
  return function () {
    mapVue.$dispatch('switchZone', id)
  }
};
