// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable no-new,no-unused-vars */
import Vue from 'vue';
import Axios from 'axios';
import Router from 'vue-router';
import App from './App';
import router from './router';
import 'font-awesome/css/font-awesome.css';
import 'ionicons/dist/css/ionicons.css';
import $ from 'jquery';
import '../static/js/fastclick.js';
import 'myMixin';
import store from './store3/';
import VueScroller from 'vue-scroller';

Vue.config.productionTip = false;
Vue.use(VueScroller);
/* 封装&扩展Vue */
Vue.prototype.$axios = Axios;
Vue.prototype.loadData = function (url, params, type, sucCb, errCb) {
  Axios({
    method: type || 'POST',
    url: url,
    data: params || {},
    responseType: 'JSON'
  }).then(function (res) {
    sucCb ? sucCb(res) : console.log(res, '接口的res');
  }).catch(function (error) {
    errCb ? errCb(error) : console.error(error, '错误信息');
  });
};

// main.js
var history = window.sessionStorage;
history.clear();
var historyCount = history.getItem('count') * 1 || 0;
history.setItem('/', 0);
router.beforeEach(function (to, from, next) {
  var toIndex = history.getItem(to.path);
  var fromIndex = history.getItem(from.path);
  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || toIndex === '0' && fromIndex === '0') {
      store.commit('UPDATE_DIRECTION', { direction: 'forward' });
    } else {
      store.commit('UPDATE_DIRECTION', { direction: 'reverse' });
    }
  } else {
    ++historyCount;
    history.setItem('count', historyCount);
    to.path !== '/' && history.setItem(to.path, historyCount);
    store.commit('UPDATE_DIRECTION', { direction: 'forward' });
  }
  next();
});

// main.js
new Vue({
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App: App },
  mounted: function mounted() {
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
     return axios.get('/user/12345')
     }
     function getUserPermissions() {
     return axios.get('/user/12345/permissions')
     }
     axios.all([getUserAccount(), getUserPermissions()])
     .then(axios.spread(function (acct, perms) {
     // Both requests are now complete
     }))
     */
  }
});

//# sourceMappingURL=main-compiled.js.map