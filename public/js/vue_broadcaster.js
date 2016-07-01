var vue_broadcaster = new Vue({
  events:{
    'zoneSelected': function(zoneid){
      console.log("broadcasted!");
      this.$broadcast('switchZone', zoneid);
    }
  }
});
