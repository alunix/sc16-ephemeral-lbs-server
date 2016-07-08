console.log("addZoneVue loaded")
Vue.component('addzone', {
    template: '#add-zone-template',
	methods: {
	submitzone: function () {
//submitButton = document.getElementById("submitZone");
//submitButton.onclick = function () {

	var jsonstring = JSON.stringify(this.$data);
	console.log(jsonstring);
	console.log(this.$data);
	console.log("zone submitted");
//	$.post("/api/addzone",jsonstring);
//	$.ajax({
//    type: "POST",
//    url: "/api/addzone",
//    data: jsonstring,
//    contentType: "application/json; charset=utf-8",
//    dataType: "json",
//    success: function(data){alert(data);},
//    failure: function(errMsg) {
//        alert(errMsg);
//    }
//});
}
	}
});

// create a new Vue instance and mount it to our div element above with the id of info
var vm = new Vue({
    el: '#addzone',
    parent: vue_broadcaster,
    data: {
        state: false,
		Geometry: {
			Type: "Polygon",
			Coordinates: []//[52.00094684771797,7.474822998046875],[51.94511140570431,7.3828125],[51.90869633027845,7.466583251953125],[52.00094684771797,7.474822998046875]
		},
		Name: '',
	   'Zone-id':'', 
	   'Expired-at': "2016-09-30T00:00:00.881Z",
		//timeinput: '',
		Topics: []
    },
    events: {
        'switchVue': function () {
            this.state = !this.state; 
        }
    },
	methods: {
	submitzone: function () {
//submitButton = document.getElementById("submitZone");
//submitButton.onclick = function () {

	var jsonstring = JSON.stringify(this.$data);
	console.log(jsonstring);
	console.log(this.$data);
	console.log("zone submitted");
//	$.post("/api/addzone",jsonstring);
//	$.ajax({
//    type: "POST",
//    url: "/api/addzone",
//    data: jsonstring,
//    contentType: "application/json; charset=utf-8",
//    dataType: "json",
//    success: function(data){alert(data);},
//    failure: function(errMsg) {
//        alert(errMsg);
//    }
//});
}
	}
});
