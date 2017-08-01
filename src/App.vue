<template>
  <div class="container">
    <tabbar>
      <tabbar-item selected link="/home" on-item-click>
        <img slot="icon" src="../static/img/ico_home.png">
        <img slot="icon-active" src="../static/img/ico_home_sel.png">
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item show-dot link="/nearby">
        <img slot="icon" src="../static/img/ico_nearby.png">
        <img slot="icon-active" src="../static/img/ico_nearby_sel.png">
        <span slot="label">附近</span>
      </tabbar-item>
      <tabbar-item link="/ticket">
        <img slot="icon" src="../static/img/ico_ticket.png">
        <img slot="icon-active" src="../static/img/ico_ticket_sel.png">
        <span slot="label">水票</span>
      </tabbar-item>
      <tabbar-item badge="2" link="/order">
        <img slot="icon" src="../static/img/ico_order.png">
        <img slot="icon-active" src="../static/img/ico_order_sel.png">
        <span slot="label">订单</span>
      </tabbar-item>
      <tabbar-item badge="..." link="/my">
        <img slot="icon" src="../static/img/ico_my.png">
        <img slot="icon-active" src="../static/img/ico_my_sel.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
    <!--这里是被缓存的视图组件，比如 Home！-->
    <transition :name="transitionName">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
    </transition>
    <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
    <transition :name="transitionName">
      <keep-alive v-if="!$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  // import $ from 'jquery'
  // import myMixin from 'myMixin'
  import Home from './pages/Home'
  import { Tabbar, TabbarItem } from 'vux'
  export default {
    name: 'app',
    data () {
      return {
        transitionName: 'slide-right', // 默认动态路由变化为slide-right
        selected: 1
      }
    },
    components: {Tabbar, TabbarItem},
    beforeMount () {
      // console.log(window.me)
    },
    mounted () {
      // me.attachClick()
    },
    computed: {
      'key' () {
        return this.$route.path.replace(/\//g, '_')
      }
    },
    methods: {
      finish (index) {
        this.show = false
        this.value = 'completed'
        console.log('current index', index)
      }
    },
    watch: {
      '$route' (to, from) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      }
//      '$route' (to, from) {
//        let isBack = this.$router.isBack  //  监听路由变化时的状态为前进还是后退
//        console.log(isBack)
//        if (isBack) {
//          this.transitionName = 'slide-right'
//        } else {
//          this.transitionName = 'slide-left'
//        }
//        this.$router.isBack = false
//      }
    }
  }
</script>

<style lang='less'>
  @import '../static/css/tools.less';

  .weui-bar__item_on {
    .weui-tabbar__icon{
      color: #0e9de2!important;
    }
    .weui-tabbar__label{
      color: #0e9de2!important;
    }
  }


  .container {
    height: 100%;
    overflow: auto;
  }

  .Router {
    position: absolute;
    width: 100%;
    transition: all .8s ease;
    top: 40px;
  }

  .slide-left-enter,
  .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }

  .slide-left-leave-active,
  .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  .outLeftInRight-transition,
  .fadeOutLeft-transition,
  .fadeInLeft-transition {
    transition: transform .3s ease-in-out;
  }

  .outLeftInRight-transition,
  .fadeOutLeft-transition,
  .fadeInLeft-transition {
    transition: transform .3s ease-in-out;
  }

  /* 进入时的状态，从右开始 */
  .outLeftInRight-enter,
  .fadeInLeft-enter,
  .fadeInLeft-leave {
    transform: translateX(100%);
  }

  /* 离开时的状态，向左移动 */
  .outLeftInRight-leave,
  .fadeOutLeft-enter,
  .fadeOutLeft-leave {
    transform: translateX(-100%);
  }

  .fade-enter-active,
  .fade-leave-active {
    -webkit-transition: opacity .3s;
    transition: opacity .3s
  }

  .fade-enter,
  .fade-leave {
    opacity: 0
  }
</style>
