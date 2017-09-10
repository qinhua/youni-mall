<template>
  <div class="order" v-cloak>
    <tab class="order-tab" active-color="#f34c18">
      <tab-item :selected="!params.status?true:false" @on-item-click="onItemClick">全部</tab-item>
      <tab-item :selected="params.status==1?true:false" @on-item-click="onItemClick(1)">待支付</tab-item>
      <tab-item :selected="params.status==2?true:false" @on-item-click="onItemClick(2)">待派送</tab-item>
      <tab-item :selected="params.status==3?true:false" @on-item-click="onItemClick(3)">派送中</tab-item>
      <tab-item :selected="params.status==4?true:false" @on-item-click="onItemClick(4)">暂停中</tab-item>
      <tab-item :selected="params.status==5?true:false" @on-item-click="onItemClick(5)">已完成</tab-item>
    </tab>
    <div class="order-list">
      <scroller class="inner-scroller" ref="orderScroller" :on-refresh="refresh" :on-infinite="infinite"
                refreshText="下拉刷新" noDataText="" snapping>
        <!-- content goes here -->
        <section class="v-items" v-for="(item, index) in orders" :data-id="item.orderId"
                 :data-orderNumber="item.appOrderNumber" :data-itemId="item.orderItemId">
          <!--<h4 class="item-top"><i class="ico-store"></i>&nbsp;{{item.sellerName}}&nbsp;&nbsp;<i class="fa fa-angle-right cc"></i><span>{{item.statusName}}</span></h4>-->
          <section class="item-middle">
            <div class="img-con">
              <img :src="item.goodsImage">
            </div>
            <div class="info-con">
              <h3>{{item.goodsName}}</h3>
              <section class="middle">
                <span class="unit-price">￥{{item.goodsPrice}}</span>
                <span class="order-info">{{item.info}}</span>
              </section>
              <label>{{item.label}}</label>
            </div>
            <div class="price-con">
              <p class="price">￥{{item.goodsPrice * item.goodsAmount}}</p>
              <p class="buy-count">x{{item.goodsAmount}}</p>
            </div>
          </section>
          <section class="item-bottom">
            <!--<div class="extra-info">
              <p v-for="(ext, idx) in item.extras">{{ext.name}}<span>￥{{ext.type ? '-' : ''}}{{ext.value}}.00</span></p>
            </div>-->
            <div class="btns" v-if="item.status===-1">
              <a class="btn btn-del" @click="delOrder(item.orderId)">删除订单</a>
            </div>
            <!--<div class="btns" v-if="item.status===0">
              <a class="btn btn-pay" @click="payOrder(item.orderId)">支付</a>
              <a class="btn btn-cancel" @click="cancelOrder(item.orderId)">取消订单</a>
            </div>-->
            <div class="btns" v-if="item.status===1">
              <a class="btn btn-cancel" @click="payOrder(item.orderId)">支付</a>
              <a class="btn btn-del" @click="cancelOrder(item.orderId)">取消订单</a>
            </div>
            <div class="btns" v-if="item.status===2">
              <a class="btn btn-cancel" @click="pushOrder(item.orderId)">催单</a>
              <a class="btn btn-del" @click="cancelOrder(item.orderId)">取消订单</a>
            </div>
            <div class="btns" v-if="item.status===4">
              <!--<a class="btn btn-appraise" @click="toAppraise(item.orderId)">评价</a>-->
              <a class="btn btn-del" @click="delOrder(item.orderId)">删除订单</a>
            </div>
          </section>
        </section>
      </scroller>
    </div>
    <div class="iconNoData abs-center-vh" v-if="!orders.length"><i></i><p>暂无订单</p></div>
  </div>
