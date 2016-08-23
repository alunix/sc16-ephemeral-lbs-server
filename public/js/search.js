/* Vue  component for the search */
Vue.component('searchresult', {
    template: '#search-result-template',
    props: ['name', 'id', 'topics'],
    methods:{
      selectZone: function(){
        this.$dispatch('switchZone', this.id)
      }
    }
});

var searchVue = new Vue({
      parent: vue_broadcaster,
      el: '#search',
      data: {
          search: '',
          result:[],
          state: false
      },
      watch:{
        search: function(val, oldVal){
          this.searchZone(val);
        }
      },
      events:{
        switchState: function (state) {
          if (state == "search"){
            this.state = true;
          }
          else{
            this.state = false;
          }
        }
      },
      methods: {
          searchZone: function(input) {
            if (input != ''){
              this.$http.get('/api/zones-search?q='+input, function(data) {
                  this.$set('result', data);
              });
              if(!this.state){
                this.$dispatch('switchState', 'search')
              }
            }
            else{
              this.$dispatch('switchState', 'welcome')

            }
        }
      }
  });
