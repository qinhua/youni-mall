// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable no-new,no-unused-vars */
import Vue from 'vue'
import Axios from 'axios'
import App from './App'
import router from './router'
import 'font-awesome/css/font-awesome.css'
import 'ionicons/dist/css/ionicons.css'
// import $ from 'jquery'
import '../static/js/fastclick.js'
import 'myMixin'
import store from './vuex-store'
import VueScroller from 'vue-scroller'
import {AlertPlugin, ConfirmPlugin, ToastPlugin, LoadingPlugin} from 'vux'
Vue.use(require('vue-wechat-title'))
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(VueScroller)

Vue.config.productionTip = false
let me = window.me

// 在路由路由跳转前判断一些东西
router.beforeEach((to, from, next) => {
  /* 判断页面的方向 */
  /* const history = window.sessionStorage
  history.clear()
  let historyCount = history.getItem('count') * 1 || 0
  history.setItem('/', 0)
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
  } */
  /* 判断是否已经授权过 */
  console.log(store.state, '当前vuex中的data')
  if (to.path === '/author') {
    console.profile('in auth page')
    if (!store.state.global.userInfo.id && !me.locals.get('ynWxUser')) {
      console.profile('in auth page and (no id)')
      next()
    } else {
      console.profile('in auth page and (id)')
      return next('/home')
    }
  } else {
    console.profile('not in auth page')
    if (!store.state.global.userInfo.id && !me.locals.get('ynWxUser')) {
      console.profile('not in auth page and (no id)')
      me.locals.set('beforeLoginUrl', to.fullPath) // 保存用户进入的url
      return next('/author')
    } else {
      console.profile('not in auth page and (id)')
      next()
    }
  }
})

/* ----- 封装一些方法 -------- */
/* ajax请求 */
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
/* alert */
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
/* confirm */
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
/* toast */
Vue.prototype.toast = function (content, position, cb) {
  const _this = this
  _this.$vux.toast.show({
    text: content || 'something',
    time: 2000,
    position: position || 'center'
  })
  cb ? cb() : null
  // _this.$vux.toast.text('hello', 'top')
}
/* loading */
Vue.prototype.processing = function (content, isClose, cb, timeCb) {
  let _this = this
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
/* ----- 封装一些指令 -------- */
Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = binding.value
  }
})
// main.js
new Vue({
  el: '#app',
  router,
  store,
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
