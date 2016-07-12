Vue.component('zoneinfo', {
    template: '#zone-info-template',
    props: ['name', 'expire', 'topic']
});
Vue.component('messageinfo', {
    template: '#message-info-template',
    props: ['title', 'message', 'topic']
});

// create a new Vue instance and mount it to our div element above with the id of info
var vm = new Vue({
    el: '#zonearea',
    parent: vue_broadcaster,
    data: {
        zone: null,
        messages:  [],
        daily_activity: [],
        state: false
    },
    events: {
        switchZone: function (id) {
            this.$dispatch('switchState', 'zone');
            this.getZone(id);
            this.getMessages(id);
            this.getDailyActivity(id);
        },
        switchState: function (state) {
    			if (state == "zone"){
    				this.state = true;
    			}
    			else{
    				this.state = false;
    			}
    		}
    },
    methods: {
        getZone: function (id) {
            this.$http.get('/api/zones/' + id, function (data) {
                this.$set('zone', data);

            });
        },
        getMessages: function (id) {
            this.$http.get('/api/messages?zone=' + id, function (data) {
                this.$set('messages', data['Messages']);
            });
        },
        getDailyActivity: function(id){
          this.$http.get('/api/zones/'+id+'/dailyactivity', function (data) {
              this.$set('daily_activity', data);
          });
        }
    }
});


var ctx = document.getElementById("zoneChart");
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
        datasets: [{

            backgroundColor: "rgba(255,99,132,1)",
            data: [1,5,1,1,1,1,3,0,0,0,3,0,2,1,0,2,0,0,1,1,1,2,0,3],
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
