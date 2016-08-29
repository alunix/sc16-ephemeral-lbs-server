/* parent Vue responsible for communication between different child Vues*/
var vue_broadcaster = new Vue({
  events:{
    /* event fired when switchZone dispatch occured on child Vue */
    switchZone: function(zoneid){
      /* trigger switchZone event on appropriate child Vues */
      this.$broadcast('switchZone', zoneid);
    },
    /* event fired when switchState dispatch occured on child Vue */
    switchState: function(state){
      /* trigger switchState event on appropriate child Vues */
      this.$broadcast('switchState', state);
    }
}});
