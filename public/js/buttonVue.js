var vm = new Vue({
    el: '#togglebtn',
    parent: vue_broadcaster,
    data: {
    },
    methods: {
        switchView: function(){
            this.$dispatch('togglebtn');
        }
    }
});