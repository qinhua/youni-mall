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
import EditAddress from '@/pages/my/EditAddress'
import MyCoupons from '@/pages/my/Coupons'
import MyGuarantee from '@/pages/my/Guarantee'
import MyAddress from '@/pages/my/Address'
import MyFavorite from '@/pages/my/Favorite'
import Help from '@/pages/my/Help'
import About from '@/pages/my/About'
import GoodsDetail from '@/pages/goods/Detail'

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
      name: 'author',
      component: Auth,
      meta: {
        title: '微信授权',
        keepAlive: false // 是否需要缓存
      }
    },
    {
      path: '/',
      name: 'home',
      redirect: '/home',
      component: Home,
      meta: {
        title: '首页',
        keepAlive: false
      }
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        title: '首页',
        keepAlive: false
      }
    },
    {
      path: '/nearby',
      name: 'nearby',
      component: NearBy,
      meta: {
        title: '附近',
        keepAlive: false
      }
    },
    {
      path: '/ticket',
      name: 'ticket',
      component: Ticket,
      meta: {
        title: '水票',
        keepAlive: false
      }
    },
    {
      path: '/ticket/:type',
      name: 'ticket',
      component: Ticket,
      meta: {
        title: '水票',
        keepAlive: false
      }
    },
    {
      path: '/order',
      name: 'order',
      component: Order,
      meta: {
        title: '订单',
        keepAlive: false
      }
    },
    {
      path: '/user',
      name: 'user',
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
      path: '/edit_user',
      name: 'edit_user',
      component: EditUser,
      meta: {
        title: '我的',
        keepAlive: false
      }
    },
    {
      path: '/mycoupons',
      name: 'mycoupons',
      component: MyCoupons,
      meta: {
        title: '我的卡券',
        keepAlive: false
      }
    },
    {
      path: '/myguarantee',
      name: 'myguarantee',
      component: MyGuarantee,
      meta: {
        title: '我的押金',
        keepAlive: false
      }
    },
    {
      path: '/myaddress',
      name: 'myaddress',
      component: MyAddress,
      meta: {
        title: '收货地址',
        keepAlive: false
      }
    },
    {
      path: '/edit_address',
      name: 'edit_address',
      component: EditAddress,
      meta: {
        title: '收货地址',
        keepAlive: false
      }
    },
    {
      path: '/myfavor',
      name: 'myfavor',
      component: MyFavorite,
      meta: {
        title: '我的收藏',
        keepAlive: false
      }
    },
    {
      path: '/help',
      name: 'help',
      component: Help,
      meta: {
        title: '使用帮助',
        keepAlive: false
      }
    },
    {
      path: '/aboutus',
      name: 'aboutus',
      component: About,
      meta: {
        title: '关于友你',
        keepAlive: false
      }
    },
    {
      path: '/map',
      name: 'map',
      component: Map,
      meta: {
        title: '地图',
        keepAlive: false
      }
    },
    {
      path: '/goods_detail',
      name: 'goods_detail',
      component: GoodsDetail,
      meta: {
        title: '商品详情',
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
