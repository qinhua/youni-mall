<template>
  <div class="ticket">
    <tab class="ticket-type">
      <tab-item @on-item-click="onItemClick"><i class="fa fa-pencil-square-o"></i>&nbsp;购买水票</tab-item>
      <tab-item selected @on-item-click="onItemClick"><i class="fa fa-user-circle-o" aria-hidden="true"></i>&nbsp;我的水票</tab-item>
    </tab>
    <tab class="ticket-tab" active-color="#FF9900">
      <tab-item @on-item-click="onItemClick">全部</tab-item>
      <tab-item selected @on-item-click="onItemClick">待支付</tab-item>
      <tab-item @on-item-click="onItemClick">可使用</tab-item>
      <tab-item @on-item-click="onItemClick">已完成</tab-item>
      <tab-item @on-item-click="onItemClick">已关闭</tab-item>
    </tab>
    <scroller class="ticket-list" :on-refresh="refresh" :on-infinite="infinite" refreshText="下拉刷新" noDataText="没有更多数据" snapping>
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
  import { Tab, TabItem, Tabbar, TabbarItem, Group, Cell } from 'vux'
  export default {
    name: 'ticket',
    data () {
      return {
      }
    },
    components: {Tab, TabItem, Tabbar, TabbarItem, Group, Cell},
    beforeMount () {
      me = window.me
    },
    mounted () {
    },
    computed: {
    },
    methods: {
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
  .ticket-type,.ticket-tab{
    z-index: 10;
  }
  .ticket-list{
    .borBox;
    padding:88px 0 50px;
  }
</style>
