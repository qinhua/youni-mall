<template>
  <div class="ticket-con" v-cloak>
    <tab class="ticket-type" bar-active-color="transparent">
      <tab-item :selected="!isMe?true:false" @on-item-click="onItemClick(0)"><i class="fa fa-ticket"></i>&nbsp;购买水票
      </tab-item>
      <tab-item :selected="isMe?true:false" @on-item-click="onItemClick(1)"><i class="fa fa-user-circle-o"></i>&nbsp;我的水票
      </tab-item>
    </tab>
    <!--<slide-tab ref="slidernav" skey="s01" :slides="navs" @on-select="selectCategory"></slide-tab>-->
    <div class="v-slide-tab" ref="slidernav" v-if="!isMe" v-cloak>
      <div class="swiper-container slide-tab-con">
        <div class="swiper-wrapper">
          <div :class="['swiper-slide',current===index?'active':'']" v-for="(item,index) in navs01" :key="index+1"
               @click="filterTicket({index:index,key:item.key,value:item.value})" v-cloak>
            <a :data-id="item.key">{{item.value}}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="v-slide-tab" ref="slidernav" v-else>
      <div class="swiper-container slide-tab-con">
        <div class="swiper-wrapper">
          <div :class="['swiper-slide',current===index?'active':'']" v-for="(item,index) in navs02" :key="index+1"
               @click="filterTicket({index:index,key:item.key,value:item.value})" v-cloak>
            <a :data-id="item.key">{{item.value}}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="ticket-list">
      <scroller class="inner-scroller" ref="ticketScroller" height="100%" :on-refresh="refresh"
                :on-infinite="infinite"
                refreshText="下拉刷新"
                :noDataText="tickets.length?'就这么多了':''"
                snapping>
        <!-- content goes here -->
        <swipeout>
          <swipeout-item @on-close="" @on-open="" transition-mode="follow" v-for="(item, index) in tickets"
                         :data-id="item.id" :data-waterid="item.waterId"
                         v-cloak key="index" :disabled="!isMe">
            <div slot="right-menu">
              <swipeout-button @click.native="onSwiperClick('delete',item.id)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="demo-content vux-1px-t">
              <div v-show="tickets.length&&!isMe" v-cloak>
                <section class="v-items" @click="toSeller(item.sellerId)">
                  <section class="wrap">
                    <div class="img-con" :style="item.imgurl?('background-image:url('+item.imgurl+')'):''"></div>
                    <section class="infos">
                      <h3>{{item.name}}<span class="count">数量：<i>{{item.waterNum}}桶</i></span></h3>
                      <section class="middle">
                        <span class="price">￥{{item.price | toFixed}}元</span>
                        <span class="sale-count">已售：<i>{{item.saleCount}}件</i></span>
                        <button type="button" class="btn btn-buy" @click="onButtonClick($event,item.id)">购买</button>
                      </section>
                      <label>{{item.waterNote}}</label>
                    </section>
                  </section>
                </section>
              </div>
              <div v-show="tickets.length&&isMe" v-cloak>
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
    <div class="iconNoData abs-center-vh" v-if="!tickets.length"><i></i>
      <p>暂无水票</p></div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  //  import SlideTab from '../components/SlideTab'
  import {Tab, TabItem, Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'
  import {ticketApi} from '../service/main.js'

  export default {
    name: 'ticket',
    data() {
      return {
        isMe: false,
        current: 0,
        slideTab: null,
        curBtnText: null,
        curApi: ticketApi.list,
        tickets: [],
        navs01: [{
          'key': 'water_ticket_type.1',
          'value': '买5送1'
        },
          {
            'key': 'water_ticket_type.2',
            'value': '买10送2'
          },
          {
            'key': 'water_ticket_type.3',
            'value': '买100送30'
          },
          {
            'key': 'water_ticket_type.4',
            'value': '买100送35'
          },
          {
            'key': 'water_ticket_type.5',
            'value': '买100送40'
          }],
        navs02: [{
          'key': '',
          'value': '全部'
        }, {
          'key': 1,
          'value': '待支付'
        },
          {
            'key': 2,
            'value': '可兑换'
          },
          {
            'key': 3,
            'value': '已兑完'
          }],
        params: {
          // waterTicketType: 'water_ticket_type.1',
          userType: 1,
          pageSize: 10,
          pageNo: 1
        },
        noMore: false,
        isPosting: false,
        onFetching: false
      }
    },
    components: {Tab, TabItem, Swipeout, SwipeoutItem, SwipeoutButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.keepFresh(vm.$route.params.type)
      vm.initTab()
      vm.getTickets()
      vm.$nextTick(function () {
        try {
          vm.$refs.ticketScroller.finishInfinite(true)
          vm.$refs.ticketScroller.resize()
        } catch (e) {
          // console.log(e)
        }
      })
    },
    /* computed: {
     'params.type' () {
     return this.$route.params.type
     }
     }, */
    watch: {
      '$route'(to, from) {
        if (to.name === 'ticket') {
          vm.current = 0
          if (vm.isMe) {
            vm.params.status = vm.navs02[0].key
            delete vm.params.waterTicketType
          } else {
            vm.params.waterTicketType = vm.navs01[0].key
            delete vm.params.status
          }
          vm.tickets = []
          vm.keepFresh(vm.$route.params.type)
          vm.getTickets()
        }
      }
    },
    methods: {
      toSeller(id) {
        vm.jump('seller_detail', {id: id})
      },
      initTab() {
        vm.slideTab = new Swiper('.slide-tab-con', {
          initialSlide: 0,
          direction: 'horizontal',
          loop: false,
          autoplay: false,
          preloadImages: true,
          autoplayDisableOnInteraction: false,
          observer: true,
          slidesPerView: 4,
          observeParents: true,
          // If we need pagination
          pagination: '.slide-tab-con .swiper-pagination',
          paginationClickable: true,
          grabCursor: true,
          /*onInit: function (swiper) {
           $(document).on('click', '.swiper-slide', function () {
           var curIdx = $(this).index()
           var $navs = $('.swiper-slide')
           $navs.eq(curIdx).addClass('active').siblings('.swiper-slide').removeClass('active')
           })
           }*/
        })
      },
      keepFresh(data) {
        if (data) {
          vm.isMe = true
          vm.curApi = ticketApi.user
        } else {
          vm.isMe = false
          vm.curApi = ticketApi.list
        }
      },
      refresh(done) {
        // console.log('下拉加载')
        setTimeout(function () {
          // !vm.isMe ? vm.getTickets() : null
          vm.getTickets()
          try {
            vm.$refs.ticketScroller.finishPullToRefresh()
          } catch (e) {
            // console.log(e)
          }
        }, 1200)
      },
      infinite(done) {
        // console.log('无限滚动')
        setTimeout(function () {
          // !vm.isMe ? vm.getTickets(true) : null
          vm.getTickets(true)
          try {
            vm.$refs.ticketScroller.finishInfinite(true)
          } catch (e) {
            // console.log(e)
          }
        }, 1000)
      },
      onSwiperClick(type, id) {
        if (type === 'delete') {
          vm.del(id)
        }
      },
      del(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', null, function () {
          vm.isPosting = true
          vm.loadData(ticketApi.del, {id: id}, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      onItemClick(type) {
        vm.current = 0
        if (vm.isMe) {
          vm.params.status = vm.navs02[0].key
          delete vm.params.waterTicketType
        } else {
          vm.params.waterTicketType = vm.navs01[0].key
          delete vm.params.status
        }
        if (type === 0) {
          vm.$router.push({path: '/ticket'})
        }
        vm.keepFresh(type)
        vm.getTickets(vm.isMe)
      },
      filterTicket(obj) {
        vm.current = obj.index
        if (obj.key) {
          !vm.isMe ? vm.params.waterTicketType = obj.key : vm.params.status = obj.key
        } else {
          delete vm.params.waterTicketType
          delete vm.params.status
        }
        vm.getTickets()
      },
      getTickets(isLoadMore) {
        if (vm.onFetching) return false
        // 根据isMe判断不同的水票类型
        vm.onFetching = true
        vm.processing()
        vm.loadData(vm.curApi, vm.params, 'POST', function (res) {
          vm.onFetching = false
          vm.processing(0, 1)
          if (vm.isMe) {
            vm.tickets = res.data.itemList
          } else {
            var resD = res.data.pager
            if (!isLoadMore) {
              vm.tickets = res.data.itemList
              if (resD.totalCount < vm.params.pageSize) {
                vm.noMore = true
              } else {
                vm.noMore = false
              }
              vm.tickets = resD.itemList
            } else {
              resD.itemList.length ? vm.tickets.concat(resD.itemList) : vm.noMore = true
            }
          }
          // console.log(vm.tickets, '水票数据')
        }, function () {
          vm.onFetching = false
        })
      },
      onButtonClick(e, id, lineData) {
        e.stopPropagation()
        if (vm.isMe) {
          /*如果已支付，直接兑换，没有支付先支付*/
          if (lineData.payStatus) {
            vm.$router.push({
              name: 'confirm_ticket',
              query: {thedata: window.encodeURIComponent(JSON.stringify(lineData))}
            })
          } else {
            vm.rePay(id)
          }
        } else {
          vm.payOrder(id)
        }
      },
      payOrder(id) {
        if (!me.isWeixin) {
          vm.toast('请在微信中操作！')
          return
        }
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(ticketApi.add, {waterId: id}, 'POST', function (res) {
          vm.isPosting = false
          if (res.success && res.data) {
            vm.pay(res.data)
          } else {
            if (res.errorCode == 304) {
              vm.toast('请先绑定手机号！')
              setTimeout(function () {
                vm.jump('bind')
              }, 800)
            } else {
              vm.toast(res.data || '操作失败！')
            }
          }
        }, function () {
          vm.isPosting = false
        })
      },
      rePay(id) {
        if (!me.isWeixin) {
          vm.toast('请在微信中操作！')
          return
        }
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loadData(ticketApi.repay, {id: id}, 'POST', function (res) {
          vm.isPosting = false
          if (res.success && res.data) {
            vm.pay(res.data)
          } else {
            if (res.errorCode == 304) {
              vm.toast('请先绑定手机号！')
              setTimeout(function () {
                vm.jump('bind')
              }, 800)
            } else {
              vm.toast(res.message || '操作失败！')
            }
          }
        }, function () {
          vm.isPosting = false
        })
      },
      pay(data) {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
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
              vm.isPosting = false
              if (vm.isMe) {
                vm.$router.push({path: '/order'})
              } else {
                vm.$router.push({path: '/ticket/2'})
              }
            },
            cancel: function (res) {
              // 取消支付后的回调函数
              if (vm.isMe) {
                vm.$router.push({path: '/order'})
              } else {
                vm.$router.push({path: '/ticket/2'})
              }
            }
          })
        })
        wx.error(function (res) {
          vm.isPosting = false
          if (vm.isMe) {
            vm.$router.push({path: '/order'})
          } else {
            vm.$router.push({path: '/ticket/2'})
          }
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          // alert(JSON.stringify(res))
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../static/css/tools.less';

  .ticket-con {
    height: 100%;
    .ticket-type {
      z-index: 10;
      .vux-tab-item {
        &.vux-tab-selected {
          .cf!important;
          background: #5cc5d0 !important;
        }
      }
    }

    .ticket-tab {
      z-index: 10;
      .vux-tab-item {
        &.vux-tab-selected {
          .cdiy(#5cc5d0) !important;
        }
      }
    }

    .v-slide-tab {
      .rel;
      .swiper-container {
        .bf;
        .swiper-wrapper {
          height: 40px;
          .swiper-slide {
            .center;
            &.active {
              a {
                color: #5cc5d0;
              }
            }
            a {
              line-height: 40px;
              .fz(24);
            }
            /*h4 {
              padding: 5/@rem 0;
              .center;
              .bdiy(#ff3969);
              .fz(24);
              .cf;
            }
            img {
              margin: 6/@rem 0;
            }
            p {
              padding: 10/@rem 0;
              .center;
              .fz(24);
              .cdiy(#5b4ae6);
            }*/
          }
        }
      }
    }

    .ticket-list {
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
            background: #f5f5f5 url(../../static/img/bg_ticket.jpg) no-repeat center;
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
