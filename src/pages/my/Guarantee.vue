<template>
  <div class="my-guarantee">
      <x-table class="inner-table" :cell-bordered="true" style="background-color:#fff;">
        <thead>
        <tr>
          <th>商家名称</th>
          <th>押金类型</th>
          <th>金额</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>心上人水铺</td>
          <td>水桶押金</td>
          <td>200元</td>
          <td><button type="button" class="btn btn-refund">退还押金</button></td>
        </tr>
        <tr>
          <td>哇哈哈乳品</td>
          <td>设备押金</td>
          <td>80元</td>
          <td><button type="button" class="btn btn-refund disabled">已申请退还</button></td>
        </tr>
        </tbody>
      </x-table>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  var me
  var vm
  import {Grid, GridItem, Group, Cell, XTable, LoadMore} from 'vux'
  export default {
    name: 'my-guarantee',
    data () {
      return {
        address: null
      }
    },
    components: {Grid, GridItem, Group, Cell, XTable, LoadMore},
    beforeMount () {
      me = window.me
    },
    mounted () {
      // me.attachClick()
    },
    computed: {
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../../static/css/tools.less';
  .my-guarantee{
    min-height:100%;
    .bf;
    .inner-table{
      .bsd(0, 1px, 10px, 0, #eee);
      thead{
        background: #efe7e2;
        th{
          font-weight: bold;
        }
      }
      .btn{
        padding:3px 14/@rem;
        .fz(22);
        .cf;
        background: @c2;
        .borR(3px);
        &.disabled{
          .bc;
        }
      }
    }
  }
</style>
