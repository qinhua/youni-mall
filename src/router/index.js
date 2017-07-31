import Vue from 'vue'
import Router from 'vue-router'
// import App from '@/App'
import NoPage from '@/pages/NoPage'
import Home from '@/pages/Home'

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
    // {
    //  path: '/',
    //  name: '首页',
    //  component: Home
    // },
    // {
    //  path: '*',
    //  name: '首页',
    //  component: Home
    // }
    {
      path: '*',
      name: '无页面',
      component: NoPage,
      meta: {
        keepAlive: false
      }
    }
  ]
})
