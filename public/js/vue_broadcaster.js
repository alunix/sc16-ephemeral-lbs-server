var vue_broadcaster = new Vue({
  events:{
    'zoneSelected': function(zoneid){
      this.$broadcast('switchZone', zoneid);
    }

  }
});
