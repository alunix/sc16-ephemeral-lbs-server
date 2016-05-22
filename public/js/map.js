// Create map
var mymap = L.map('mapid').setView([51.959, 7.623], 14);
var polygon;

// Add layer to map
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

function displayZones() {
	$.ajax({
		url: '/api/zones',
		type: 'get',
		dataType: 'json',
		success: function (data) {
			for (var i = 0; i < data['Zones'].length; i++) {

				polygon = L.polygon([
					data['Zones'][i]['Geometry']['Coordinates']
				]).addTo(mymap);
				polygon.bindPopup(data['Zones'][i]['Properties']['Name']);
				polygon.on('mouseover', function () {
					this.openPopup();
				});
				polygon.on('mouseout', function () {
					this.closePopup();
				});
			}
		}
	});
}

