<template>
  <div class="my-coupons">
    <div class="content">
      <tab class="order-tab" active-color="#f34c18">
        <tab-item :selected="params.type==0?true:false" @on-item-click="onItemClick">全部</tab-item>
        <tab-item :selected="params.type==1?true:false" @on-item-click="onItemClick(1)">优惠券</tab-item>
        <tab-item :selected="params.type==1?true:false" @on-item-click="onItemClick(1)">水票券</tab-item>
        <tab-item :selected="params.type==2?true:false" @on-item-click="onItemClick(2)">红包</tab-item>
        <tab-item :selected="params.type==3?true:false" @on-item-click="onItemClick(3)">其它</tab-item>
      </tab>
      <scroller class="coupon-list" :on-refresh="refresh" :on-infinite="infinite" refreshText="下拉刷新" noDataText="没有更多数据" snapping>
        <!-- content goes here -->
        <section class="v-items" v-for="(item, index) in orders" :data-id="item.id">
          <div class="stamp type-coupon">
            <div class="wrap">
              <div class="par">
                <p>XXXXXX折扣店</p>
                <div class="value">
                  <sub class="sign">￥</sub>
                  <span>50.00</span>
                  <sub class="type">优惠券</sub>
                </div>
                <p class="info">订单满100.00元</p>
              </div>
              <div class="copy">副券<p>2015-08-13<br>2016-08-13</p></div>
            </div>
            <i></i>
          </div>
          <div class="stamp type-ticket">
            <div class="wrap">
              <div class="par">
                <p>XXXXXX折扣店</p>
                <div class="value">
                  <sub class="sign">￥</sub>
                  <span>50.00</span>
                  <sub class="type">优惠券</sub>
                </div>
                <p class="info">订单满100.00元</p>
              </div>
              <div class="copy">副券<p>2015-08-13<br>2016-08-13</p></div>
            </div>
            <i></i>
          </div>
          <div class="stamp type-redpacket">
            <div class="wrap">
              <div class="par">
                <p>XXXXXX折扣店</p>
                <div class="value">
                  <sub class="sign">￥</sub>
                  <span>50.00</span>
                  <sub class="type">优惠券</sub>
                </div>
                <p class="info">订单满100.00元</p>
              </div>
              <div class="copy">副券<p>2015-08-13<br>2016-08-13</p></div>
            </div>
            <i></i>
          </div>
          <div class="stamp type-expired">
            <div class="wrap">
              <div class="par">
                <p>XXXXXX折扣店</p>
                <div class="value">
                  <sub class="sign">￥</sub>
                  <span>50.00</span>
                  <sub class="type">优惠券</sub>
                </div>
                <p class="info">订单满100.00元</p>
              </div>
              <div class="copy"><span class="exp">已过期</span></div>
            </div>
            <i></i>
          </div>
        </section>
      </scroller>
    </div>
  </div>
