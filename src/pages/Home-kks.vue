<template>
  <div class="home-con" ref="home" v-cloak>
    <!--banner-->
    <!-- <div class="swiper-home">
       <swiper ref="slider01" skey="s01" :slides="banner" autoPlay="2500"></swiper>
     </div>-->
    <div class="overview" v-cloak>
      <a href="#/user" class="top-seller-avatar">
        <img :src="seller.headimgurl" alt="店铺头像" v-if="seller.headimgurl" v-cloak>
        <i class="fa fa-user-circle-o user-center" v-else></i>
      </a>
      <div class="top">
        <p class="today">今日收入(元)</p>
        <h2>
          <countup :start-val="0"
                   :end-val="overview.today.totalPayAmount ? parseInt(overview.today.totalPayAmount.toFixed(2)) : 0.00"
                   :decimals="2"
                   :duration="2"></countup>
        </h2>
        <p class="yesterday">
          昨日：{{overview.yesterday.totalPayAmount ? parseInt(overview.yesterday.totalPayAmount.toFixed(2)) : 0.00}}</p>
      </div>
      <div class="bottom">
        <div class="col left-col">
          <p class="today">成交数</p>
          <h2 class="total">{{overview.today.payCount}}</h2>
          <p class="yesterday">昨日{{overview.yesterday.payCount}}</p>
        </div>
        <div class="col right-col">
          <p class="today">订单数</p>
          <h2 class="total">{{overview.today.orderCount}}</h2>
          <p class="yesterday">昨日{{overview.yesterday.orderCount}}</p>
        </div>
      </div>
    </div>

    <!--中间入口-->
    <div class="middle-entry">
      <grid :rows="5">
        <grid-item label="商品管理" link="/goods_items">
          <img slot="icon" src="../../static/img/item_goods.png">
        </grid-item>
        <grid-item label="店铺管理" link="/store_items">
          <img slot="icon" src="../../static/img/item_store.png">
        </grid-item>
        <grid-item label="客户管理" link="/clients">
          <img slot="icon" src="../../static/img/item_client.png">
        </grid-item>
        <grid-item label="资金管理" link="/assets">
          <img slot="icon" src="../../static/img/item_assets.png">
        </grid-item>
        <grid-item label="统计数据" link="/statistic">
          <img slot="icon" src="../../static/img/item_statistic.png">
        </grid-item>
      </grid>
      <!--<div class="top-notice" v-if="notice.length">
        <div class="inner">
          <div class="ico ico-toutiao"></div>
          <marquee>
            <marquee-item v-for="(news, i) in notice" :key="i" :data-id="news.noticeId"
                          @click.native="toTopic(news.linkUrl)"
                          class="align-middle">{{news.content}}
            </marquee-item>
          </marquee>
        </div>
      </div>-->
    </div>

    <!--订单列表-->
    <div class="orders-list-con">
      <sticky ref="sticky">
        <tab class="order-tab" ref="orderTab" active-color="#FE6246">
          <!--<tab-item :selected="!params.status?true:false" @on-item-click="onItemClick">全部</tab-item>-->
          <tab-item :selected="params.status==1?true:false" @on-item-click="onItemClick(1)">待支付</tab-item>
          <tab-item :selected="params.status==2?true:false" @on-item-click="onItemClick(2)">待派送</tab-item>
          <tab-item :selected="params.status==3?true:false" @on-item-click="onItemClick(3)">派送中</tab-item>
          <tab-item :selected="params.status==4?true:false" @on-item-click="onItemClick(4)">已暂停</tab-item>
          <tab-item :selected="params.status==5?true:false" @on-item-click="onItemClick(5)">已完成</tab-item>
        </tab>
      </sticky>

      <div :class="'order-list' + (orders.length?' hasContent':'')">
        <scroller class="inner-scroller" ref="orderScroller" :on-refresh="refresh" :on-infinite="infinite"
                  refreshText="下拉刷新" noDataText="没有更多数据" snapping>
          <!-- content goes here -->
          <ul>
            <li v-for="(item, index) in orders" v-cloak>
              <section class="v-items" :data-id="item.id"
                       :data-orderNumber="item.appOrderNumber" :data-itemId="item.orderItemId">
                <h4 class="item-top"><i class="ico-avatar"
                                        :style="item.userImage?'background-image:url('+item.userImage+')':''"></i>&nbsp;{{item.userName}}&nbsp;&nbsp;<i
                  class="fa fa-angle-right cc"></i><span>{{item.statusName}}</span><span class="remind-txt"
                                                                                         v-if="item.status===2&&item.remind">收到买家派送提醒</span>
                </h4>
                <ul>
                  <li v-for="itm in item.goodsList" v-cloak>
                    <section class="item-middle">
                      <div class="img-con">
                        <img :src="itm.goodsImage">
                      </div>
                      <div class="info-con">
                        <h3>{{itm.goodsName}}</h3>
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
                  <!--<div class="btns" v-if="item.status===1">-->
                  <!--<a class="btn btn-cancel" @click="pushPay(item.orderId)">提醒支付</a>-->
                  <!--<a class="btn btn-del" @click="cancelOrder(item.orderId)">取消订单</a>-->
                  <!--</div>-->
                  <div class="btns" v-if="item.status===2">
                    <button type="button" class="btn btn-dispatch" @click="dispatch(item.orderId)">派送</button>
                  </div>
                  <div class="btns" v-if="item.status===3">
                    <div v-if="item.todayDispatch">
                      <span class="status-txt">当天已派送</span>
                      <button type="button" disabled class="btn btn-dispatch" @click="dispatch(item.orderId)">派送
                      </button>
                    </div>
                    <div v-else>
                      <span class="status-txt disabled">当天未派送</span>
                      <button type="button" class="btn btn-dispatch" @click="dispatch(item.orderId)">派送</button>
                    </div>
                  </div>
                  <div class="score-info" v-if="item.status===5">
                    <!--<span>买家评分：{{item.userScore}}星</span>-->
                    <div class="has-score" v-if="item.userScore">
                      <span>买家评分：</span>
                      <ol class="star">
                        <li v-for="star in item.userScore">★</li>
                      </ol>
                      <span>{{item.userScore}}星</span>
                    </div>
                    <span v-else>买家未评价</span>
                  </div>
                  <span class="timestamp">{{item.createTime}}</span>
                </section>
              </section>
            </li>
          </ul>
        </scroller>
      </div>
    </div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars,indent */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import Swiper from '../components/Swiper'
  import {
    Group,
    GroupTitle,
    Grid,
    GridItem,
    Marquee,
    MarqueeItem,
    Countup,
    Tab,
    TabItem,
    XSwitch,
    Sticky
  } from 'vux'
  import {homeApi, userApi, orderApi, goodsApi} from '../service/main.js'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'home',
    data() {
      return {
        geo: null,
        location: '',
        seller: {},
        overview: {
          today: {
            orderCount: 0,
            payCount: 0,
            totalPayAmount: 0
          },
          yesterday: {
            orderCount: 0,
            payCount: 0,
            totalPayAmount: 0
          }
        },
        type: 0,
        orders: [],
        scrollTop: 0,
        onFecthing: false,
        isPosting: false,
        noMore: false,
        params: {
          status: 1,
          userType: 2,
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
      Group,
      GroupTitle,
      Grid,
      GridItem,
      Marquee,
      MarqueeItem,
      Countup,
      Tab,
      TabItem,
      XSwitch,
      Sticky
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.params.status = vm.$route.params.status || 1
      vm.getSeller()
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
        if (to.name === 'home') {
          vm.params.status = vm.$route.params.status || 1
          vm.getOrders()
        }
      }
    },
    methods: {
      scrollHandler() {
        // 监听dom的scroll事件
        setTimeout(function () {
          let scrollTop = vm.$refs.home.scrollTop
          let target = vm.$refs.orderTab
          let list = vm.$refs.goodsList
          if (vm.showFilterCon) {
            vm.hideFilter()
          }
          if (scrollTop >= vm.orderOffset) {
            target.classList.add('fixed')
            list.classList.add('fixed')
          } else {
            target.classList.remove('fixed')
            list.classList.remove('fixed')
          }
        }, 300)
      },
      /* 页面数据 */
      changeType() {
      },
      /* 上下拉刷新 */
      onScroll(pos) {
        this.scrollTop = pos.top
      },
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
      getSeller() {
        vm.seller = vm.$store.state.global.userInfo || (me.sessions.get('ynSellerInfo') ? JSON.parse(me.sessions.get('ynSellerInfo')) : {})
        vm.getOverview()
      },
      getOverview() {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(orderApi.count, {sellerId: vm.seller.id}, 'POST', function (res) {
          vm.isPosting = false
          vm.overview = res.data
        }, function () {
          vm.isPosting = false
        })
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
              resD.itemList.length ? vm.orders.concat(resD.itemList) : vm.noMore = true
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
      pushPay(id) {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(orderApi.remind, {id: id}, 'POST', function (res) {
          vm.toast('提醒成功')
          vm.isPosting = false
        }, function () {
          vm.isPosting = false
        })
      },
      dispatch(id) {
        if (vm.isPosting) return false
        vm.confirm('确认派送？', null, function () {
          vm.isPosting = true
          vm.loadData(orderApi.updateOrderStatus, {userType: 2, id: id, status: 3}, 'POST', function (res) {
            vm.isPosting = false
            vm.toast('派送成功')
            vm.getOrders()
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      dispatchOrder(id) {
        if (vm.isPosting) return false
        vm.isPosting = true
        /*var dispatchers = '<option value="">-请选择派送员-</option>'
         vm.loadData(orderApi.dispatcher, {orderId: id}, 'POST', function (res) {
         if (res.success) {
         if (res.data.itemList.length) {
         var resD = res.data.itemList
         for (var i = 0; i < resD.length; i++) {
         var cur = resD[i]
         dispatchers += '<option value="' + cur.id + ',' + cur.dispatcher + '">' + cur.dispatcher + '</option>'
         }
         } else {
         vm.toast('暂无派送员！')
         return
         }
         }
         vm.isPosting = false
         }, function () {
         vm.isPosting = false
         })
         vm.confirm('请选择派送员？', '<div class="despatchModal"><select name="dispatcher" id="dispatcher">' + dispatchers + '</select><!--<input id="dispatcher" type="text" placeholder="输入派送员姓名" required>--></div>', function () {
         var curVal = window.document.getElementById('dispatcher').value
         if (!curVal) {
         vm.toast('请选择派送员', 'warn')
         return false
         }
         vm.loadData(orderApi.dispatch, {orderId: id, dispatcher: curVal}, 'POST', function (res) {
         vm.isPosting = false
         if (res.success) {
         vm.toast('派送成功')
         } else {
         vm.toast(res.message || '支付失败！')
         }
         }, function () {
         vm.isPosting = false
         })
         }, function () {
         vm.isPosting = false
         }, '派送', null, true)*/

        vm.confirm('确认派送？', '', function () {
          vm.loadData(orderApi.dispatch, {orderId: id, dispatcher: ''}, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.toast('派送成功')
            } else {
              vm.toast(res.message || '派送失败！')
            }
          }, function () {
            vm.isPosting = false
          })
        }, function () {
          vm.isPosting = false
        }, '派送')
      },
      onItemClick(status) {
        vm.orders = []
        status ? vm.params.status = status : delete vm.params.status
        vm.getOrders()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';

  .home-con {
    height: 100%;
    /*overflow-y: scroll; // 此两个属性至关重要，不写@scroll监听不到滚动*/
    .orders-list-con {
      /*height: 100%;*/
    }

    .overview {
      cursor: pointer;
      .rel;
      .borBox;
      padding: 30/@rem 30/@rem 20/@rem;
      .cf;
      .disable-sel;
      .bdiy(#FE6246);
      .top-seller-avatar {
        img {
          .size(50, 50);
          .borR(50%);
          .bor(1px, solid, #c14b34);
        }
      }
      .user-center {
        .abs;
        left: 0;
        top: 0;
        padding: 30/@rem;
        .fz(40);
        .cf;
      }
      .top {
        padding: 40/@rem 0;
        .center;
        .bor-b(1px, solid, rgba(255, 255, 255, .2));
        h2 {
          padding: 30/@rem 0;
          line-height: 1;
          //        .c3;
          .fz(60);
        }
        .today {
          //        .c6;
          .fz(30);
        }
        .yesterday {
          //        .c9;
          .fz(24);
        }
      }
      .bottom {
        padding-top: 20/@rem;
        .center;
        overflow: hidden;
        .col {
          .fl;
          width: 50%;
        }
        h2 {
          padding: 18/@rem 0;
          line-height: 1;
          .txt-normal;
          //        .c3;
          .fz(36);
        }
        .today {
          //        .c3;
          .fz(24);
        }
        .yesterday {
          //        .c9;
          .fz(20);
        }
      }
    }

    .middle-entry {
      .disable-sel;
      margin-bottom: 10/@rem;
      .bf;
      /*border-top: 1px solid #eee;*/
      border-bottom: 1px solid #eee;
      .weui-grid__icon {
        display: block;
        .size(80, 80);
      }
      .weui-grid__label {
        .fz(24);
      }
      .weui-grids {
        &:before, &:after {
          .none;
        }
      }
      .weui-grid {
        .pointer;
        &:before, &:after {
          .none;
        }
      }
    }

    .vux-x-switch {
      .fz(24) !important;
      .weui-switch:checked {
        border-color: #fd826c;
        background-color: #fd826c;
      }
    }

    .order-list {
      .rel;
      min-height: 200px;
      &.hasContent {
        height: 800px;
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
        .transi(.2s);
        &.fixed {
          width: 100%;
          .fix;
          top: 0;
        }
      }
      .inner-scroller {
        .borBox;
        padding: 0 0 50px;
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
              padding-left: 10/@rem;
              .fz(22);
              .cdiy(@c2);
              &.remind-txt {
                .cdiy(#78b933);
                padding-right: 14/@rem;
                .bor-r;
                -webkit-animation: flash 4.5s ease infinite;
                animation: flash 4.5s ease infinite;
              }
            }
          }
          .item-middle {
            padding: 14/@rem 20/@rem;
            .flex;
            .bf8;
            .bor-b;
            .img-con {
              .rel;
              .size(130, 130);
              overflow: hidden;
              img {
                .abs-center-vh;
                width: 100%;
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
            .dispatch-info {
              padding-top: 8/@rem;
              span {
                padding-right: 28/@rem;
              }
            }
            .score-info {
              padding-top: 8/@rem;
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
          .rel;
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
            padding: 14/@rem 20/@rem;
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
              &.btn-push, &.btn-appraise, &.btn-pay, &.btn-dispatch {
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
          .score-info {
            margin-top: -20/@rem;
            .fl;
            overflow: hidden;
            padding: 20/@rem 20/@rem;
            .has-score {
              overflow: hidden;
              .fz(24);
              span {
                .fl;
              }
            }
            .star {
              .fl;
              margin-top: -6/@rem;
              overflow: hidden;
              li {
                .fl;
                margin-right: 10/@rem;
                .cdiy(#ff9900);
                .rfz(16);
                &.gray {
                  .c9;
                }
              }
            }
            .noScore {
              padding: 0 22/@rem 20/@rem;
              .left;
              .cdiy(#9fb52b);
              .fz(24);
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
