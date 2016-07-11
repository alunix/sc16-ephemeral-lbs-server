var vue_broadcaster = new Vue({
  events:{
    'zoneSelected': function(zoneid){
      console.log("broadcasted: zoneSelected");
      this.$broadcast('switchZone', zoneid);
    },
    'togglebtn': function(){
      console.log("broadcasted: togglebtn clicked");
      this.$broadcast('switchVue');
    },
    'init': function(){
      console.log("broadcasted: init");
      this.$broadcast('firstInit');
  }
}});
