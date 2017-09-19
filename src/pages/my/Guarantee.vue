<template>
  <div class="my-guarantee" v-cloak>
    <div class="wrap" v-if="list.length">
      <h2><i class="fa fa-smile-o"></i>&nbsp;这里列出了您的所有押金</h2>
      <x-table class="inner-table" :cell-bordered="true">
        <thead>
        <tr>
          <th>商家</th>
          <th>数量</th>
          <th>每桶(元)</th>
          <th>总押金(元)</th>
          <th>数量(桶)</th>
          <!--<th>操作</th>-->
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in list" :data-id="item.id" :data-ordernumber="item.orderNumber" :index="index">
          <td>
            <div class="name">{{item.sellerName}}</div>
          </td>
          <td>{{item.bucketNum}}</td>
          <td>{{item.bucketAmount}}</td>
          <td>{{item.totalAmount}}</td>
          <!--<td>
            <div class="fee">
              <p>单桶：{{item.bucketAmount}}</p>
              <p>总押金：{{item.totalAmount}}</p>
            </div>
          </td>-->
          <td>{{item.totalAmount}}</td>
          <!--<td>
            <button type="button" class="btn btn-refund">退还</button>
          </td>-->
        </tr>
        </tbody>
      </x-table>
    </div>
    <div class="iconNoData abs-center-vh" v-else><i></i>
      <p>没交过押金</p></div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell, XTable} from 'vux'
  import {depositApi} from '../../service/main.js'

  export default {
    name: 'my-guarantee',
    data() {
      return {
        address: null,
        onFetching: false,
        isPosting: false,
        list: []
      }
    },
    components: {Group, Cell, XTable},
    beforeMount() {
      me = window.me
    },
    mounted() {
      // me.attachClick()
      vm = this
      // vm.getDeposits()
    },
    computed: {},
    methods: {
      getDeposits() {
        vm.processing()
        vm.processing()
        vm.isPosting = true
        vm.loadData(depositApi.list, vm.params, 'POST', function (res) {
          var resD = res.data.itemList
          vm.list = resD
          console.log(vm.deposits, '保证金数据')
          vm.isPosting = false
          vm.processing(0, 1)
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      refund(id) {
        vm.confirm('确认退还押金？', '', function () {
          vm.loadData(depositApi.refund, vm.params, 'POST', function (res) {
            vm.isPosting = true
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      }
    }
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
      .fz(24);
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
      tr {
        .fz(24);
        td {
          .name {
            padding: 1px;
            line-height: 1.5;
            max-width: 200/@rem;
            .ellipsis-clamp-2;
          }
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
