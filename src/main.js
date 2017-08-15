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
// [type:'warn'] 1:warn, 2:success, 3:cancel, 4:text
Vue.prototype.toast = function (content, type, position, cb) {
  const _this = this
  switch (type) {
    case 1:
      type = 'warn'
      break
    case 2:
      type = 'success'
      break
    case 3:
      type = 'cancel'
      break
    case 4:
      type = 'text'
      break
    default:
      type = 'success'
  }
  _this.$vux.toast.show({
    text: content || 'something',
    time: 2000,
    type: type,
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
// 自定义跳转指令(eg: v-jump="[pathName,paramArr,type]" ,[param是个参数名的数组];[type=2] 1:'path'2:'name',3:'query')
Vue.directive('jump', {
  // el: 指令绑定的元素
  // vm: 拥有该指令的上下文 ViewModel
  // expression: 指令的表达式，不包括参数和过滤器
  // arg: 指令的参数
  // raw: 未被解析的原始表达式
  // name: 不带前缀的指令名
  bind: function (el, binding, vnode) {
    // 做绑定的准备工作（比如添加事件监听器，或是其他只需要执行一次的复杂操作）
    // console.log(arguments)
    let data = binding.value || null
    if (data) {
      let vm = vnode.context
      let pathName = data[0] || null
      let paramArr = data[1] || null
      let type = data[2] || 'name'
      let param = null
      if (paramArr && paramArr.length) {
        param = {}
        for (let i = 0; i < paramArr.length; i++) {
          param[paramArr[i]] = el.getAttribute('data-' + paramArr[i])
        }
      }
      // console.log(pathName, param, type)
      // console.info(param, 'v-jump中的param')
      el.addEventListener('click', function () {
        if (pathName) {
          if (type === 1) {
            // path类型单独处理参数格式
            if (param) {
              var str = []
              for (let j in param) {
                param[j] ? str.push(param[j]) : null
              }
            }
            vm.$router.push({path: '/' + pathName + (param ? '/' + str.join('/') : '')})
          }
          if (type === 2) {
            vm.$router.push({name: pathName, params: param || ''})
          }
          if (type === 3) {
            vm.$router.push({path: '/' + pathName, query: param || ''})
          }
        } else {
          console.warn('好歹给个pathName啊！')
        }
      })
    } else {
      console.warn('v-jump似乎还需要点什么！')
    }
  },
  update: function (newValue, oldValue) {
    // 根据获得的新值执行对应的更新（对于初始值也会被调用一次）
  },
  unbind: function () {
    // 做清理工作（比如移除在 bind() 中添加的事件监听器）
    //
  }
})

/* ----- 封装一些过滤器 -------- */
/* 优惠券类型 */
Vue.filter('couponType', function (type) {
  switch (type) {
    case 1:
      return '优惠券'
    case 2:
      return '水票券'
    case 3:
      return '红包'
    case 4:
      return '其它'
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
