<template>
  <div class="nearby">
    附近
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  var me
  var vm
  import { Tabbar, TabbarItem, Group, Cell } from 'vux'
  export default {
    name: 'nearby',
    data () {
      return {
        current: 0
      }
    },
    components: {Tabbar, TabbarItem, Group, Cell},
    beforeMount () {
      me = window.me
    },
    mounted () {
      // me.attachClick()
    },
    computed: {
    },
    methods: {
      // 向父组件传值
      setPageStatus (data) {
        this.$emit('listenPage', data)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../static/css/tools.less';

  .weui-tabbar__item {
    .icon1 {
      .none;
    }
    &.weui-bar__item_on {

    }
  }
</style>
