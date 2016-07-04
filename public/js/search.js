  new Vue({
      parent: vue_broadcaster,
      el: '#search',
      data: {
          search: '',
          result:[]
      },
      watch:{
        'search': function(val, oldVal){
          this.searchZone(val);
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
