<template>
  <div class="my">
    我的
    <!--<img class="wd-img" src="../../static/img/banner/p01.jpg">-->
    <h3>{{current}}</h3>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  var me
  var vm
  import { Tabbar, TabbarItem, Group, Cell } from 'vux'
  export default {
    name: 'my',
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
