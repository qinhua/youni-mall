<template>
  <div class="home">
    <h3>{{current}}</h3>
    <tabbar>
      <tabbar-item>
        <img slot="icon" src="../../static/img/ico_home.png">
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item show-dot @click="selPage">
        <img slot="icon" src="../../static/img/ico_nearby.png">
        <span slot="label">附近</span>
      </tabbar-item>
      <tabbar-item selected link="">
        <img slot="icon" src="../../static/img/ico_ticket.png">
        <span slot="label">水票</span>
      </tabbar-item>
      <tabbar-item badge="2">
        <img slot="icon" src="../../static/img/ico_order.png">
        <span slot="label">订单</span>
      </tabbar-item>
      <tabbar-item badge="...">
        <img slot="icon" src="../../static/img/ico_my.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  var me
  var vm
  import { Tabbar, TabbarItem, Group, Cell } from 'vux'
  export default {
    name: 'home',
    data () {
      return {
        current: 0,
        msg: 'Welcome to Your Vue.js App'
      }
    },
    components: {Tabbar, TabbarItem, Group, Cell},
    beforeMount () {
      me = window.me
    },
    mounted () {
      // me.attachClick()
//      this.$axios.get('/user', {
//        params: {
//          ID: 12345
//        }
//      }).then(function (response) {
//        console.log(response)
//      }).catch(function (error) {
//        console.log(error)
//      })
    },
    computed: {
      'this.current': function () {
        return 20
      }
    },
    methods: {
      selPage () {
        console.log(this)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../static/css/tools.less';

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .weui-tabbar__item {
    .icon1 {
      .none;
    }
    &.weui-bar__item_on {

    }
  }
</style>
