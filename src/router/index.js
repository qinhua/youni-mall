import Vue from 'vue'
import Router from 'vue-router'
// import App from '@/App'
import Home from '@/pages/Home'
import NearBy from '@/pages/NearBy'
import Ticket from '@/pages/Ticket'
import Order from '@/pages/Order'
import Map from '@/pages/Map'
import My from '@/pages/My'
import MyCoupons from '@/pages/my/Coupons'
import MyGuarantee from '@/pages/my/Guarantee'
import MyAddress from '@/pages/my/Address'
import MyFavorite from '@/pages/my/Favorite'
import Help from '@/pages/my/Help'
import About from '@/pages/my/About'
import NoPage from '@/pages/NoPage'
Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      redirect: '/home',
      component: Home,
      meta: {
        keepAlive: false // 是否需要缓存
      }
    },
    {
      path: '/home',
      name: '首页',
      component: Home,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/nearby',
      name: '附近',
      component: NearBy,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/ticket',
      name: '水票',
      component: Ticket,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/ticket/:type',
      name: '水票',
      component: Ticket,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/order',
      name: '订单',
      component: Order,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/order/:type',
      name: '订单',
      component: Order,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/user',
      name: '我的',
      component: My,
      meta: {
        keepAlive: false
      }
      /* children: [{
       path: '/myaddress',
       name: '我的地址',
       component: MyAddress
       }] */
    },
    {
      path: '/mycoupons',
      name: '我的卡券',
      component: MyCoupons,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/myguarantee',
      name: '我的押金',
      component: MyGuarantee,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/myaddress',
      name: '我的地址',
      component: MyAddress,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/myfavor',
      name: '我的收藏',
      component: MyFavorite,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/help',
      name: '使用帮助',
      component: Help,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/aboutus',
      name: '关于友你',
      component: About,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/map',
      name: '地图',
      component: Map,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/map/:path',
      name: '地图',
      component: Map,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '*',
      name: '404',
      component: NoPage,
      meta: {
        keepAlive: true
      }
    }
  ]
})
