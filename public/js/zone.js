new Vue({
    parent: vue_broadcaster,
    el: '#zonearea',
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
        labels:[1,5,1,1,1,1,3,0,0,0,3,0,2,1,0,2,0,0,1,1,1,2,0,3],
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
