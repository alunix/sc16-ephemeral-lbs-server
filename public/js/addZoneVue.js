console.log("addZoneVue loaded");
Vue.component('addzone', {
	template: '#add-zone-template',
	methods: {
		addtopic: function () {
			vmAddZone.$data.Topics.push(this.topicmodel);
			console.log("Topic added");
			document.getElementById("topics").value='';
		},
//		testdata: function () {
//			parsedjson = JSON.parse(jsonstring);
//			toFloat = parseFloat(this.coordinatesmodel);
//			parsedjson.Geometry.Coordinates.push(toFloat);
//			console.log(toFloat),
//		//	console.log(parsedjson.Geometry.Coordinates);
//			console.log(JSON.stringify(parsedjson));
//		},
		submitzone: function () {
			for (i = 0; i < coordinates.length; i++) {
				vmAddZone.$data.Geometry.Coordinates.push(coordinates[i]);
			}
			;
			vmAddZone.$data.Name = this.Name;
			vmAddZone.$data.Geometry.Coordinates.push(coordinates[0]);
			delete vmAddZone.$data.state;
			jsonstring = JSON.stringify(vmAddZone.$data);
			console.log(jsonstring);
	$.post("/api/addzone",jsonstring);
	$.ajax({
    type: "POST",
    url: "/api/addzone",
    data: jsonstring,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data){alert(data);},
    failure: function(errMsg) {
        alert(errMsg);
    }
});
setTimeout(function(){
window.location.href= "/index.html";
}, 500);

		}
	}
});

// create a new Vue instance and mount it to our div element above with the id of info
var vmAddZone = new Vue({
	el: '#addzone',
	parent: vue_broadcaster,
	data: {
		state: false,
		Geometry: {
			Type: "Polygon",
			Coordinates: []
		},
		Name: '',
		'Zone-id': '',
		'Expired-at': "2016-09-30T00:00:00.881Z",
		//timeinput: '',
		Topics: []
	},
	events: {
		'switchVue': function () {
			this.state = !this.state;
		}
	}
});
