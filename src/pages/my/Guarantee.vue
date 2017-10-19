<template>
  <div class="my-guarantee" v-cloak>
    <div class="gua-tab-con">
      <tab class="gua-tab" active-color="#FE6246">
        <tab-item :selected="!params.status?true:false" @on-item-click="onItemClick">全部</tab-item>
        <tab-item :selected="params.status==1?true:false" @on-item-click="onItemClick(1)">未退款</tab-item>
        <tab-item :selected="params.status==2?true:false" @on-item-click="onItemClick(2)">退款中</tab-item>
        <tab-item :selected="params.status==3?true:false" @on-item-click="onItemClick(3)">已退款</tab-item>
      </tab>
    </div>
    <div class="fee-list">
      <scroller class="inner-scroller" ref="ticketScroller" height="100%" :on-refresh="refresh"
                :on-infinite="infinite"
                refreshText="下拉刷新"
                noDataText="就这么多了"
                snapping>
        <!-- content goes here -->
        <swipeout>
          <swipeout-item @on-close="" @on-open="" transition-mode="follow" v-for="(item, index) in guarantee"
                         :data-id="item.id" :data-waterid="item.waterId"
                         v-cloak key="index" disabled>
            <div slot="right-menu">
              <swipeout-button @click.native="onSwiperClick('delete',item.id)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-t">
              <div>
                <section class="v-items">
                  <section class="wrap">
                    <div class="img-con"
                         :style="item.ticketImage?('background-image:url('+item.ticketImage+')'):''"></div>
                    <section class="infos">
                      <h3>{{item.ticketName}}<span class="count">数量：<i>{{item.totalWaterNum}}桶</i></span></h3>
                      <section class="middle">
                        <span class="txt-del c9">￥{{item.totalAmount | toFixed}}元</span>
                        <span class="sale-count">已兑换：<i>{{item.exchangeWaterNum}}桶</i></span>
                        <button type="button" :class="['btn btn-buy',item.payStatus?'exchange':'']"
                                @click="onButtonClick($event,item.id,item)"
                                v-text="item.payStatus ? '兑换' : '支付'"></button>
                      </section>
                      <label class="price">实付：￥{{item.payAmount | toFixed}}元</label>
                    </section>
                  </section>
                </section>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
      </scroller>
    </div>
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
  import {Tab, TabItem, Group, Cell, XTable, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'
  import {depositApi} from '../../service/main.js'

  export default {
    name: 'my-guarantee',
    data() {
      return {
        guarantee: [],
        onFetching: false,
        isPosting: false,
        list: [],
        params: {
          status: 1,
          userType: 1,
          pageSize: 10,
          pageNo: 1
        }
      }
    },
    components: {Tab, TabItem, Group, Cell, XTable, Swipeout, SwipeoutItem, SwipeoutButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.getDeposits()
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
          console.log(vm.list, '保证金数据')
          vm.isPosting = false
          vm.processing(0, 1)
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      onItemClick(status) {
        vm.list = []
        status ? vm.params.status = status : delete vm.params.status
        vm.getOrders()
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
        .borBox;
        padding: 88px 0 150px;
        .v-items {
          padding: 20/@rem;
          .bf;
          /*&:not(:last-child) {
            .bor-b;
          }*/
          .wrap {
            .rel;
            .h(140);
          }
          .img-con {
            .abs;
            top: 0;
            .size(140, 140);
            overflow: hidden;
            background: #f5f5f5 url(../../../static/img/noImg.png) no-repeat center;
            -webkit-background-size: cover;
            background-size: cover;
          }
          .infos {
            .flex;
            .flex-d-v;
            .borBox;
            width: 100%;
            height: 100%;
            padding-left: 160/@rem;
            h3 {
              .flex-r(1);
              .fz(26);
              .txt-normal;
              .c3;
              .ellipsis;
            }
            .count {
              .abs;
              right: 0;
              .fz(20);
              .c3;
              i {
                .txt-normal;
                .c9;
              }
            }
            .middle {
              .flex-r(1);
              padding: 10/@rem 0;
              .price {
                .fz(26);
                .cdiy(@c2);
              }
              span {
                &.price {
                  .cdiy(@c2);
                  .fz(26);
                }
                &.sale-count {
                  padding-left: 30/@rem;
                  .c9;
                  .fz(22);
                  i {
                    .txt-normal;
                  }
                }
              }
              .btn-buy {
                .fr;
                padding: 2px 20/@rem;
                .fz(24);
                .cf;
                /*.bdiy(#f16b41);*/
                .bdiy(#5cc5d0);
                .borR(4px);
                &.exchange {
                  background: #eca53f;
                }
              }
            }
            label {
              .flex-r(1);
              .c9;
              .fz(22);
              .ellipsis;
              &.price {
                .cdiy(@c2);
              }
            }
          }
        }
      }
    }
  }
</style>
