var vue_broadcaster = new Vue({
  events:{
    switchZone: function(zoneid){
      this.$broadcast('switchZone', zoneid);
    },
    switchState: function(state){
      this.$broadcast('switchState', state);
    }
}});
