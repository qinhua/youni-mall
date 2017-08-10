<template>
  <div class="my-guarantee">
    <h2><i class="fa fa-smile-o"></i>&nbsp;这里列出了您的所有押金，您可以进行相应操作</h2>
    <x-table class="inner-table" :cell-bordered="true">
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
        <td>
          <button type="button" class="btn btn-refund">退还押金</button>
        </td>
      </tr>
      <tr>
        <td>哇哈哈乳品</td>
        <td>设备押金</td>
        <td>80元</td>
        <td>
          <button type="button" class="btn btn-refund disabled">已申请退还</button>
        </td>
      </tr>
      </tbody>
    </x-table>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Grid, GridItem, Group, Cell, XTable, LoadMore} from 'vux'
  import {userApi} from '../../store/main.js'
  export default {
    name: 'my-guarantee',
    data () {
      return {
        address: null,
        onFetching: false,
        isPosting: false
      }
    },
    components: {Grid, GridItem, Group, Cell, XTable, LoadMore},
    beforeMount () {
      me = window.me
    },
    mounted () {
      // me.attachClick()
    },
    computed: {},
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../../static/css/tools.less';

  .my-guarantee {
    min-height: 100%;
    .bf;
    h2 {
      padding: 14/@rem 20/@rem;
      .fz(26);
      .cdiy(#e46363);
      font-weight: normal;
      .bdiy(#fff1d1);
    }
    .inner-table {
      .bf;
      .bsd(0, 1px, 10px, 0, #eee);
      thead {
        background: #f5f5f5;
        th {
          font-weight: bold;
        }
      }
      .btn {
        padding: 3px 14/@rem;
        .fz(22);
        .cf;
        background: @c2;
        .borR(3px);
        &.disabled {
          .bc;
        }
      }
    }
  }
</style>