</template>
<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Tab, TabItem} from 'vux'
  import {orderApi, userApi} from '../../store/main.js'

  export default {
    name: 'my-coupons',
    data () {
      return {
        show: false,
        curOrderFilter: '',
        orders: [],
        params: {
          type: 0,
          pagerSize: 10,
          pageNo: 1,
          goodsType: 'XXX',
          goodsCategory: '',
          brandId: '',
          filter: ''
        },
        onFetching: false,
        isPosting: false,
      }
    },
    components: {Tab, TabItem},
    beforeMount() {
      me = window.me
    },
    mounted () {
      vm = this
      vm.getOrders()
    },
    computed: {},
    watch: {
      '$route' (to, from) {
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
        }, 2000)
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
        vm.params.type = vm.$route.params.type
        if (vm.onFetching) return false
        vm.processing()
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
          vm.processing(0, 1)
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      delOrder (id) {
        vm.confirm('确认删除？', '订单删除后不可恢复！', function () {
          vm.loadData(orderApi.delOrder + '?id=' + id, vm.params, 'POST', function (res) {
            vm.isPosting = true
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      cancelOrder (id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '订单删除后不可恢复！', function () {
          vm.loadData(orderApi.delOrder, vm.params, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
          // console.log('no')
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../../static/css/tools.less';

  .my-coupons {
    height: 100%;
    overflow: hidden;
    .bf;
    .ads {
      .rel;
      z-index: 10;
      height: 210/@rem;
    }
    .content {
    }
  }

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

  .coupon-list {
    .borBox;
    width: 100%;
    height: auto !important;
    padding:50px 0 30px 0;
    .v-items {
      .borBox;
      width:100%;
      margin-bottom: 20/@rem;
      .stamp {
        .rel;
        .borBox;
        width:94%;
        min-height:200/@rem;
        padding:0 30/@rem;
        margin: 0 auto 16/@rem;
        overflow: hidden;
        &:before{
          .abs;
          .block;
          top: 0;
          left: 0;
          width: 20px;
          height: 100%;
          content:'';
        }
        &:after{
          .abs;
          .block;
          top: 0;
          right: 0;
          width: 20px;
          height: 100%;
          content:'';
        }
        .wrap {
          .flex;
          .borBox;
          .abs;
          padding:20/@rem 0 20/@rem 20/@rem;
          content: '';
          top:0;
          bottom:0;
          left:10px;
          right:10px;
          z-index: -1;
          background-color:#f1a83f;
        }
        i {
           position: absolute;
           right: -20%;
           top: 120/@rem;
           height: 300/@rem;
           width:320px;
            z-index: 5;
           .fz(24);
           background-color: rgba(255, 255, 255, .15);
           transform: rotate(-30deg);
         }
        .par {
          .rel;
          .flex-r(3);
          z-index:5;
          .left;
          border-right:2px dashed rgba(255, 255, 255, .3);
          p {
            padding-top:5/@rem;
            color:#fff;
            .fz(24);
          }
          .value{
              padding:10/@rem 0;
              span {
                .fz(48);
                color:#fff;
                margin-right: 14/@rem;
                line-height: 60/@rem;
              }
              .sign, .type {
                position: relative;
                top:0;
                .fz(24);
                color:rgba(255, 255, 255, .8);
              }
              .info{
                .cdiy(#ffe041);
              }
            }
        }
        .copy {
          .rel;
          .flex-r(1);
          .rel;
          z-index: 5;
          padding:30/@rem;
          .fz(32);
          .center;
          color:rgb(255,255,255);
          .exp{
            .abs-center-vh;
          }
          p {
            .fz(18);
            margin-top: 10/@rem;
          }
        }
        &.type-coupon {
          &:before {
            background: -webkit-radial-gradient(transparent 0, transparent 5px,#f1a83f 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #f1a83f 5px) repeat-y;
            background-size: 20px 18px;
            background-position: -10px 3px;
          }
          &:after {
            background: -webkit-radial-gradient(transparent 0, transparent 5px,#f1a83f 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #f1a83f 5px) repeat-y;
            background-size: 20px 18px;
            background-position: 10px 3px;
          }
          .wrap {
            background-color:#f1a83f;
          }
        }
        &.type-ticket {
          &:before {
            background: -webkit-radial-gradient(transparent 0, transparent 5px,#3fa1f1 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #3fa1f1 5px) repeat-y;
            background-size: 20px 18px;
            background-position: -10px 3px;
          }
          &:after {
            background: -webkit-radial-gradient(transparent 0, transparent 5px,#3fa1f1 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #3fa1f1 5px) repeat-y;
            background-size: 20px 18px;
            background-position: 10px 3px;
          }
          .wrap {
            background-color:#3fa1f1;
          }
        }
        &.type-redpacket {
          &:before {
            background: -webkit-radial-gradient(transparent 0, transparent 5px,#D24161 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #D24161 5px) repeat-y;
            background-size: 20px 18px;
            background-position: -10px 3px;
          }
          &:after {
            background: -webkit-radial-gradient(transparent 0, transparent 5px,#D24161 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #D24161 5px) repeat-y;
            background-size: 20px 18px;
            background-position: 10px 3px;
          }
          .wrap {
            background-color:#D24161;
          }
        }
        &.type-expired {
          &:before {
            background: -webkit-radial-gradient(transparent 0, transparent 5px,#bbb 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #bbb 5px) repeat-y;
            background-size: 20px 18px;
            background-position: -10px 3px;
          }
          &:after {
            background: -webkit-radial-gradient(transparent 0, transparent 5px,#bbb 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #bbb 5px) repeat-y;
            background-size: 20px 18px;
            background-position: 10px 3px;
          }
          .wrap {
            background-color:#bbb;
          }
        }
      }
    }
  }
</style>
