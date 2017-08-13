<template>
  <div class="container">
    <!--地图容器-->
    <div id="mapContainer"></div>
    <!--标签栏-->
    <tabbar v-if="showTabbar" style="position:fixed">
      <tabbar-item :selected="(curSelected===1||$route.path=='/home')?true:false" link="/home">
        <img slot="icon" src="../static/img/ico_home.png">
        <img slot="icon-active" src="../static/img/ico_home_sel.png">
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item :selected="(curSelected===2||$route.path=='/nearby')?true:false" show-dot link="/nearby">
        <img slot="icon" src="../static/img/ico_nearby.png">
        <img slot="icon-active" src="../static/img/ico_nearby_sel.png">
        <span slot="label">附近</span>
      </tabbar-item>
      <tabbar-item :selected="(curSelected===3||$route.path.indexOf('/ticket')>-1)?true:false" link="/ticket">
        <img slot="icon" src="../static/img/ico_ticket.png">
        <img slot="icon-active" src="../static/img/ico_ticket_sel.png">
        <span slot="label">水票</span>
      </tabbar-item>
      <tabbar-item :selected="(curSelected===4||$route.path=='/order')?true:false" badge="2" link="/order">
        <img slot="icon" src="../static/img/ico_order.png">
        <img slot="icon-active" src="../static/img/ico_order_sel.png">
        <span slot="label">订单</span>
      </tabbar-item>
      <tabbar-item :selected="(curSelected===5||$route.path=='/user')?true:false" show-dot link="/user">
        <img slot="icon" src="../static/img/ico_my.png">
        <img slot="icon-active" src="../static/img/ico_my_sel.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>

    <!--这里是被缓存的视图组件，比如 Home！-->
    <!--<transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">-->
    <transition>
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view v-wechat-title="$route.meta.title" v-on:listenPage="getPageStatus"></router-view>
      </keep-alive>
    </transition>
    <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
    <!--<transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">-->
    <transition>
      <keep-alive v-if="!$route.meta.keepAlive">
        <router-view v-wechat-title="$route.meta.title" v-on:listenPage="getPageStatus"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
  /* eslint-disable */
  // import $ from 'jquery'
  // import myMixin from 'myMixin'
  let vm
  import Home from './pages/Home'
  import {Tabbar, TabbarItem} from 'vux'
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'app',
    data() {
      return {
        transitionName: 'fade', // 默认动态路由过渡
        // showTabbar: false, // 是否显示标签栏
        curSelected: 1, // 当前选中的tab
        direction: '', // 路由方向
        curCount: 0 // 当前购物车中商品数
      }
    },
    components: {Tabbar, TabbarItem},
    beforeMount() {
      // console.log(window.me)
    },
    mounted() {
      // me.attachClick()
      vm = this
    },
    computed: {
      'showTabbar' () {
        let path = this.$route.name
        return path === 'home' || path === 'nearby' || path === 'ticket' ||path === 'order' || path === 'user'
      },
      'key'() {
        return this.$route.path.replace(/\//g, '_')
      }
    },
    methods: {
      // 从子组件获取数据
      getPageStatus (data) {
        vm.curSelected = data
      }
    },
    watch: {
      'curCount' () {
        return vm.$store.state.cart.count
      },
      '$route' (to, from) {
        /* let isBack = this.$router.isBack //  监听路由变化时的状态为前进还是后退
        console.log(isBack)
        if (isBack) {
          vm.direction = 'reverse'
        } else {
          vm.direction = 'forward'
        }
        this.$router.isBack = false
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        vm.direction = toDepth < fromDepth ? 'forward' : 'reverse' */
//        vm.showTabbar = true
        switch (to.name) {
          case 'home':
            vm.curSelected = 1
            break
          case 'nearby':
            vm.curSelected = 2
            break
          case 'ticket':
            vm.curSelected = 3
            break
          case 'order':
            vm.curSelected = 4
            break
          case 'user':
            vm.curSelected = 5
            break
          default:
//            vm.showTabbar = false
            break
        }
      }
    }
  }
</script>

<style lang='less'>
  @import '../static/css/tools.less';

  .weui-bar__item_on {
    .weui-tabbar__icon {
      color: #0e9de2 !important;
    }
    .weui-tabbar__label {
      color: #0e9de2 !important;
    }
  }

  .container {
    height: 100%;
    overflow: auto;
  }

</style>
