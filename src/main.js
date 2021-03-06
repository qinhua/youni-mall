// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable no-new,no-unused-vars */
import Vue from 'vue'
import Axios from 'axios'
import App from './App'
import router from './router'
import 'font-awesome/css/font-awesome.css'
import 'ionicons/dist/css/ionicons.css'
import 'weui/dist/style/weui.min.css'
import weui from '../static/js/weui.js'
import $ from 'jquery'
import throttle from 'lodash.throttle'
import '../static/js/sign.js'
import 'myMixin'
import store from './store'
import VueScroller from 'vue-scroller'
import Lazyload from 'vue-lazyload'
import {AlertPlugin, ConfirmPlugin, ToastPlugin, LoadingPlugin} from 'vux'

const FastClick = require('fastclick')
FastClick.attach(document.body)
Vue.use(require('vue-wechat-title'))
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(VueScroller)
Vue.use(Lazyload, {
  preLoad: 1.3,
  error: './static/img/bg_nopic.jpg',
  loading: './static/svg/spinner.svg',
  attempt: 2
})
import {commonApi, userApi} from './service/main.js'

Vue.config.productionTip = false
let me = window.me
let vm
// 若是隐私模式提示关闭
if(me.isPrivacyMode()){
  alert('为了正常使用，请关闭隐私模式！')
}
// 在路由路由跳转前判断一些东西
router.beforeEach((to, from, next) => {
  // console.log(store.state, '当前vuex中的data')
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

  /* 判断授权是否存在或过期(页面刷新就会触发过期检查，不包含切换账号后的检查) */
  if (store.state.global.expired) {
    var localAuth = me.locals.get('ynWxUser') ? JSON.parse(me.locals.get('ynWxUser')) : null
    if (to.path === '/author') {
      if (localAuth) {
        /* 检查本地token是否过期(7天保质期) */
        if (me.getDiffDay(localAuth.timeStamp) > 7) {
          store.commit('storeData', {key: 'expired', data: true})
          console.profile('in auth page and (no id)')
          next()
        } else {
          window.youniMall.userAuth = localAuth.data
          store.commit('storeData', {key: 'wxInfo', data: localAuth.data})
          store.commit('storeData', {key: 'expired', data: false})
          console.profile('in auth page and (id)')
          return next('/home')
        }
      } else {
        console.profile('in auth page and (no id)')
        next()
      }
    } else {
      if (localAuth) {
        /* 检查本地token是否过期(7天保质期) */
        if (me.getDiffDay(localAuth.timeStamp) > 7) {
          store.commit('storeData', {key: 'expired', data: true})
          console.profile('not in auth page and (no id)')
          me.locals.set('beforeLoginUrl', to.fullPath) // 保存用户进入的url
          return next('/author')
        } else {
          window.youniMall.userAuth = localAuth.data
          store.commit('storeData', {key: 'wxInfo', data: localAuth.data})
          store.commit('storeData', {key: 'expired', data: false})
          console.profile('not in auth page and (id)')
          next()
        }
      } else {
        console.profile('not in auth page and (no id)')
        me.locals.set('beforeLoginUrl', to.fullPath) // 保存用户进入的url
        return next('/author')
      }
    }
  } else {
    window.youniMall.userAuth = store.state.global.wxInfo ? store.state.global.wxInfo : (me.locals.get('ynWxUser') ? JSON.parse(me.locals.get('ynWxUser')).data : {})
    next()
  }
})

