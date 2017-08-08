// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable no-new,no-unused-vars */
import Vue from 'vue'
import Axios from 'axios'
import App from './App'
import router from './router'
import 'font-awesome/css/font-awesome.css'
import 'ionicons/dist/css/ionicons.css'
import $ from 'jquery'
import '../static/js/fastclick.js'
import 'myMixin'
import store from './store3/'
import VueScroller from 'vue-scroller'
import {AlertPlugin, ConfirmPlugin, ToastPlugin, LoadingPlugin} from 'vux'
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.config.productionTip = false
Vue.use(VueScroller)
/* 封装ajax请求 */
Vue.prototype.$axios = Axios
Vue.prototype.loadData = function (url, params, type, sucCb, errCb) {
  /* $.post(url, {'requestapp': params ? JSON.stringify(params) : '{}'},
   function (res) {
   if (res.success) {
   sucCb ? sucCb(res) : console.log(res, '接口的res')
   } else {
   errCb ? errCb(res) : console.error('请求失败！')
   }
   }
   ) */
  /* Axios.post(url, {'requestapp': '{}'}).then(function (res) {
   sucCb ? sucCb(res) : console.log(res, '接口的res')
   }).catch(function (error) {
   errCb ? errCb(error) : console.error(error, '错误信息')
   }) */
  Axios({
    method: type || 'POST',
    url: url,
    data: {'requestapp': params ? JSON.stringify(params) : '{}'},
    responseType: 'JSON'
  }).then(function (res) {
    sucCb ? sucCb(res) : console.log(res, '接口的res')
  }).catch(function (error) {
    errCb ? errCb(error) : console.error(error, '错误信息')
  })
}
/* 封装alert */
Vue.prototype.alert = function (title, content, showCb, hideCb) {
  const _this = this
  _this.$vux.alert.show({
    title: title || '',
    content: content || '',
    onShow () {
      showCb ? showCb() : null
    },
    onHide () {
      hideCb ? hideCb() : null
    }
  })
}
/* 封装confirm */
Vue.prototype.confirm = function (title, content, confirmCb, cancelCb) {
  const _this = this
  _this.$vux.confirm.show({
    theme: 'ios',
    title: title || '',
    content: content || '',
    onCancel () {
      cancelCb ? cancelCb() : null
    },
    onConfirm () {
      confirmCb ? confirmCb() : null
    },
    onShow () {
    },
    onHide () {
    }
  })
}
/* 封装toast */
Vue.prototype.toast = function (content, position, cb) {
  const _this = this
  _this.$vux.toast.show({
    text: content || 'something',
    time: 2000,
    position: position || 'top'
  })
  cb ? cb() : null
  // _this.$vux.toast.text('hello', 'top')
}
/* 封装loading */
Vue.prototype.loading = function (content, isClose, cb, timeCb) {
  const _this = this
  if (isClose) {
    _this.$vux.loading.hide()
    return false
  } else {
    _this.$vux.loading.show({
      text: content || '努力中…'
    })
    cb ? cb() : null
    setTimeout(function () {
      _this.$vux.loading.hide()
      timeCb ? timeCb() : null
    }, 2000)
  }
}

const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
router.beforeEach(function (to, from, next) {
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)
  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('UPDATE_DIRECTION', {direction: 'forward'})
    } else {
      store.commit('UPDATE_DIRECTION', {direction: 'reverse'})
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('UPDATE_DIRECTION', {direction: 'forward'})
  }
  next()
})

// main.js
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
})
