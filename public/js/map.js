// Create map
var mymap = L.map('mapid').setView([51.959, 7.623], 14);

// Add layer to map
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);