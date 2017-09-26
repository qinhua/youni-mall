<template>
  <div class="order-con" ref="home" v-cloak>
    <!--订单tabs-->
    <div class="orders-tab-con">
      <tab class="order-tab" ref="orderTab" active-color="#FE6246">
        <!--<tab-item :selected="!params.status?true:false" @on-item-click="onItemClick">全部</tab-item>-->
        <tab-item :selected="params.status==1?true:false" @on-item-click="onItemClick(1)">待支付</tab-item>
        <tab-item :selected="params.status==2?true:false" @on-item-click="onItemClick(2)">待派送</tab-item>
        <tab-item :selected="params.status==3?true:false" @on-item-click="onItemClick(3)">派送中</tab-item>
        <tab-item :selected="params.status==4?true:false" @on-item-click="onItemClick(4)">已暂停</tab-item>
        <tab-item :selected="params.status==5?true:false" @on-item-click="onItemClick(5)">已完成</tab-item>
      </tab>
    </div>

    <!--订单列表-->
    <div class="orders-list-con">
      <div class="order-list">
        <scroller class="inner-scroller" ref="orderScroller" :on-refresh="refresh" :on-infinite="infinite"
                  refreshText="下拉刷新" :noDataText="orders.length?'就这么多了':' '" snapping>
          <!-- content goes here -->
          <ul>
            <li v-for="(item, index) in orders" v-cloak>
              <section class="v-items" :data-id="item.id"
                       :data-orderNumber="item.appOrderNumber" :data-itemId="item.orderItemId" v-if="orders.length"
                       v-cloak>
                <h4 class="item-top"><i class="ico-seller"
                                        :style="item.sellerImage?'background-image:url('+item.sellerImage+')':''"></i>&nbsp;{{item.sellerName}}&nbsp;&nbsp;<i
                  class="fa fa-angle-right cc"></i><span>{{item.statusName}}</span></h4>
                <ul>
                  <li v-for="itm in item.goodsList" v-cloak>
                    <section class="item-middle">
                      <div class="img-con"
                           :style="itm.goodsImage?('background-image:url('+itm.goodsImage+')'):''"></div>
                      <div class="info-con">
                        <h3><span
                          :class="itm.goodsType==='goods_type.2'?'milk':''">{{itm.goodsType === 'goods_type.2' ? '奶' : '水'}}</span>{{itm.goodsName}}
                        </h3>
                        <section class="middle">
                          <span class="unit-price">￥{{itm.goodsPrice | toFixed}}元</span>
                          <span class="order-info">{{itm.info}}</span>
                          <div class="dispatch-info" v-if="itm.goodsType==='goods_type.2'">
                            <span>已送：{{itm.totalDispatcheNum}}件</span><span>待送：{{itm.waitDispatcheNum}}件</span>
                          </div>
                        </section>
                        <!--<label>{{itm.label}}</label>-->
                      </div>
                      <div class="price-con">
                        <p class="price">总价：￥{{itm.goodsAmount | toFixed}}</p>
                        <p class="buy-count">x{{itm.goodsNum}}</p>
                      </div>
                    </section>
                  </li>
                </ul>
                <section class="item-bottom">
                  <!--<div class="extra-info">
                    <p v-for="(ext, idx) in item.extras">{{ext.name}}<span>￥{{ext.type ? '-' : ''}}{{ext.value}}.00</span>
                    </p>
                  </div>-->
                  <div class="total-price">
                    共{{item.totalGoodsNum}}件商品&nbsp;合计：<span>￥{{item.payAmount | toFixed}}</span>（含上楼费）
                  </div>
                  <!--<a class="btn btn-del" @click="cancelOrder(item.orderId)">取消订单</a>-->
                  <!--<a class="btn btn-del" @click="delOrder(item.orderId)">删除订单</a>-->
                  <div class="btns" v-if="item.status===1">
                    <button class="btn btn-pay" @click="rePay(item.orderId)">支付</button>
                    <button class="btn btn-del" @click="cancelOrder(item.orderId)">取消订单</button>
                  </div>
                  <div class="btns" v-if="item.status===2&&!item.remind">
                    <button type="button" class="btn btn-push" @click="pushOrder(item.orderId)">催单</button>
                  </div>
                  <div class="btns" v-if="item.status===3">
                    <button type="button" class="btn btn-pause" @click="setOrderStatus(item.orderId,4)">暂停派送</button>
                  </div>
                  <div class="btns" v-if="item.status===4">
                    <button type="button" class="btn btn-recovery" @click="setOrderStatus(item.orderId,3)">恢复派送</button>
                  </div>
                  <div class="btns" v-if="item.status===5&&!item.userScore">
                    <!--<button type="button" class="btn btn-appraise" :data-id="item.orderId"
                            v-jump="['appraise',['id'],3]">评价
                    </button>-->
                    <button type="button" class="btn btn-appraise" :data-id="item.orderId"
                            @click="AppraiseOrder(item.orderId)">评价
                    </button>
                  </div>
                  <span class="timestamp">{{item.createTime}}</span>
                </section>
              </section>
            </li>
          </ul>
        </scroller>
      </div>

      <div v-transfer-dom>
        <confirm v-model="showPop"
                 title="订单评价"
                 :close-on-confirm="false"
                 @on-cancel="onCancel"
                 @on-confirm="onConfirm">
          <cell title="您的评分" class="rater">
            <rater v-model="appraise.curOrderScore" slot="value"></rater>
          </cell>
        </confirm>
      </div>

    </div>
    <div class="iconNoData abs-center-vh" v-if="!orders.length"><i></i>
      <p>暂无订单</p></div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars,indent */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {
    Tab,
    TabItem,
    Group,
    Cell,
    Confirm,
    Rater,
    ConfirmPlugin,
    TransferDomDirective as TransferDom
  } from 'vux'
  import {homeApi, orderApi, goodsApi} from '../service/main.js'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'orders',
    directives: {
      TransferDom
    },
    data() {
      return {
        orders: [],
        onFecthing: false,
        isPosting: false,
        noMore: false,
        showPop: false,
        appraise: {
          curOrderId: null,
          curOrderScore: 0
        },
        params: {
          status: 1,
          userType: 1,
          goodsType: 'goods_type.1',
          pagerSize: 10,
          pageNo: 1
        },
        pulldownConfig: {
          content: '下拉刷新',
          height: 60,
          autoRefresh: false,
          downContent: '下拉刷新',
          upContent: '松开以加载',
          loadingContent: '加载中…',
          clsPrefix: 'xs-plugin-pulldown-'
        },
        pullupConfig: {
          content: '上滑加载更多',
          height: 40,
          pullUpHeight: 60,
          autoRefresh: false,
          downContent: '上滑加载',
          upContent: '上滑加载',
          loadingContent: '加载中…',
          clsPrefix: 'xs-plugin-pullup-'
        }
      }
    },
    components: {
      Tab,
      TabItem,
      Group,
      Cell,
      Confirm,
      Rater
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.params.status = vm.$route.params.status || 1
      vm.getOrders()
      vm.$nextTick(function () {
        try {
          vm.$refs.orderScroller.finishInfinite(true)
          vm.$refs.orderScroller.resize()
        } catch (e) {
        }
      })
    },
    /*computed: {},*/
    watch: {
      '$route'(to, from) {
        if (to.name === 'order') {
          vm.params.status = vm.$route.params.status || 1
          vm.getOrders()
        }
      }
    },
    methods: {
      /* 上下拉刷新 */
      /*onScroll(pos) {
       this.scrollTop = pos.top
       },*/
      refresh(done) {
        // console.log('下拉加载')
        setTimeout(function () {
          vm.getOrders()
          vm.$refs.orderScroller.finishPullToRefresh()
        }, 1200)
      },
      infinite(done) {
        // console.log('无限滚动')
        setTimeout(function () {
          vm.getOrders(true)
          vm.$refs.orderScroller.finishInfinite(true)
        }, 1000)
      },
      getOrders(isLoadMore) {
        if (vm.onFecthing) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.processing()
        vm.onFecthing = true
        vm.loadData(orderApi.list, vm.params, 'POST', function (res) {
            vm.onFecthing = false
            vm.processing(0, 1)
            var resD = res.data.pager
            if (resD.itemList.length) {
              for (var i = 0; i < resD.itemList.length; i++) {
                var cur = resD.itemList[i]
                switch (cur.status) {
                  case 1:
                    cur.statusName = '待支付'
                    break
                  case 2:
                    cur.statusName = '待派送'
                    break
                  case 3:
                    cur.statusName = '派送中'
                    break
                  case 4:
                    cur.statusName = '已暂停'
                    break
                  case 5:
                    cur.statusName = '已完成'
                    break
                }
              }
            }
            if (!isLoadMore) {
              if (resD.totalCount < vm.params.pageSize) {
                vm.noMore = true
              } else {
                vm.noMore = false
              }
              vm.orders = resD.itemList
            } else {
              resD.itemList.length ? vm.orders.concat(cur) : vm.noMore = true
            }
            console.log(vm.orders, '订单数据')
          }, function () {
            vm.onFecthing = false
            vm.processing(0, 1)
          }
        )
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
          vm.loadData(orderApi.cancel, {orderId: id}, 'POST', function (res) {
            vm.isPosting = false
            vm.toast('已取消')
            vm.getOrders()
          }, function () {
            vm.toast(res.data || '取消失败')
            vm.isPosting = false
          })
        }, function () {
          // console.log('no')
        })
      },
      pushOrder(id) {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(orderApi.push, {orderId: id}, 'POST', function (res) {
          vm.isPosting = false
          vm.toast('催单成功')
          vm.getOrders()
        }, function () {
          vm.isPosting = false
        })
      },
      AppraiseOrder(id) {
        vm.appraise.curOrderId = id
        vm.showPop = true
      },
      setOrderStatus(id, status) {
        if (vm.isPosting) return false
        vm.isPosting = true
        if (status === 4) {
          vm.confirm('请填写暂停天数', '<div class="depositeModal"><input id="stopDay" type="number" placeholder="输入天数(整数)" required></div>', function () {
            var curVal = window.document.getElementById('stopDay').value
            if (!curVal) {
              vm.toast('请填写天数', 'warn')
              return false
            }
            if (parseInt(curVal) != curVal) {
              vm.toast('请填写整数', 'warn')
              return false
            }
            vm.isPosting = true
            vm.loadData(orderApi.updateOrderStatus, {
              userType: 1,
              id: id,
              status: status,
              stopDay: curVal
            }, 'POST', function (res) {
              vm.isPosting = false
              if (res.success) {
                vm.toast('已暂停')
                vm.$vux.confirm.hide()
                vm.getOrders()
              } else {
                vm.toast(res.message || '操作失败！')
              }
            }, function () {
              vm.isPosting = false
            })
          }, function () {
            vm.isPosting = false
          }, null, null, true)
        } else {
          vm.confirm('确认恢复派送？', null, function () {
            vm.isPosting = true
            vm.loadData(orderApi.updateOrderStatus, {userType: 1, id: id, status: status}, 'POST', function (res) {
              vm.isPosting = false
              if (res.success) {
                vm.toast('已恢复派送')
                vm.getOrders()
              } else {
                vm.toast(res.message || '操作失败！')
              }
            }, function () {
              vm.isPosting = false
            })
          })
        }
      },
      onItemClick(status) {
        vm.orders = []
        status ? vm.params.status = status : delete vm.params.status
        vm.getOrders()
      },
      onCancel() {
        vm.isPosting = false
      },
      onConfirm(msg) {
        var curVal = window.document.querySelector('.vux-rater input').value
        console.log(curVal)
        if (curVal == 0) {
          vm.toast('请先评分！', 'warn')
          return false
        } else {
          if (vm.isPosting) return false
          vm.isPosting = true
          vm.loadData(orderApi.score, {
            orderId: vm.appraise.curOrderId,
            score: curVal
          }, 'POST', function (res) {
            vm.isPosting = false
            vm.toast('评价成功')
            vm.showPop = false
            vm.getOrders()
          }, function () {
            vm.isPosting = false
          })
        }
      },
      rePay(id) {
        if (!me.isWeixin) {
          vm.toast('请在微信中操作！')
          return
        }
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(orderApi.repay, {orderId: id}, 'POST', function (res) {
          vm.isPosting = false
          if (res.success && res.data) {
            // alert(JSON.stringify(res.data))
            vm.pay(res.data)
          } else {
            if (res.errorCode == 304) {
              vm.toast('请先绑定手机号！')
              setTimeout(function () {
                vm.jump('bind')
              }, 800)
            } else {
              vm.toast(res.message || '支付失败！')
            }
          }
        }, function () {
          vm.isPosting = false
        })
      },
      pay(data) {
        wx.config({
          debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timeStamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.paySign,// 必填，签名，见附录1
          jsApiList: [
            'chooseWXPay'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
          // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
          wx.chooseWXPay({
            appId: data.appId,
            timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
            package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: data.paySign, // 支付签名
            success: function (res) {
              // 支付成功后的回调函数
              vm.getOrders()
            }
          })
        })
        wx.error(function (res) {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          // alert(JSON.stringify(res))
          vm.getOrders()
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';

  .order-con {
    height: 100%;
    /*overflow-y: scroll; // 此两个属性至关重要，不写@scroll监听不到滚动*/

    .vux-x-switch {
      .fz(24) !important;
      .weui-switch:checked {
        border-color: #fd826c;
        background-color: #fd826c;
      }
    }

    .orders-tab-con {
      .fix;
      width: 100%;
      top: 0;
      z-index: 20;
    }

    .orders-list-con {
      height: 100%;
    }

    .order-list {
      .rel;
      height: 100%;
      .order-tab {
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
      .inner-scroller {
        .borBox;
        padding: 43px 0 50px;
        .v-items {
          .borBox;
          margin-bottom: 20/@rem;
          /*padding: 0 20/@rem 20/@rem;*/
          .bf;
          .bsd(0, 2px, 10px, 0, #ccc);
          .bor-t(1px, solid, #ddd);
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
            .rel;
            padding: 14/@rem 20/@rem;
            min-height: 160/@rem;
            .bf8;
            .bor-b;
            .img-con {
              .abs;
              top: 14/@rem;
              padding: 10/@rem 0;
              .size(140, 120);
              overflow: hidden;
              background: #f5f5f5 url(../../static/img/bg_nopic.jpg) no-repeat center;
              -webkit-background-size: cover;
              background-size: cover;
            }
            .info-con {
              .borBox;
              width: 100%;
              padding: 0 0 0 160/@rem;
              h3 {
                padding-bottom: 10/@rem;
                .txt-normal;
                .c3;
                .fz(26);
                .ellipsis-clamp-2;
                span {
                  margin-right: 4px;
                  padding: 0 2px;
                  font-weight: normal;
                  .cf;
                  .fz(22);
                  background: #2acaad;
                  .borR(2px);
                  &.milk {
                    background: #74c361;
                  }
                }
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
              label {
                .fz(22);
                .progress {
                  span {
                    padding-right: 20/@rem;
                  }
                }
              }
            }
            .price-con {
              .abs;
              .borBox;
              padding: 14/@rem 20/@rem;
              height: 160/@rem;
              top: 0;
              right: 0;
              .price {
                padding-bottom: 10/@rem;
                .c3;
                .fz(24);
              }
              .buy-count {
                .fr;
                .right;
                .c9;
                .fz(22);
              }
            }
            .dispatch-info {
              span {
                padding-right: 28/@rem;
              }
            }
          }
          &.grey {
            .c9!important;
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
            span {
              .fz(30);
            }
          }
          .btns {
            padding: 20/@rem 20/@rem;
            overflow: hidden;
            .bor-t;
            button {
              .fr;
              padding: 4px 40/@rem;
              margin-left: 20/@rem;
              .c3;
              .fz(22);
              .bf;
              .borR(50px);
              &:disabled {
                .c9!important;
                .bor(1px, solid, #999) !important;
              }
              &.btn-cancel, &.btn-del {
                .c6;
                .bor(1px, solid, #ccc);
              }
              &.btn-push, &.btn-appraise, &.btn-pay, &.btn-pause, &.btn-recovery {
                .cdiy(@c2);
                .bor(1px, solid, @c2);
              }
            }
            .status-txt {
              .cdiy(@c3);
              &.disabled {
                .c9;
              }
            }
          }
          .timestamp {
            display: block;
            padding: 0 22/@rem 20/@rem;
            .right;
            .c9;
            .fz(22);
          }
        }
      }
    }
  }

</style>
