/* Vue component for add-zone-functionality */
Vue.component('addzone', {
	template: '#add-zone-template',
	ready: function () {
		/* adjustments for the calendar */
		$("#duration").datetimepicker(
		);
	},
	methods: {
		/* swtiches to welcome Vue component */
		cancel: function() {
			this.$dispatch('switchState', 'welcome')
		},
		/* deletes all topics that have been added to an array */
		reset: function() {
			while (vmAddZone.$data.topics.length > 0){
				vmAddZone.$data.topics.pop();
			}
			$("#topicPreview").text(vmAddZone.$data.topics.join("  "));
		},
		/* add topic functionality */
		addTopic: function () {
			vmAddZone.$data.topics.push(this.topicmodel);
			$("#topicPreview").text(vmAddZone.$data.topics.join("  "));
			$("#topics").val('');
		},
		/* delete topic functionality */
		deleteTopic: function () {
			vmAddZone.$data.topics.pop();
			$("#topicPreview").text(vmAddZone.$data.topics.join("  "));
		},
		/* 
		 * submit button functionality, 
		 * add all submitted data to the request,
		 * submit a json containing the data to the database,
		 * reload main page with new added zone
		 */
		submitzone: function () {
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

/* create a new Vue instance and mount it to the DOM element with the id 'addzone' */
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
		/* event which triggers the display of the addZone Vue depending on the broadcasted "state" param*/
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
