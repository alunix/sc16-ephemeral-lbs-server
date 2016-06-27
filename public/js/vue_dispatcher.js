var vue_dispatcher = new Vue({
  events:{
    'zoneSelected': function(zoneid){
      this.$broadcast('switchZone', zoneid);
    }

  }
});
