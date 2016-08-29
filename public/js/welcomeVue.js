/* Vue  component for the welcome dialog */
Vue.component('welcome', {
    template: '#welcome-template'
});

/* create a new Vue instance and mount it to our div element above with the id of welcome */
var vmWelcome = new Vue({
    el: '#welcome',
    parent: vue_broadcaster,
    data: {
        state: true
    },
    events: {
      /* event which triggers the display of the welcome Vue depending on the broadcasted "state" param*/
      'switchState': function (state) {
        if (state == "welcome"){
          this.state = true;
        }
        else{
          this.state = false;
        }
      }
    }
});
