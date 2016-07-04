new Vue({
    parent: vue_broadcaster,
    el: '#chartarea',
    data: {
        zone: {}
    },
    events:{
      'switchZone': function(id){
        console.log('switchZone'+ id)
        this.getZone(id);
      }
    },
    methods: {
        getZone: function(id) {
            this.$http.get('/api/zones/'+id, function(data) {
                this.$set('zone', data);
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
