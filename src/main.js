// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable no-new,no-unused-vars */
import Vue from 'vue'
import Axios from 'axios'
import Router from 'vue-router'
// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
import App from './App'
import router from './router'
import $ from 'jquery'
import '../static/js/fastclick.js'
import 'myMixin'
// Vue.use(MintUI)
Vue.prototype.$axios = Axios
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
  mounted () {
    // console.log(Axios)
    /* this.$axios.get('/user', {
      params: {
        ID: 12345
      }
    }).then(function (response) {
      console.log(response)
    }).catch(function (error) {
      console.log(error)
    })
    this.$axios.post('/user', {
      firstName: 'Fred',
      lastName: 'Flintstone'
    }).then(function (response) {
      console.log(response)
    }).catch(function (error) {
      console.log(error)
    }) */
  }
})
