import Vue from 'vue'
import Router from 'vue-router'
// import App from '@/App'
import Home from '@/pages/Home'
import NearBy from '@/pages/NearBy'
import Ticket from '@/pages/Ticket'
import Order from '@/pages/Order'
import My from '@/pages/My'
import NoPage from '@/pages/NoPage'
// Router.prototype.goBack = function () {
//  this.isBack = true
//  window.history.go(-1)
// }
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: Home,
      meta: {
        keepAlive: true // 是否需要缓存
      }
    },
    {
      path: '/home',
      name: '首页',
      component: Home,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/nearby',
      name: '附近',
      component: NearBy
    },
    {
      path: '/ticket',
      name: '水票',
      component: Ticket
    },
    {
      path: '/order',
      name: '订单',
      component: Order
    },
    {
      path: '/my',
      name: '我的',
      component: My
    },
    {
      path: '*',
      name: '404',
      component: NoPage,
      meta: {
        keepAlive: false
      }
    }
  ]
})
