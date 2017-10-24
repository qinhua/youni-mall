<template>
  <div class="container">
    <div class="isWebTip" v-if="isWeb"><i class="fa fa-exclamation-triangle"></i>&nbsp;部分功能可能无法使用，建议在微信中打开</div>
    <!--<div class="btn flush-button s02" onclick="javascript:me.locals.clear();me.sessions.clear();me.lightPop('ok,已清理');">-->
    <!--清理缓存-->
    <!--</div>-->
    <!--<a href="http://mp.weixin.qq.com/s?__biz=MzA4MDM2MjA4Mg==&amp;mid=210296128&amp;idx=1&amp;sn=d9f380331ca095a50d7dcf1766bcf11c#rd" class="link" title="关注">关注</a>-->
    <!--定位组件-->
    <geo :visible="false" :cache="true" @on-geo-end="getMap" v-if="$route.path!=='/auth'"></geo>

    <!--标签栏-->
    <tabbar class="no-callout" v-if="showTabbar" style="position:fixed">
      <tabbar-item :selected="(curSelected===1||$route.path=='/home')?true:false" link="/home">
        <img slot="icon" src="../static/img/ico_home.png">
        <img slot="icon-active" src="../static/img/ico_home_sel.png">
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item :selected="(curSelected===2||$route.path=='/nearby')?true:false" link="/nearby">
        <img slot="icon" src="../static/img/ico_nearby.png">
        <img slot="icon-active" src="../static/img/ico_nearby_sel.png">
        <span slot="label">附近</span>
      </tabbar-item>
      <tabbar-item :selected="(curSelected===3||$route.path.indexOf('/ticket')>-1)?true:false" link="/ticket">
        <img slot="icon" src="../static/img/ico_ticket.png">
        <img slot="icon-active" src="../static/img/ico_ticket_sel.png">
        <span slot="label">友票</span>
      </tabbar-item>
      <!--<tabbar-item :selected="(curSelected===4||$route.path=='/order')?true:false" show-dot link="/order">-->
      <tabbar-item :selected="(curSelected===4||$route.path=='/order')?true:false" link="/order">
        <img slot="icon" src="../static/img/ico_order.png">
        <img slot="icon-active" src="../static/img/ico_order_sel.png">
        <span slot="label">订单</span>
      </tabbar-item>
      <tabbar-item :selected="(curSelected===5||$route.path=='/user')?true:false" link="/user">
        <img slot="icon" src="../static/img/ico_my.png">
        <img slot="icon-active" src="../static/img/ico_my_sel.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>

    <!--这里是被缓存的视图组件，比如 Home！-->
    <!--<transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">-->
    <transition>
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view v-wechat-title="$route.meta.title" :geoAddress="geoData.address"
                     v-on:listenPage="getPageStatus"></router-view>
      </keep-alive>
    </transition>
    <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
    <!--<transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">-->
    <transition>
      <keep-alive v-if="!$route.meta.keepAlive">
        <router-view v-wechat-title="$route.meta.title" :geoAddress="geoData.address"
                     v-on:listenPage="getPageStatus"></router-view>
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
  import {commonApi} from './service/main.js'
  import {Tabbar, TabbarItem} from 'vux'
  import {mapState, mapActions} from 'vuex'
  import Geo from './components/Geo'

  export default {
    name: 'app',
    data() {
      return {
        isWeb: false,
        geoData: {
          address: '定位中…'
        }, // 定位数据
        transitionName: 'fade', // 默认动态路由过渡
        // showTabbar: false, // 是否显示标签栏
        curSelected: 1, // 当前选中的tab
        direction: '', // 路由方向
        curCount: 0 // 当前购物车中商品数
      }
    },
    components: {Geo, Tabbar, TabbarItem},
    beforeMount() {
      vm = this
      // wx外部提示用户
      !me.isWeixin ? vm.isWeb = true : false
    },
    mounted() {
      vm = this
    },
    computed: {
      'showTabbar'() {
        let path = this.$route.name
        return path === 'home' || path === 'nearby' || path === 'ticket' || path === 'order' || path === 'user'
      },
      'key'() {
        return this.$route.path.replace(/\//g, '_')
      }
    },
    methods: {
      // 全局定位
      getMap(data) {
        // console.log(data, 'home geo info')
        this.geoData = data
        this.$store.commit('storeData', {key: 'geoData', data: data})
      },
      // 从子组件获取数据
      getPageStatus(data) {
        vm.curSelected = data
      }
    },
    watch: {
      'curCount'() {
        return vm.$store.state.cart.count
      },
      '$route'(to, from) {
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
            vm.curSelected = 1
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
