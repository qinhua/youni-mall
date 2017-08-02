// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable no-new,no-unused-vars */
import Vue from 'vue'
import Axios from 'axios'
import Router from 'vue-router'
import App from './App'
import router from './router'
import $ from 'jquery'
import '../static/js/fastclick.js'
import 'myMixin'
// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
// Vue.use(MintUI)

Vue.config.productionTip = false

/* 封装&扩展Vue */
Vue.prototype.$axios = Axios
Vue.prototype.loadData = function (url, params, type, sucCb, errCb) {
  Axios({
    method: type || 'get',
    url: url,
    responseType: 'JSON'
  }).then(function (response) {
    sucCb ? sucCb(response) : console.log(response, '首页bannerXXXX')
  }).catch(function (error) {
    errCb ? errCb(error) : console.log(error, 522)
  })
}

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
  mounted () {
    // console.log(XXX)
    // GET
    /* this.$axios.get('/user', {
     params: {
     ID: 12345
     }
     }).then(function (response) {
     console.log(response)
     }).catch(function (error) {
     console.log(error)
     })
     // POST
     this.$axios.post('/user', {
     firstName: 'Fred',
     lastName: 'Flintstone'
     }).then(function (response) {
     console.log(response)
     }).catch(function (error) {
     console.log(error)
     })
     // 多个
     function getUserAccount() {
     return axios.get('/user/12345');
     }
     function getUserPermissions() {
     return axios.get('/user/12345/permissions');
     }
     axios.all([getUserAccount(), getUserPermissions()])
     .then(axios.spread(function (acct, perms) {
     // Both requests are now complete
     }));
     */
  }
})