</template>
<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Tab, TabItem} from 'vux'
  import {orderApi,commonApi} from '../service/main.js'
  export default {
    name: 'order',
    data () {
      return {
        orders: [],
        params: {
          userType: 1,
          pagerSize: 10,
          pageNo: 1
        },
        noMore: false,
        isPosting: false
      }
    },
    components: {Tab, TabItem},
    beforeMount() {
      me = window.me
    },
    mounted () {
      vm = this
      vm.getOrders()
      vm.$nextTick(() => {
        vm.$refs.orderScroller.finishInfinite(true)
        vm.$refs.orderScroller.resize()
      })
    },
    computed: {},
    watch: {
      '$route' (to, from) {
        if(to.name==='order'){
          vm.params.status = vm.$route.params.status
          vm.getOrders()
        }
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus (data) {
        this.$emit('listenPage', data)
      },
      toAppraise (id) {
        this.$router.push({path: '/appraise' + (param ? '/' + param : '')})
      },
      refresh (done) {
        console.log('下拉加载')
        setTimeout(function () {
          vm.getOrders()
          vm.$refs.orderScroller.finishPullToRefresh()
        }, 1200)
      },
      infinite (done) {
        console.log('无限滚动')
        setTimeout(function () {
          vm.getOrders(true)
          vm.$refs.orderScroller.finishInfinite(true)
        }, 1000)
      },
      onItemClick (status) {
        status ? vm.params.status = status : delete vm.params.status
        vm.getOrders()
      },
      getOrders (isLoadMore) {
        if (vm.isPosting) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.processing()
        vm.isPosting = true
        vm.loadData(orderApi.list, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          var resD = res.data.pager
          if(resD.itemList.length){
            for (var i = 0; i < resD.itemList.length; i++) {
              var cur=resD.itemList[i]
              switch (cur.status) {
                case -1:
                  cur.statusName = '已取消'
                  break
                case 1:
                  cur.statusName = '待支付'
                  break
                case 2:
                  cur.statusName = '待派送'
                  break
                case 3:
                  cur.statusName = '派送中'
                  break
                /*case 3:
                  cur.statusName = '待评价'
                  break*/
                case 4:
                  cur.statusName = '已完成'
                  break
              }
            }
          }
          if (!isLoadMore) {
            if (resD.totalCount < vm.params.pageSize) {
              vm.noMore = true
            }else{
              vm.noMore = false
            }
            vm.orders = resD.itemList
          } else {
            resD.itemList.length ? vm.orders.concat(resD.itemList) : vm.noMore = true
          }
          console.log(vm.orders, '订单数据')
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      delOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '订单删除后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.del, {id: id}, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      cancelOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认取消？', '订单取消后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.cancel, {id: id}, 'POST', function (res) {
            vm.isPosting = false
            vm.toast('已取消')
          }, function () {
            vm.toast('取消失败')
            vm.isPosting = false
          })
        }, function () {
          // console.log('no')
        })
      },
      pushOrder(id) {
        if (vm.isPosting) return false
        vm.confirm('确认催单？', '请不要频繁催单！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.push, {id: id}, 'POST', function (res) {
            vm.toast('催单成功')
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        })
      },
      payOrder (id) {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(commonApi.wxPay, {orderId:id}, 'POST', function (res) {
          vm.isPosting = false
          var resD=res.data
          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: resD.appId, // 必填，公众号的唯一标识
            timestamp:resD.timeStamp , // 必填，生成签名的时间戳
            nonceStr: resD.nonceStr, // 必填，生成签名的随机串
            signature: resD.paySign,// 必填，签名，见附录1
            jsApiList: [
              'chooseWXPay'
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function(){
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            wx.chooseWXPay({
              appId:resD.appId,
              timestamp: resD.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: resD.nonceStr, // 支付签名随机串，不长于 32 位
              package: resD.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
              signType: resD.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: resD.paySign, // 支付签名
              success: function (res) {
                // 支付成功后的回调函数
                vm.$router.push({path:'/order'})
              }
            })
          })
          wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            // alert(JSON.stringify(res))
          })
        }, function () {
          vm.isPosting = false
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
    .inner-scroller {
      .borBox;
      padding: 44px 0 50px;
      .v-items {
        .borBox;
        margin-bottom: 20/@rem;
        /*padding: 0 20/@rem 20/@rem;*/
        .bf;
        .bor-t;
        /*.bsd(0, 2px, 10px, 0, #ccc);*/
        .item-top {
          padding: 14/@rem 20/@rem;
          .txt-normal;
          .c3;
          .fz(24);
          .bor-b;
          .ico-store {
            .fl;
            display: inline-block;
            margin-top: 2/@rem;
            font-size: inherit;
            .size(30, 30);
            background: url(../../static/img/ico_store.png);
            .ele-base;
          }
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
            overflow: hidden;
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
  }
</style>
