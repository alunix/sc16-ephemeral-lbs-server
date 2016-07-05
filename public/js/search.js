  new Vue({
      parent: vue_broadcaster,
      el: '#search',
      data: {
          search: '',
          result:[],
          state: false
      },
      watch:{
        'search': function(val, oldVal){
          this.searchZone(val);
        }
      },
      events:{
          'firstInit': function(){
            this.state = true;
        }
      },
      methods: {
          searchZone: function(input) {
            if (input != ''){
              this.$http.get('/api/zones-search?q='+input, function(data) {
                  this.$set('result', data);
              });
          }}
      }
  });
