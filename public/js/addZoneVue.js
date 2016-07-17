//Vue component for add-zone-functionality
Vue.component('addzone', {
	template: '#add-zone-template',
	ready: function () {
		// adjustments for the calendar go here
		$("#duration").datetimepicker(
		);
	},
	methods: {
		cancel: function() {
			this.$dispatch('switchState', 'welcome')
		},
		reset: function() {
			while (vmAddZone.$data.topics.length > 0){
				vmAddZone.$data.topics.pop();
			}
			$("#topicPreview").text(vmAddZone.$data.topics.join("  "));
		},
		//add topic button functionality
		addTopic: function () {
			vmAddZone.$data.topics.push(this.topicmodel);
			$("#topicPreview").text(vmAddZone.$data.topics.join("  "));
			$("#topics").val('');
		},
		//delete topic button functionality
		deleteTopic: function () {
			vmAddZone.$data.topics.pop();
			$("#topicPreview").text(vmAddZone.$data.topics.join("  "));
		},
		//submit button functionality
		submitzone: function () {
			//adding all submitted data to the request
			for (i = 0; i < coordinates.length; i++) {
				vmAddZone.$data.Geometry.Coordinates.push(coordinates[i])
			};
			vmAddZone.$data.Geometry.Coordinates.push(coordinates[0]);
			vmAddZone.$data.name = this.name;
			vmAddZone.$data.datetime = this.datemodel;
			var d = new Date(vmAddZone.$data.datetime);
			var zone = {
				'Geometry': {
					'Type': "Polygon",
					'Coordinates': []
				},
				'Name': "",
				'Expired-at': "",
				'Topics': []
			};
			zone.Geometry.Coordinates = vmAddZone.$data.Geometry.Coordinates;
			zone.Name = vmAddZone.$data.name;
			zone['Expired-at'] = d.toJSON();
			zone.Topics = vmAddZone.$data.topics;
			jsonstring = JSON.stringify(zone);
			// this.$http.post('api/addzone'), jsonstring, function(data) {}
			//ajax POST request
			$.ajax({
				type: "POST",
				url: "/api/addzone",
				data: jsonstring,
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function (data) {
					console.log("zone added!")
				},
				failure: function (errMsg) {
					alert(errMsg);
				}
			});
			setTimeout(function () {
				window.location.href = "/index.html";
			}, 500);

		}
	}
});

// create a new Vue instance and mount it to the DOM element with the id 'addzone'
var vmAddZone = new Vue({
	el: '#addzone',
	parent: vue_broadcaster,
	data: {
		model: {
			twoWay: true
		},
		state: false,
		Geometry: {
			Type: "Polygon",
			Coordinates: []
		},
		'name': '',
		'topics': [],
		'zoneid': '',
	},
	events: {
		'switchState': function (state) {
			if (state == "addzone") {
				this.state = true;
			}
			else {
				this.state = false;
			}
		}
	}
});
