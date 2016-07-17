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
        messages: [],
        daily_activity: [],
        state: false,
        active_topic: null,
        chart: null
    },
    ready: function () {
        this.generateChart()
    },
    events: {
        switchZone: function (id) {
            this.$dispatch('switchState', 'zone');
            this.getZone(id);
            this.getMessages(id);
            this.getDailyActivity(id);
            this.$set('active_topic', null);
        },
        switchState: function (state) {
            if (state == "zone") {
                this.state = true;
            }
            else {
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
        toggleTopic(topic){
          if (this.active_topic != topic){
            this.$set('active_topic', topic);
          }
          else{
            this.$set('active_topic', null);
          }
        },
        getDailyActivity: function (id) {
            this.$http.get('/api/zones/' + id + '/dailyactivity', function (data) {
                this.$set('daily_activity', data);
                this.chart.data.datasets[0].data = this.daily_activity;
                this.chart.update()
            });
        },
        generateChart: function () {
            var ctx = $("#zoneChart");
            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
                    datasets: [{
                        backgroundColor: "#608FFC",
                        data: [],
                    }]
                },
                options: {
                    legend:{
                      display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }],
                        xAxes: [{
                          categoryPercentage:0.95,
                          barPercentage: 1,
                          gridLines:{
                            offsetGridLines:true
                          }
                        }]

                    }
                }
            });

        }
    }
});
