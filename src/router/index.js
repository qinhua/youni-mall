import Vue from 'vue'
import Router from 'vue-router'
// import App from '@/App'
import Auth from '@/pages/Auth'
import Home from '@/pages/Home'
import NearBy from '@/pages/NearBy'
import Ticket from '@/pages/Ticket'
import Order from '@/pages/Order'
import Map from '@/pages/Map'
import My from '@/pages/My'
import EditUser from '@/pages/my/EditUser'
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
      path: '/author',
      name: '微信授权',
      component: Auth,
      meta: {
        title: '微信授权',
        keepAlive: false // 是否需要缓存
      }
    },
    {
      path: '/',
      name: '首页',
      redirect: '/home',
      component: Home,
      meta: {
        title: '首页',
        keepAlive: false
      }
    },
    {
      path: '/home',
      name: '首页',
      component: Home,
      meta: {
        title: '首页',
        keepAlive: false
      }
    },
    {
      path: '/nearby',
      name: '附近',
      component: NearBy,
      meta: {
        title: '附近',
        keepAlive: false
      }
    },
    {
      path: '/ticket',
      name: '水票',
      component: Ticket,
      meta: {
        title: '水票',
        keepAlive: false
      }
    },
    {
      path: '/ticket/:type',
      name: '水票',
      component: Ticket,
      meta: {
        title: '水票',
        keepAlive: false
      }
    },
    {
      path: '/order',
      name: '订单',
      component: Order,
      meta: {
        title: '订单',
        keepAlive: false
      }
    },
    {
      path: '/order/:type',
      name: '订单',
      component: Order,
      meta: {
        title: '订单',
        keepAlive: false
      }
    },
    {
      path: '/user',
      name: '我的',
      component: My,
      meta: {
        title: '我的',
        keepAlive: false
      }
      /* children: [{
       path: '/myaddress',
       name: '我的地址',
       component: MyAddress
       }] */
    },
    {
      path: '/edit_user/:userId',
      name: '我的',
      component: EditUser,
      meta: {
        title: '我的',
        keepAlive: false
      }
    },
    {
      path: '/mycoupons',
      name: '我的卡券',
      component: MyCoupons,
      meta: {
        title: '我的卡券',
        keepAlive: false
      }
    },
    {
      path: '/myguarantee',
      name: '我的押金',
      component: MyGuarantee,
      meta: {
        title: '我的押金',
        keepAlive: false
      }
    },
    {
      path: '/myaddress',
      name: '收货地址',
      component: MyAddress,
      meta: {
        title: '收货地址',
        keepAlive: false
      }
    },
    {
      path: '/myfavor',
      name: '我的收藏',
      component: MyFavorite,
      meta: {
        title: '我的收藏',
        keepAlive: false
      }
    },
    {
      path: '/help',
      name: '使用帮助',
      component: Help,
      meta: {
        title: '使用帮助',
        keepAlive: false
      }
    },
    {
      path: '/aboutus',
      name: '关于友你',
      component: About,
      meta: {
        title: '关于友你',
        keepAlive: false
      }
    },
    {
      path: '/map',
      name: '地图',
      component: Map,
      meta: {
        title: '地图',
        keepAlive: false
      }
    },
    {
      path: '/map/:path',
      name: '地图',
      component: Map,
      meta: {
        title: '地图',
        keepAlive: false
      }
    },
    {
      path: '*',
      name: '404',
      component: NoPage,
      meta: {
        title: '迷路了',
        keepAlive: true
      }
    }
  ]
})
