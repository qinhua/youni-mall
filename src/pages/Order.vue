<template>
  <div class="order">
    <tab class="order-tab" active-color="#f34c18">
      <tab-item :selected="!params.type?true:false" @on-item-click="onItemClick">全部</tab-item>
      <tab-item :selected="params.type===0?true:false" selected @on-item-click="onItemClick(0)">待支付</tab-item>
      <tab-item :selected="params.type===1?true:false" @on-item-click="onItemClick(1)">待派送</tab-item>
      <tab-item :selected="params.type===2?true:false" @on-item-click="onItemClick(2)">待评价</tab-item>
      <tab-item :selected="params.type===3?true:false" @on-item-click="onItemClick(3)">已完成</tab-item>
    </tab>
    <scroller class="order-list" :on-refresh="refresh" :on-infinite="infinite" refreshText="下拉刷新" noDataText="没有更多数据"
              snapping>
      <!-- content goes here -->
      <section class="v-items" v-for="(item, index) in orders" :data-id="item.id">
        <h4 class="item-top"><i class="fa fa-shopping-bag"></i>&nbsp;{{item.sellerName}}&nbsp;&nbsp;<i
          class="fa fa-angle-right cc"></i><span>{{item.statusName}}</span></h4>
        <section class="item-middle">
          <div class="img-con">
            <img :src="item.imgurl">
          </div>
          <div class="info-con">
            <h3>{{item.productName}}</h3>
            <section class="middle">
              <span class="unit-price">￥{{item.unitPrice}}</span>
              <span class="order-info">{{item.info}}</span>
            </section>
            <label>{{item.label}}</label>
          </div>
          <div class="price-con">
            <p class="price">￥{{item.price}}</p>
            <p class="buy-count">x{{item.buyCount}}</p>
          </div>
        </section>
        <section class="item-bottom">
          <div class="extra-info">
            <p v-for="(ext, idx) in item.extras">{{ext.name}}<span>￥{{ext.type?'-':''}}{{ext.value}}.00</span></p>
          </div>
          <div class="total-price">共{{item.buyCount}}件商品&nbsp;合计：<span>￥{{item.total}}</span>.00（含上楼费）</div>
          <div class="btns" v-if="item.status===-1">
            <a class="btn btn-del">删除订单</a>
          </div>
          <div class="btns" v-if="item.status===0">
            <a class="btn btn-pay">支付</a>
            <a class="btn btn-cancel">取消订单</a>
          </div>
          <div class="btns" v-if="item.status===1">
            <a class="btn btn-push">催单</a>
            <a class="btn btn-cancel">取消订单</a>
          </div>
          <div class="btns" v-if="item.status===2">
            <a class="btn btn-cancel">取消订单</a>
          </div>
          <div class="btns" v-if="item.status===3">
            <a class="btn btn-appraise">评价</a>
            <a class="btn btn-del">删除订单</a>
          </div>
          <div class="btns" v-if="item.status===4">
            <a class="btn btn-del">删除订单</a>
          </div>
        </section>
      </section>
    </scroller>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  var me
  var vm
  import {Tab, TabItem} from 'vux'
  import {orderApi} from '../store/home.js'
  export default {
    name: 'order',
    data () {
      return {
        curOrderFilter: '',
        orders: [],
        params: {
          type: '',
          pagerSize: 10,
          pageNo: 1,
          goodsType: 'XXX',
          goodsCategory: '',
          brandId: '',
          filter: '',
          onFetching: false
        }
      }
    },
    components: {Tab, TabItem},
    beforeMount () {
      me = window.me
    },
    mounted () {
      vm = this
      vm.getOrders()
      console.log(vm.$route.params.type)
    },
    computed: {
      'params.type' () {
        return this.$route.params.type
      }
    },
    watch: {
      '$route' (to, from) {
        console.log(vm.params.type)
        vm.params.type = vm.$route.params.type
        vm.getOrders()
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus (data) {
        this.$emit('listenPage', data)
      },
      refresh (done) {
        console.log('下拉加载')
        setTimeout(function () {
          vm.getOrders()
        }, 1200)
      },
      infinite (done) {
        console.log('无限滚动')
        setTimeout(function () {
          vm.getOrders(true)
        }, 1200)
      },
      onItemClick (type) {
        if (type === 'undefined') {
          vm.params.type = ''
        } else {
          vm.params.type = type
        }
        vm.getOrders()
      },
      filterTicket (type, isMine) {
        vm.curTicketFilter = type
        vm.getOrders()
      },
      getOrders (isLoadMore) {
        if (vm.onFetching) return false
        vm.onFetching = true
        vm.loadData(orderApi.orders, vm.params, 'POST', function (res) {
          var resD = res.data.itemList
          for (var i = 0; i < resD.length; i++) {
            switch (resD[i].status) {
              case -1:
                resD[i].statusName = '已取消'
                break
              case 0:
                resD[i].statusName = '待支付'
                break
              case 1:
                resD[i].statusName = '待派送'
                break
              case 2:
                resD[i].statusName = '派送中'
                break
              case 3:
                resD[i].statusName = '待评价'
                break
              case 4:
                resD[i].statusName = '已完成'
                break
            }
          }
          if (!isLoadMore) {
            vm.orders = resD
          } else {
            vm.orders.push(resD, '订单数据')
          }
          console.log(vm.orders)
          vm.onFetching = false
        }, function () {
          vm.onFetching = false
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../static/css/tools.less';

  .order-tab {
    z-index: 10;
    .vux-tab-item {
      .rel;
      .vux-tab-item-badge {
        top: -20px;
        right: 0;
      }
    }
  }

  .order-list {
    .borBox;
    padding: 44px 0 50px;
    .v-items {
      .borBox;
      margin-bottom: 20/@rem;
      /*padding: 0 20/@rem 20/@rem;*/
      .bf;
      .bsd(0, 2px, 10px, 0, #ccc);
      .item-top {
        padding: 14/@rem 20/@rem;
        .txt-normal;
        .c3;
        .fz(24);
        .bor-b;
        span {
          .fr;
          .fz(22);
          .cdiy(@c2);
        }
      }
      .item-middle {
        padding: 14/@rem 20/@rem;
        .flex;
        .bf8;
        .img-con {
          .rel;
          .size(130, 130);
          img {
            width: 100%;
            .abs-center-vh;
          }
        }
        .info-con {
          .flex-r(2);
          padding: 0 14/@rem;
          h3 {
            padding-bottom: 10/@rem;
            .txt-normal;
            .c3;
            .fz(26);
            .ellipsis-clamp-2;
          }
          .middle {
            .c9;
            .fz(22);
            .ellipsis-clamp-2;
            .unit-price {
              padding-right: 40/@rem;
              .c3;
              .fz(24);
            }
          }
        }
        .price-con {
          .flex-r(1);
          .right;
          .price {
            padding-bottom: 10/@rem;
            .c3;
            .fz(24);
          }
          .buy-count {
            .c9;
            .fz(22);
          }
        }
      }
      .item-bottom {
        .extra-info {
          margin-top: 2px;
          padding: 10/@rem 20/@rem;
          .bf8;
          p {
            .fz(22);
            .c3;
            span {
              .fr;
            }
            &:not(:last-child) {
              padding-bottom: 10/@rem;
            }
          }
        }
        .total-price {
          padding: 10/@rem 20/@rem;
          .right;
          .c3;
          .fz(22);
          .bor;
          span {
            .fz(30);
          }
        }
        .btns {
          padding: 20/@rem 20/@rem;
          overflow: hidden;
          a {
            .fr;
            padding: 4px 40/@rem;
            margin-left: 20/@rem;
            .cf;
            .fz(22);
            .borR(50px);
            &.btn-cancel, &.btn-del {
              .c6;
              .bor(1px, solid, #ccc);
            }
            &.btn-push, &.btn-appraise, &.btn-pay {
              .cdiy(@c2);
              .bor(1px, solid, @c2);
            }
          }
        }
      }
      &.grey {
        .c9!important;
      }
    }
  }
</style>
