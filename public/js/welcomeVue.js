Vue.component('welcome', {
    template: '#welcome-template',
    methods: {
        initView: function() {
            this.$dispatch('initView');
        }
    }
});

// create a new Vue instance and mount it to our div element above with the id of welcome
var vmWelcome = new Vue({
    el: '#welcome',
    parent: vue_broadcaster,
    data: {
        state: true
    },
    events: {
        initView: function(){
            this.state = !this.state;
            this.$dispatch('init');
            
 
        }
    }
});
