var vue_broadcaster = new Vue({
  events:{
    switchZone: function(zoneid){
      console.log("broadcasted: zoneSelected");
      this.$broadcast('switchZone', zoneid);
    },
    switchState: function(state){
      console.log("broadcasted: switchState "+ state);
      this.$broadcast('switchState', state);
    }
}});
