Vue.component('addzone', {
    template: '#add-zone-template'
});

// create a new Vue instance and mount it to our div element above with the id of info
var vm = new Vue({
    el: '#addzone',
    parent: vue_broadcaster,
    data: {
        state: false
    },
    events: {
        'switchVue': function () {
            this.state = !this.state; 
        }
    }
});
