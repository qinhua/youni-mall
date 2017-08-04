<template>
  <div class="order">
    <tab class="order-tab" active-color="#FF9900">
      <tab-item @on-item-click="onItemClick">全部</tab-item>
      <tab-item selected @on-item-click="onItemClick">待支付</tab-item>
      <tab-item @on-item-click="onItemClick" badge-background="#38C972" badge-color="#fff" badge-label="2">待接单</tab-item>
      <tab-item @on-item-click="onItemClick">待派送</tab-item>
      <tab-item @on-item-click="onItemClick">派送中</tab-item>
      <tab-item @on-item-click="onItemClick">待评价</tab-item>
    </tab>
    <scroller class="order-list" :on-refresh="refresh" :on-infinite="infinite" refreshText="下拉刷新" noDataText="没有更多数据" snapping>
      <!-- content goes here -->
      <p>lorem</p>
      <p>lorem</p>
      <p>lorem</p>
      <p>lorem</p>
      <p>lorem</p>
      <p>lorem</p>
      <p>lorem</p>
    </scroller>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  var me
  var vm
  import {Tab, TabItem} from 'vux'
  export default {
    name: 'order',
    data () {
      return {
      }
    },
    components: {Tab, TabItem},
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
    },
    methods: {
      // 向父组件传值
      setPageStatus (data) {
        this.$emit('listenPage', data)
      },
      refresh () {
        console.log('下拉加载')
      },
      infinite () {
        console.log('无限滚动')
      },
      onItemClick () {
        console.log('点击tabs')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../static/css/tools.less';
  .order-tab{
    z-index: 10;
    .vux-tab-item{
      .rel;
      .vux-tab-item-badge{
        top:-20px;
        right:0;
      }
    }
  }
  .order-list{
    .borBox;
    padding:44px 0 50px;
  }
</style>