/* ----- 封装一些方法 -------- */
/* ajax请求 */
Vue.prototype.throttle = throttle
Vue.prototype.$axios = Axios
window.loadData = Vue.prototype.loadData = function (url, params, type, sucCb, errCb, noAuthInfo) {
  params = params || {}
  var winAuth = window.youniMall.userAuth || (me.locals.get('ynWxUser') ? JSON.parse(me.locals.get('ynWxUser')).data : null)
  if (!winAuth) {
    vm.$router.push({path: '/author'})
  }
  /* 【cur5656Geo-当前定位的位置信息，cur5656SelArea-用户选择的位置信息，cur5656Ips-当前定位的ip和城市】 */
  var localGeo = me.sessions.get('cur5656Geo') ? JSON.parse(me.sessions.get('cur5656Geo')) : {}
  var localUserSel = me.locals.get('cur5656Position') ? JSON.parse(me.locals.get('cur5656Position')) : {}
  var localIps = me.sessions.get('cur5656Ips') ? JSON.parse(me.sessions.get('cur5656Ips')) : {}
  var lastD = localUserSel.lng ? localUserSel : localGeo
  var localParams = {
    ip: localIps.cip || '',
    cityCode: lastD.cityCode || (localIps.cid || '100000'),
    lon: lastD.lng || '',
    lat: lastD.lat || '',
  }
  !noAuthInfo ? $.extend(params, winAuth) : null
  // console.log('%c'+JSON.stringify(params, null, 2), 'color:#fff;background:purple')
  setTimeout(function () {
    $.ajax({
      url: url + me.param(localParams, '?'),
      type: type || 'POST',
      data: {'requestapp': JSON.stringify(params ? params : {})},
      dataType: "JSON",
      cache: false,
      headers: {token: winAuth ? winAuth.openid : ''},
      success: function (res) {
        // 检测是否登录
        /*if (res.message.indexOf('登录') > -1) {
         vm.processing(0, 1)
         // vm.confirm('温馨提示','请先登录！',function(){
         vm.$router.push({path: '/login'})
         // })
         }*/
        try {
          sucCb ? sucCb(res) : console.log(res, '接口的res')
        } catch (e) {
          // console.log(e)
        }
      },
      error: function (res) {
        errCb ? errCb(res) : console.error('请求失败！')
      }
    });
    /*Axios({
     method: type || 'POST',
     url: url,
     data: {requestapp: params ? params : {}},
     responseType: 'JSON',
     cache: false,
     headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'token': window.youniMall.userAuth.openid}
     }).then(function (res) {
     sucCb ? sucCb(res) : console.log(res, '接口的res')
     }).catch(function (error) {
     errCb ? errCb(error) : console.error(error, '错误信息')
     })*/
  }, 0)
}
/* alert */
Vue.prototype.alert = function (title, content, showCb, hideCb) {
  const _this = this
  _this.$vux.alert.show({
    title: title || '',
    content: content || '',
    onShow() {
      showCb ? showCb() : null
    },
    onHide() {
      hideCb ? hideCb() : null
    }
  })
}
/* confirm */
Vue.prototype.confirm = function (title, content, confirmCb, cancelCb, confirmtext, cancelText, noAutoClose) {
  const _this = this
  _this.$vux.confirm.show({
    theme: 'ios',
    title: title || '',
    content: content || '',
    confirmText: confirmtext || '确定',
    cancelText: cancelText || '取消',
    closeOnConfirm: !noAutoClose,
    onCancel() {
      cancelCb ? cancelCb() : null
    },
    onConfirm() {
      confirmCb ? confirmCb() : null
    },
    onShow() {
      $(document).on('click','.weui-mask',function(){
        try{
          _this.$vux.confirm.hide()
        }catch(e){
          //console.log(e)
        }
      })
    },
    onHide() {
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
    case '':
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
Vue.prototype.tips = function (content, duration, cls, cb) {
  weui.topTips(content, {
    duration: duration || 3000,
    className: cls || 'custom-classname',
    callback: function () {
      cb ? cb() : null
    }
  })
}
/* loading */
Vue.prototype.processing = function (content, isClose, cb, timeCb) {
  let _this = this
  if (isClose) {
    _this.$vux.loading.hide()
    return false
  } else {
    _this.$vux.loading.show({
      text: content || ''
    })
    cb ? cb() : null
    setTimeout(function () {
      _this.$vux.loading.hide()
      timeCb ? timeCb() : null
    }, 2000)
  }
}
Vue.prototype.jump = function (name, params, isParams) {
  // 默认按query方式传值,否则为params方式
  var type = !isParams ? 'query' : 'params'
  if (name.indexOf('/') > -1) {
    if (type === 'params') {
      this.$router.push({path: name, params: params || ''})
    } else {
      this.$router.push({path: name, query: params || ''})
    }
  } else {
    if (type === 'params') {
      this.$router.push({name: name, params: params || ''})
    } else {
      this.$router.push({name: name, query: params || ''})
    }
  }
}
/* ----- 封装一些指令 -------- */
// 自定义跳转指令(eg: v-jump="[pathName,paramArr,type]" ,[paramArr是个参数名的数组];[type=2] 1:'path'2:'name',3:'query')
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
          } else {
            if (pathName.indexOf('/') > -1) {
              vm.$router.push({path: pathName})
            } else {
              vm.$router.push({name: pathName})
            }
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
/* 保留小数位 */
Vue.filter('toFixed', function (data, num, float) {
  if (float) {
    return data ? data.toFixed(num || 2) : data
  } else {
    return (data > 0 && parseInt(data) === data) ? data.toFixed(num || 2) : data
  }
})
// main.js
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  created() {
    vm = this
    window.youniMall.userAuth = vm.$store.state.global.wxInfo || (me.locals.get('ynWxUser') ? JSON.parse(me.locals.get('ynWxUser')).data : null)
    !vm.$store.state.global.dict ? vm.getDict() : null
    vm.addUser(window.youniMall.userAuth)
  },
  /*watch: {
    'router'() {
    }
  },*/
  mounted() {
    vm = this
    this.getUser()
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
  },
  methods: {
    /* 添加当前用户 */
    addUser(data) {
      vm.loadData(commonApi.addUser, data, 'POST', function (res) {
      }, function () {
      })
    },
    getDict() {
      vm.loadData(commonApi.dict, {}, 'POST', function (res) {
        vm.$store.commit('storeData', {key: 'dict', data: res.data.itemList})
      }, function () {
      })
    },
    getUser() {
      var localUser = me.sessions.get('ynMallInfo')
      if (localUser) {
        vm.$store.commit('storeData', {key: 'userInfo', data: JSON.parse(localUser)})
        return false
      } else {
        vm.loadData(userApi.get, null, 'POST', function (res) {
          vm.isPosting = false
          if (res) {
            vm.$store.commit('storeData', {key: 'userInfo', data: res})
            me.sessions.set('ynMallInfo', JSON.stringify(res))
          }
        })
      }
    }
  }
})
