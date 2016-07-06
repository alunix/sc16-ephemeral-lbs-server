var vm = new Vue({
    el: '#togglebtn',
    parent: vue_broadcaster,
    data: {
        state: false,
        active: false,
        zoneText: 'Add zone',
        infoText: 'Show info'
    },
    events: {
        'firstInit': function () {
            this.state = true;
        }
    },
    methods: {
        switchView: function () {
            this.$dispatch('togglebtn');
        },
        clicked: function () {
             this.active = !this.active;
        },
        call: function() {
            this.switchView();
            this.clicked();
        }
    }
});