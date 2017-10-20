<template>
  <div class="my-guarantee" v-cloak>
    <div class="gua-tab-con">
      <tab class="gua-tab" active-color="#FE6246">
        <tab-item :selected="!params.status?true:false" @on-item-click="onItemClick">全部</tab-item>
        <tab-item :selected="params.status==1?true:false" @on-item-click="onItemClick(1)">正常</tab-item>
        <tab-item :selected="params.status==2?true:false" @on-item-click="onItemClick(2)">退款中</tab-item>
        <tab-item :selected="params.status==3?true:false" @on-item-click="onItemClick(3)">已退款</tab-item>
        <tab-item :selected="params.status==4?true:false" @on-item-click="onItemClick(4)">已拒绝</tab-item>
      </tab>
    </div>
    <div class="fee-list" v-if="list.length" v-cloak>
      <scroller class="inner-scroller" ref="guaScroller" height="100%" :on-refresh="refresh"
                :on-infinite="infinite"
                refreshText="下拉刷新"
                noDataText="就这么多了"
                snapping>
        <!-- content goes here -->
        <section class="v-items" v-for="item in list" :data-id="item.id">
          <section class="wrap">
            <!--<img :src="item.headimgurl">-->
            <div class="info-con">
              <h3>{{item.sellerName}}<span :class="['tg',item.statusCls]">{{item.statusTxt}}</span></h3>
              <div class="bottom">
                <p>桶数：<i>{{item.bucketNum}}桶</i></p>
                <p>单价：<i>￥{{item.totalAmount | toFixed}}元</i><span>总金额：<i>￥{{item.bucketAmount | toFixed}}元</i></span></p>
                <div class="btn-group" v-if="item.status===1">
                  <button type="button" class="btn" @click="refund(item.id)">申请退还
                  </button>
                </div>
              </div>
            </div>
          </section>
        </section>
      </scroller>
    </div>
    <!--<div class="wrap" v-if="list.length">
      <h2><i class="fa fa-smile-o"></i>&nbsp;这里列出了您的所有押金</h2>
      <x-table class="inner-table" :cell-bordered="true">
        <thead>
        <tr>
          <th>商家</th>
          <th>数量</th>
          <th>每桶(元)</th>
          <th>总押金(元)</th>
          <th>数量(桶)</th>
          &lt;!&ndash;<th>操作</th>&ndash;&gt;
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
          &lt;!&ndash;<td>
            <div class="fee">
              <p>单桶：{{item.bucketAmount}}</p>
              <p>总押金：{{item.totalAmount}}</p>
            </div>
          </td>&ndash;&gt;
          <td>{{item.totalAmount}}</td>
          &lt;!&ndash;<td>
            <button type="button" class="btn btn-refund">退还</button>
          </td>&ndash;&gt;
        </tr>
        </tbody>
      </x-table>
    </div>-->
    <div class="iconNoData abs-center-vh" v-else><i></i>
      <p>暂无记录</p></div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Tab, TabItem, Group, Cell, XTable} from 'vux'
  import {depositApi} from '../../service/main.js'

  export default {
    name: 'my-guarantee',
    data() {
      return {
        guarantee: [],
        onFetching: false,
        isPosting: false,
        list: [],
        params: {}
      }
    },
    components: {Tab, TabItem, Group, Cell, XTable},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getDeposits()
    },
    computed: {},
    methods: {
      refresh(done) {
        // console.log('下拉加载')
        setTimeout(function () {
          vm.getDeposits()
          try {
            vm.$refs.guaScroller.finishPullToRefresh()
          } catch (e) {
            // console.log(e)
          }
        }, 1200)
      },
      infinite(done) {
        // console.log('无限滚动')
        setTimeout(function () {
          vm.getDeposits(true)
          try {
            vm.$refs.guaScroller.finishInfinite(true)
          } catch (e) {
            // console.log(e)
          }
        }, 1000)
      },
      getDeposits(isLoadMore) {
        // vm.processing()
        vm.isPosting = true
        vm.loadData(depositApi.list, vm.params, 'POST', function (res) {
          var resD = res.data.itemList
          if (resD.length) {
            for (var i = 0; i < resD.length; i++) {
              var cur = resD[i];
              switch (cur.status) {
                case 1:
                  cur.statusTxt = '正常'
                  cur.statusCls = 'normal'
                  break
                case 2:
                  cur.statusTxt = '退款中'
                  cur.statusCls = 'during'
                  break
                case 3:
                  cur.statusTxt = '退款失败'
                  cur.statusCls = 'fail'
                  break
              }
            }
          }
          vm.list = resD
          // console.log(vm.list, '保证金数据')
          vm.isPosting = false
          // vm.processing(0, 1)
        }, function () {
          vm.isPosting = false
          // vm.processing(0, 1)
        })
      },
      onItemClick(status) {
        vm.list = []
        status ? vm.params.status = status : delete vm.params.status
        vm.getDeposits()
      },
      refund(id) {
        vm.confirm('确认退还押金？', '', function () {
          vm.isPosting = true
          vm.loadData(depositApi.refund, {id: id}, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.toast('退款申请已提交')
              vm.getDeposits()
            } else {
              vm.toast(res.message || '操作失败', 'warn')
            }
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
    .bf5;
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
    .gua-tab-con {
      .fix;
      width: 100%;
      top: 0;
      z-index: 20;
      .gua-tab {
        z-index: 10;
        .vux-tab-item {
          .rel;
          .vux-tab-item-badge {
            top: -20px;
            right: 0;
          }
        }
        .transi(.2s);
        &.fixed {
          width: 100%;
          .fix;
          top: 0;
        }
      }
    }
    .fee-list {
      .vux-swipeout-item {
        &:not(:last-child) {
          .bor-b;
        }
      }
      .vux-swipeout-button {
        font-size: 14px;
      }
      .vux-swipeout-button-primary {
        background: #5d5454;
      }
      .vux-1px-t:before {
        .none;
      }
      .inner-scroller {
        padding: 44px 0 50px;
        .v-items {
          .borBox;
          .bf;
          .bor-t;
          .wrap {
            padding: 14/@rem 20/@rem;
            img {
              .size(80, 80);
              .abs-center-vertical;
              left: 20/@rem;
              .borR(50%);
            }
            .info-con {
              .rel;
              .borBox;
              /*padding-left: 100/@rem;*/
              h3 {
                .txt-normal;
                .c3;
                .fz(26);
                .ellipsis-clamp-2;
                .tg {
                  float: right;
                  padding: 0 2px;
                  font-weight: normal;
                  .c3;
                  .fz(16);
                  &.normal {
                    .cdiy(#66c745);
                    .bor(1px,solid,#66c745);
                  }
                  &.during {
                    .cdiy(#fbaf65);
                    .bor(1px,solid,#fbaf65);
                  }
                  &.fail {
                    .cdiy(#999);
                    .bor(1px,solid,#999);
                  }
                }
              }
              .bottom{
                .rel;
                padding-top:10/@rem;
              }
              p {
                .fz(24);
                line-height: 1.8;
                .c7;
                span {
                  padding-left: 30/@rem;
                }
                i {
                  .cdiy(@c2);
                  font-style: normal;
                }
              }
              .btn-group {
                .abs;
                width: 140/@rem;
                right: 0;
                bottom: 0;
                button {
                  width: 100%;
                  .fl;
                  padding: 2px 0;
                  .fz(24);
                  .cf;
                  .bdiy(#fea146);
                  .borR(4px);
                  &:not(:last-child){
                    margin-bottom:12/@rem;
                  }
                  &.agree{
                    .bdiy(#66c745);
                  }
                  &.decline{
                    .bdiy(#f35858);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
