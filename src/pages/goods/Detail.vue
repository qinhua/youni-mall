<template>
  <div class="goods-detail needsClick">
    <div class="scroll-view">
      <div class="top" ref="topBanner">
        <div class="banner-goods-detail">
          <div class="swiper-container" v-show="details.imgurl">
            <div class="swiper-wrapper">
              <!--<div class="swiper-slide" v-for="(item, index) in details.imgurl" :key="index" :data-id="item.id">-->
              <div class="swiper-slide" :style="'background-image:url('+details.imgurl+')'">
                <!--<a :href="item.linkUrl" target="blank">-->
                <a href="#" target="blank">
                  <!--<img class="wd-img" :src="details.imgurl" alt="">-->
                </a>
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
        </div>
        <div class="buy-con">
          <h3 class="title"><span
            :class="details.categoryName==='奶'?'milk':''">{{details.categoryName}}</span>{{details.name}}</h3>
          <div class="wrap">
            <div class="txt-con">
              <p class="middle"><span class="price">￥{{(details.price || 0) | toFixed}}</span><sub>已售{{details.saleCount}}单</sub>
                <!--<span class="stock">剩余{{details.stock}}件</span>-->
              </p>
              <ul class="tags" v-if="details.label">
                <li v-for="tag in details.label.split(',')">{{tag}}</li>
              </ul>
            </div>
            <div class="right-con">
              <div class="inner">
                <button type="button" class="btn btn-addcart"
                        @click="changeCount({type:'add',id:details.id,sellerId:details.sellerId,linedata:details})"
                        v-if="isMilk" v-cloak><i class="fa fa-plus"></i>&nbsp;购物车
                </button>
                <div class="number-con" v-else>
                  <group>
                    <x-number :class="details.type==='goods_type.2'?'buy-count-milk':''"
                              :disabled="cartData && details.sellerId!==cartData.sellerId" :min="0"
                              :max="200" :value="details.number" align="right" :dataId="details.id"
                              :dataSellerId="details.sellerId" :linedata="details"
                              @on-change="changeCount"></x-number>
                  </group>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="operate-con" v-if="details.type==='goods_type.1'">
          <h3><i class="fa fa-hand-o-right"></i>&nbsp;缴付押金({{details.mortgage||0}}元)
            <button type="button" class="btn btn-deposite" @click="payDeposite(details.id)">交押金</button>
            <!--<span>已交押金{{seller.currentMortgage}}</span>-->
          </h3>
        </div>
      </div>
      <div class="bottom">
        <h3 class="title">图文详情</h3>
        <!--<tab :line-width=2 active-color="#f34c18" v-model="curIndex">
          <tab-item class="vux-center" :selected="curIndex === index" v-for="(item, index) in tablist"
                    @click.native="chooseCol(index)" :key="index">{{item}}
          </tab-item>
        </tab>-->
        <div class="detail-con">
          <div class="detail-content" :style="curMinHeigth" v-html="details.note" v-if="details.note"
               v-cloak></div>
          <span class="block noData center" v-else>暂无详情</span>
        </div>
        <!--<div class="swiper-container swiper-goods-detail">
          <div class="swiper-wrapper" v-if="details.note">
            <div class="swiper-slide">
              <div class="detail-con" v-html="details.note">
                &lt;!&ndash;<img src="../../../static/img/detail/s01.jpg" class="wd-img" alt="">&ndash;&gt;
              </div>
            </div>
            &lt;!&ndash;<div class="swiper-slide">
              <ul class="goods-param">
                <li>规格：4L*6</li>
                <li>产地：由于农夫山泉采取的是“水源地建厂，水源地灌装”、“水源地就近区域销售”的策略，各地购买到的农夫山泉水源地不尽相同，具体以瓶身标注为准 </li>
                <li>贮存方法：避免阳光直接照射及高温</li>
              </ul>
            </div>
            <div class="swiper-slide">
              <div class="appraise">
                <ul class="appraise-nav">
                  <li :selected="appIdx === 0" @click="filterAppraise(0)">全部</li>
                  <li class="good" :selected="appIdx === 1" @click="filterAppraise(1)">好评</li>
                  <li class="middle" :selected="appIdx === 2" @click="filterAppraise(2)">中评</li>
                  <li class="bad" :selected="appIdx === 3" @click="filterAppraise(3)">差评</li>
                </ul>
                <div class="appraise-content">
                  <ol>
                    <li v-for="uu in appraise">
                      <div class="wrap">
                        <div class="buyer">
                          <img :src="uu.imgUrl" alt="">
                          <span>{{uu.name}}</span>
                        </div>
                        <div class="mtxt-con">
                          <div class="score-con" v-if="uu.score">
                            <ul class="u-stars">
                              <li v-for="idx in uu.score">★</li>
                            </ul>
                            <span>{{uu.score}}.0</span>
                          </div>
                          <div class="score-con grey" v-else>
                            <ul class="u-stars">
                              <li>★</li>
                              <li>★</li>
                              <li>★</li>
                              <li>★</li>
                              <li>★</li>
                            </ul>
                            <span>0.0</span>
                          </div>
                          <div class="txt-con">
                            <p>{{uu.content}}</p>
                          </div>
                          <span class="time">{{uu.createTime}}</span>
                        </div>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>&ndash;&gt;
          </div>
        </div>-->
      </div>
    </div>

    <!--底部立即购买pop-checker-->
    <div v-transfer-dom>
      <popup v-model="showPop" position="bottom" max-height="100%" v-if="!isMilk">
        <group class="number-con">
          <x-number fillable title="数量：" :disabled="cartData && details.sellerId!==cartData.sellerId"
                    :value="curWaterAmount"
                    :dataId="details.id" :dataSellerId="details.sellerId" :min="1"
                    :max="200" @on-change="changeBuyNum" @input="changeBuyNum"></x-number>
        </group>
        <button type="button" class="btn btn-addcart" @click="nextStep">立即购买
        </button>
      </popup>
      <popup class="buyCon" v-model="showPop" position="bottom" max-height="80%" v-else>
        <group>
          <div class="top-con" v-if="details.imgurl" v-cloak>
            <div class="img-con" :style="details.imgurl?('background-image:url('+details.imgurl+')'):''"></div>
            <div class="side-con">
              <h3>￥{{curTotalPrice}}<!--<span>￥{{tg.originPrice}}</span>--></h3>
              <p>单价：{{details.price|toFixed}}元</p>
              <label>已选：{{curPriceTag?curPriceTag.note:'未选择'}}</label>
            </div>
          </div>
          <div class="tags-con" v-if="priceTags.length" v-cloak>
            <div class="wrap">
            <h4>订购数量：</h4>
            <ul>
              <li :class="idx===curPriceIdx?'active':''" v-for="(tg,idx) in priceTags" :data-id="tg.id"
                  @click="changePriceTag(idx,tg)">{{tg.note}}({{tg.saleNum}}瓶)<br><i
                class="txt-del">￥{{tg.originPrice}}</i>【￥{{tg.salePrice}}元】
              </li>
            </ul>
            </div>
          </div>
          <div class="tags-con" v-if="favorTags" v-cloak>
            <h4>口味：</h4>
            <ul>
              <li :class="idx===curFavorIdx?'active':''" v-for="(fa,idx) in favorTags"
                  @click="changeFavorTag(idx,fa)">
                {{fa}}
              </li>
            </ul>
          </div>
          <x-input id="curMilkAmount" title="配送量(瓶/天)：" placeholder="请输入每日配送量" required text-align="right" type="number"
                   v-model="curMilkAmount" @on-change="changeMilkAmout"></x-input>
          <!--<x-input class="total-p" title="总价：" text-align="right" type="text" readonly
                   v-model="curTotalPrice"></x-input>-->
        </group>
        <button type="button" class="btn btn-addcart" @click="nextStep">{{isBuy ? '立即购买' : '加入购物车'}}</button>
      </popup>
    </div>

    <!--关于押金-->
    <div v-transfer-dom>
      <popup class="pop-txtcon" v-model="showTip" position="bottom" max-height="80%">
        <group class="pop-content">
          <h3>关于押金</h3>
          <ul class="txt-list">
            <li>1. 您购买押金类商品后，支付的押金将自动支付给商品所属的配送点，同时系统自动生成电子押金券发放到你的账户；</li>
            <li>2. 您需要退押金时可直接点击电子押金券上的‘退押金’按钮向收取押金的配送点申请退还押金，退桶和退还押金双方在线下完成交易；</li>
            <li>免责声明:电子押金券仅作为您与指定配送点线上交易的电子凭证，友你梦想（武汉）科技有限公司不会对交易过程产生的任何后果负责。</li>
          </ul>
        </group>
        <button type="button" class="btn btn-sure" @click="showDialog(details.id)">知道了</button>
      </popup>
    </div>

    <!--购物车-->
    <div class="ball-container">
      <!--小球-->
      <div v-for="ball in balls">
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <div class="cart-model">
      <div class="wrap">
        <div class="cur-cart" ref="curCart" :hasgood="curCount>0" v-jump="['cart']"><i v-if="curCount">{{curCount}}</i>
        </div>
        <div class="left">
          <div class="txt" v-show="details.number">
            <h4>当前共{{details.number}}件</h4>
            <p>合计：￥{{details.payPrice | toFixed}}元</p>
          </div>
        </div>
        <div class="right">
          <div class="btn btn-buy" @click="swPopOver">立即购买</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  let me
  let vm
  import Swiper from 'swiper'
  import {Tab, TabItem, XInput, XNumber, Group, Cell, TransferDom, Popup, XButton} from 'vux'
  import {goodsApi, cartApi,depositApi} from '../../service/main.js'

  export default {
    name: 'goods-detail',
    directives: {
      TransferDom
    },
    data() {
      return {
        id: null,
        isMilk: false,
        isBuy: false,
        isPosting: false,
        details: {},
        cartData: null,
        curCount: 0,
        tablist: ['商品详情', '规格', '评论'],
        addText: '添加购物车',
        /*底部奶的浮窗-start*/
        showPop: false,
        showTip: false,
        /*价格标签-start*/
        curWaterAmount: 1,// 水的默认数量
        curMilkAmount: 1,// 奶的默认数量
        curTotalPrice: 0,
        priceTags: [],
        curPriceIdx: 0,
        curPriceTag: null,
        /*价格标签-end*/
        /*口味标签-start*/
        favorTags: [],
        curFavorIdx: 0,
        curFavorTag: '',
        /*口味标签-end*/
        /*底部奶的浮窗-end*/
        detailSwiper: null,
        curIndex: 0,
        appIdx: 0,
        appraiseData: null,
        appraise: [],
        balls: [ //小球 设为3个
          {
            show: false
          }, {
            show: false
          }, {
            show: false
          },
        ],
        dropBalls: [],
      }
    },
    components: {Tab, TabItem, XInput, XNumber, Group, Cell, Popup, XButton},
    beforeMount() {
      me = window.me
    },
    computed: {
      curMinHeigth() {
        return 'min-height:' + (vm.$refs.topBanner.offsetHeight + 200) + 'px'
      }
    },
    mounted() {
      vm = this
      vm.getDetail(function () {
        vm.viewCart()
        vm.mySwiper()
        // vm.swiperDetail()
        // vm.getAppraise()
      })
      // console.log(vm.curMinHeigth)
//      vm.$nextTick(function() {
//        vm.$refs.orderScroller.finishInfinite(true)
//        vm.$refs.orderScroller.resize()
//      })
    },
    /*computed: {
     total() {
     return vm.details.number ? vm.details.number * vm.details.price : 0
     }
     },*/
    watch: {
      '$route'(to, from) {
        if (to.name === 'goods_detail') {
          vm.getDetail(function () {
            vm.viewCart()
            vm.mySwiper()
            // vm.swiperDetail()
            // vm.getAppraise()
          })
        }
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      mySwiper() {
        return new Swiper('.banner-goods-detail .swiper-container', {
          initialSlide: 0,
          direction: 'horizontal',
          autoplay: 2000,
          preloadImages: true,
          autoplayDisableOnInteraction: false,
          observer: true,
          observeParents: true,
          // If we need pagination
          pagination: '.banner-goods-detail .swiper-pagination',
          paginationClickable: true,
          // Navigation arrows
          // nextButton: '.swiper-button-next',
          // prevButton: '.swiper-button-prev',
          // onClick: function (swiper) {
          // var curIdx = swiper.activeIndex
          // },
          // onSlideChangeEnd: function () {
          // }
        })
      },
      swiperDetail() {
        vm.detailSwiper = new Swiper('.swiper-container.swiper-goods-detail', {
          initialSlide: 0,
          direction: 'horizontal',
          preloadImages: true,
          autoplayDisableOnInteraction: false,
          observer: true,
          autoHeight: true,
          observeParents: true,
          grabCursor: true,
          // onClick: function (swiper) {
          // var curIdx = swiper.activeIndex
          // },
          onSlideChangeEnd: function (swiper) {
            vm.curIndex = swiper.activeIndex
          }
        })
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
      getDetail(cb) {
        vm.id = vm.$route.query.id
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.processing()
        vm.loadData(goodsApi.detail, {id: vm.id}, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          if (res.success) {
            var resD = res.data
            resD.categoryName = (resD.type === 'goods_type.1') ? '水' : '奶'
            vm.isMilk = (resD.type === 'goods_type.2') ? true : false
            vm.details = resD
            // console.log(vm.details, '商品详情')
          }
          cb ? cb() : null
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      chooseCol(index) {
        vm.detailSwiper.slideTo(index)
      },
      getAppraise(index) {
        vm.loadData(goodsApi.appraise, {type: index || 0}, 'POST', function (res) {
          vm.appraiseData = vm.appraise = res.data.itemList
          // console.log(vm.appraiseData, '用户评价数据')
          cb ? cb() : null
        }, function () {
        })
      },
      filterAppraise(index) {
        vm.appIdx = index
        vm.appraise = []
        if (vm.appraiseData) {
          if (index === 0) {
            vm.appraise = vm.appraiseData
            return;
          }
          for (let i = 0; i < vm.appraiseData.length; i++) {
            if (vm.appraiseData[i].type === index) {
              vm.appraise.push(vm.appraiseData[i])
            }
          }
        } else {
          vm.getAppraise()
        }
      },
      goConfirm() {
        /*先添加到购物车再到确认页面*/
        if (vm.isPosting) return
        vm.showPop = false
        vm.isPosting = true
        if (vm.isMilk) {
          // 判断当前是否填写了数量
          if (vm.curMilkAmount) {
            vm.loadData(cartApi.add, {
              goodsId: vm.details.id,
              goodsNote: vm.curFavorTag,
              goodsNum: vm.curPriceTag.saleNum,
              dispatchNum: vm.curMilkAmount
            }, 'POST', function (res) {
              vm.isPosting = false
              if (res.success) {
                vm.jump('confirm_order', {goodsId: vm.details.id})
              }
            }, function () {
              vm.isPosting = false
            })
            vm.showPop = false
          } else {
            vm.toast('配送量至少1瓶哦！', 'warn')
          }
        } else {
          vm.loadData(cartApi.add, {
            goodsId: vm.details.id,
            goodsNum: vm.curWaterAmount
          }, 'POST', function (res) {
            if (res.success) {
              vm.isPosting = false
              vm.jump('confirm_order', {goodsId: vm.details.id})
            }
          }, function () {
            vm.isPosting = false
          })
        }
        // 判断当前是否填写了数量
        /*var lastD, tmp = []
         if (vm.cartData && vm.cartData.goodsList.length) {
         for (let i = 0; i < vm.cartData.goodsList.length; i++) {
         let cur = vm.cartData.goodsList[i]
         if (cur.goodsId === vm.details.id) {
         tmp.push(cur)
         }
         }
         lastD = {
         sellerId: vm.details.sellerId,
         sellerName: vm.details.sellerName,
         totalPrice: vm.curWaterAmount * vm.details.price,
         goods: [{
         goodsId: vm.details.id,
         goodsNum: vm.curWaterAmount,
         }]
         }
         vm.$router.push({
         name: 'confirm_order',
         query: {thedata: encodeURIComponent(JSON.stringify(lastD))}
         })
         } else {
         vm.toast('至少选一件哦！', 'warn')
         }*/
//        if (vm.curWaterAmount) {

        /*vm.$router.push({
         name: 'confirm_order',
         query: {thedata: encodeURIComponent(JSON.stringify(lastD))}
         })*/
        /*} else {
         vm.toast('至少选1件哦！', 'warn')
         }*/
      },

      /*添加奶*/
      getTags(id) {
        vm.isPosting = true
        vm.loadData(goodsApi.saleConfigList, {goodsId: id}, 'POST', function (res) {
          vm.isPosting = false
          if (res.data.itemList.length) {
            vm.curMilkAmount = 1
            vm.priceTags = res.data.itemList
            vm.favorTags = vm.details.flavourLabel ? vm.details.flavourLabel.split(',') : []
            vm.curPriceTag = vm.priceTags[0]
            vm.curFavorTag = vm.favorTags.length ? vm.favorTags[0] : ''
            vm.curPriceIdx = 0
            vm.curFavorIdx = 0
            vm.curTotalPrice = me.floatMulti(vm.curMilkAmount, vm.curPriceTag.salePrice) + '元'
            vm.showPop = true
          } else {
            vm.toast('此商品暂无法购买', 'warn')
          }
        }, function () {
          vm.isPosting = false
        })
      },
      changeFavorTag(idx, data) {
        vm.curFavorIdx = idx
        vm.curFavorTag = data
        // console.log('口味标签：', vm.curFavorTag)
      },
      changePriceTag(idx, data) {
        vm.curPriceIdx = idx
        vm.curPriceTag = data
        vm.curTotalPrice = me.floatMulti(vm.curMilkAmount, data.salePrice) + '元'
        // console.log('价格标签：', vm.curPriceTag.note)
      },
      changeMilkAmout(val) {
        try {
          vm.curTotalPrice = me.floatMulti(vm.curMilkAmount, vm.curPriceTag.salePrice) + '元'
        } catch (e) {
          // console.log(e)
        }
      },
      addMilk() {
        // 判断当前是否填写了数量
        if (vm.curMilkAmount) {
          vm.loadData(cartApi.add, {
            goodsId: vm.details.id,
            goodsNote: vm.curFavorTag,
            goodsNum: vm.curPriceTag.saleNum,
            dispatchNum: vm.curMilkAmount
          }, 'POST', function (res) {
            if (res.success) {
              vm.viewCart()
              vm.curMilkAmount = 1
            } else {
              // vm.toast(res.message || '购物车中已有其他店铺商品，请先清空')
              vm.clearCart()
              return
            }
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
          vm.showPop = false
        } else {
          vm.toast('配送量至少1瓶哦！', 'warn')
        }
      },
      changeCount(obj) {
        console.log(obj)
        vm.isBuy = false
        if (vm.cartData.sellerId && obj.sellerId !== vm.cartData.sellerId) {
          // vm.toast(res.message || '购物车中已有其他店铺商品，请先清空')
          vm.clearCart()
          return
        }
        if (obj.linedata.type === 'goods_type.2' && obj.type === 'add') {
          vm.getTags(obj.id)
          return false
        } else {
          if (vm.isPosting) return
          vm.isPosting = true
          if (obj.type === 'add') {
            vm.loadData(cartApi.add, {goodsId: obj.id}, 'POST', function (res) {
              if (res.success) {
                vm.viewCart()
                vm.additem(obj.event)
              } else {
                vm.toast(res.data)
              }
              vm.isPosting = false
            }, function () {
              vm.isPosting = false
            })
          } else {
            vm.loadData(cartApi.minus, {goodsId: obj.id}, 'POST', function (res) {
              vm.viewCart()
              vm.isPosting = false
            }, function () {
              vm.isPosting = false
            })
          }
        }
      },


      showDialog(id) {
        vm.showTip = false
        vm.confirm('请填写桶数？', '<div class="depositeModal"><input id="bucketAmount" type="number" placeholder="输入数量（桶）" required></div>', function () {
          if (!me.isWeixin) {
            vm.toast('请在微信中操作！')
            return
          }
          if (vm.isPosting) return false
          vm.isPosting = true
          var curVal = window.document.getElementById('bucketAmount').value
          if (!curVal) {
            vm.toast('请填写数量', 'warn')
            return false
          }
          vm.loadData(depositApi.add, {
            sellerId: id,
            bucketNum: curVal
          }, 'POST', function (res) {
            vm.isPosting = false
            if (res.success) {
              vm.$vux.confirm.hide()
              vm.pay(res.data, true)
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
            // vm.toast(res.message || '支付失败！')
          })
        }, function () {
          vm.isPosting = false
        }, '支付', null, true)
      },
      payDeposite() {
        vm.showTip = true
      },
      pay(data, other) {
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
              /*if(other){

               }else{

               }
               vm.$router.push({path: '/order'})*/
            }
          })
        })
        wx.error(function (res) {
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
          // alert(JSON.stringify(res))
        })
      },
      swPopOver() {
        vm.isBuy = true
        if (vm.cartData.sellerId && vm.details.sellerId !== vm.cartData.sellerId) {
          // vm.toast(res.message || '购物车中已有其他店铺商品，请先清空')
          vm.clearCart()
          return
        }
        // 如果是奶需要先获取标签
        if (vm.isMilk) {
          vm.getTags(vm.details.id)
          vm.favorTags = vm.details.flavourLabel ? vm.details.flavourLabel.split(',') : []
          vm.curFavorTag = vm.favorTags.length ? vm.favorTags[0] : ''
        } else {
          vm.curWaterAmount = 1
          vm.showPop = true
        }
      },
      nextStep() {
        //奶的浮窗复用了，需要判断
        if (vm.isBuy) {
          vm.goConfirm()
        } else {
          vm.addMilk()
        }
      },

      /* 购物车--start */
      // 同步购物车商品数量至详情
      syncList() {
        if (vm.cartData.goodsList && vm.cartData.goodsList.length) {
          for (let i = 0; i < vm.cartData.goodsList.length; i++) {
            let cur = vm.cartData.goodsList[i]
            if (cur.goodsId === vm.details.id) {
              vm.details['number'] = cur.goodsNum
              vm.details['payPrice'] = cur.payPrice
            }
          }
        } else {
          vm.details['number'] = 0
        }
      },
      viewCart(cb) {
        vm.loadData(cartApi.view, null, 'POST', function (res) {
          var resD = res.data
          // console.log(resD, '购物车数据')
          vm.cartData = resD
          vm.curCount = resD.totalNum
          vm.syncList()
          cb ? cb() : null
          vm.isPosting = false
        }, function () {
          vm.isPosting = false
        })
      },
      clearCart() {
        vm.confirm('温馨提示', '购物车中已有其他店铺商品，请先清空！', function () {
          vm.isPosting = true
          vm.loadData(cartApi.clear, null, 'POST', function (res) {
            vm.viewCart()
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        })
      },
      changeBuyNum(obj) {
        vm.curWaterAmount = obj.value
      },
      additem(event) {
        this.drop(event.target);
      },
      /* 购物车小球动画 */
      drop(el) {
        //抛物
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return;
          }
        }
      },
      beforeDrop(el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect() //元素相对于视口的位置
            let x = rect.left - 40
            let y = -(window.innerHeight - rect.top - 22) //获取y
            el.style.display = ''
            el.style.webkitTransform = 'translateY(' + y + 'px)' //translateY
            el.style.transform = 'translateY(' + y + 'px)'
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = 'translateX(' + x + 'px)'
            inner.style.transform = 'translateX(' + x + 'px)'
          }
        }
      },
      /*重置小球数量  样式重置*/
      dropping(el, done) {
        let rf = el.offsetHeight
        // let cartCls = vm.$refs.curCart.classList
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0,-10px,0)'
        inner.style.transform = 'translate3d(0,-10px,0)'
        el.addEventListener('transitionend', done)
        /* cartCls.toggle('bulbing')
         setTimeout(() => {
         cartCls.remove('bulbing')
         }, 800) */
      },
      /*初始化小球*/
      afterDrop(el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      }
      /* 购物车--end */
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .goods-detail {
    .rel;
    height: 100%;
    overflow: hidden;
    .scroll-view {
      height: 100%;
      overflow: auto;
    }
    .top {
      margin-bottom: 14/@rem;
      .banner-goods-detail {
        margin-bottom: 10/@rem;
        height: 440/@rem !important;
        overflow: hidden;

        .swiper-container {
          height: 440/@rem !important;
          .swiper-slide {
            height: 100%;
            background-position: top center;
            -webkit-background-size: cover;
            background-size: cover;
          }
          .swiper-pagination {
            bottom: 5px;
          }
          .swiper-pagination-bullet {
            background: rgba(255, 255, 255, .5);
          }
          .swiper-pagination-bullet-active {
            opacity: 1;
            background: #fff !important;
          }
        }

      }
      .buy-con {
        padding: 20/@rem;
        .bf;
        .bor-t;
        .wrap {
          .rel;
        }
        .title {
          .fz(26);
          .c3;
          margin-bottom: 8/@rem;
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
        .buy-count-milk {
          /*.vux-cell-primary {

          }
          .vux-number-selector-plus {

          }*/
          .vux-number-selector-sub, input {
            .none;
          }
          .vux-number-disabled {
            border: 1px solid #3cc51f;
            svg {
              fill: #3cc51f;
            }
          }
        }
      }

      .txt-con {
        .borBox;
        padding-right: 200/@rem;
        .middle {
          padding: 10/@rem 0;
          .fz(24);
          .c9;
          .price {
            .fz(30);
            .cdiy(@c2);
          }
          .stock {
            padding-right: 10/@rem;
            .fr;
          }
          sub {
            .fz(24);
            padding-left: 20/@rem;
          }
        }
        .tags {
          .cdiy(#f34c18);
          overflow: hidden;
          li {
            .fl;
            margin: 0 10/@rem 5/@rem 0;
            padding: 1px 8px;
            line-height: 1.8;
            .cf;
            .fz(18);
            .borR(2px);
            background: orange;
          }
        }
      }

      .right-con {
        .abs;
        top: 0;
        right: 0;
        width: 200/@rem;
        height: 100%;
        .inner {
          .rel;
          width: 100%;
          height: 100%;
          button {
            .abs-center-vertical;
            right: 0;
            width: auto;
            padding: 16/@rem 20/@rem 16/@rem;
            line-height: 1;
            .fz(22);
            .cf;
            .borR(4px);
            .bdiy(@c3);
            /*&:before {
              position: absolute;
              margin-left: -30/@rem;
              content: '';
              display: block;
              font-size: inherit;
              .size(24, 24);
              background: url(../../../static/img/ico_cart.png) no-repeat center;
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
            }*/
          }
        }
      }

      .operate-con {
        .borBox;
        padding: 30/@rem 26/@rem;
        .bf;
        .bor-t;
        h3 {
          .rel;
          font-weight: normal;
          .fz(24);
        }
        .btn-deposite {
          .abs-center-vertical;
          right: 0;
          .fz(24);
          .cf;
          .block;
          padding: 10/@rem 20/@rem;
          background: #f9a11e;
          .borR(4px);
        }
      }
    }
    .bottom {
      .title {
        .borBox;
        padding: 10/@rem 20/@rem;
        .fz(24);
        background: #fff;
        .bor-l(3px, solid, red);
        .bor-b;
      }
      .detail-con {
        .borBox;
        padding: 20/@rem 20/@rem 140/@rem;
        .bf;
        ul, ol {
          list-style: decimal;
          list-style-position: inside;
        }
        img {
          padding: 5/@rem 0;
          .ma-w(100%);
        }
      }
      .swiper-goods-detail {
        width: 100%;
        padding-bottom: 120/@rem;
        .bf;
        .swiper-slide {
          padding-bottom: 20px;
          .bf;
        }
        .goods-param {
          .borBox;
          padding: 20/@rem;
          overflow: hidden;
          li {
            .fl;
            padding: 4px 0;
            .fz(22);
          }
        }
        .appraise {
          .borBox;
          padding: 20/@rem 0;
          .appraise-nav {
            .borBox;
            width: 96%;
            .ma;
            overflow: hidden;
            padding: 20/@rem 0;
            .bor-b;
            > li {
              margin-right: 6px;
              padding: 4px 8px;
              line-height: 1;
              opacity: .5;
              .fl;
              .rfz(13);
              .cf;
              .bdiy(#ddd);
              .transi(.2s);
              &[selected='selected'] {
                padding: 4px 10px;
                opacity: 1;
                .cf;
                .bdiy(@c2);
              }
              &.good {
                .bdiy(@c2);
              }
              &.middle {
                .bdiy(orange);
              }
              &.bad {
                .bdiy(#999);
              }
            }
          }
          .appraise-content {
            width: 100%;
            .bf5;
            li {
              margin-top: 10/@rem;
              padding: 16/@rem;
              .bf;
            }
            .wrap {
              .rel;
            }
            .buyer {
              .abs;
              top: 0;
              left: 0;
              width: 120/@rem;
              .center;
              img {
                .block;
                .size(80, 80);
                .ma;
                .borR(50%);
              }
              span {
                padding: 5px 0;
                .rfz(12);
                .c6;
              }
            }
            .mtxt-con {
              .borBox;
              width: 100%;
              min-height: 130/@rem;
              padding-left: 140/@rem;
              .score-con {
                overflow: hidden;
                .cdiy(#f37f18);
                .u-stars {
                  .fl;
                  overflow: hidden;
                  li {
                    padding: 0;
                    margin-top: 0;
                    .fl;
                    .rfz(16);
                    .no-bor;
                  }
                }
                span {
                  .fl;
                  .rfz(14);
                  margin: 2px 0 0 10px;
                }
                &.grey {
                  .c9;
                }
              }
              p {
                clear: both;
                padding: 10/@rem 0;
                .fz(22);
                .c3;
              }
            }
            .time {
              .abs;
              top: 0;
              right: 0;
              .c9;
              .rfz(10);
            }

          }
        }
      }
    }

    .number-con {
      .weui-cells {
        .abs-center-vertical;
        right: 0;
        margin-top: 0;
        .no-bg;
        &:before, &:after {
          .none;
        }
        .weui-cell {
          padding: 0;
        }
        .vux-number-input {
          .borBox;
          padding: 0;
          width: 60/@rem !important;
          height: 60/@rem !important;
          .fz(24);
        }
        .vux-number-selector, .vux-number-selector-plus {
          .rel;
          .borBox;
          .size(60, 60);
          /*padding:0;*/
          font-size: 0;
          line-height: 34/@rem;
          svg {
            .abs-center-vh;
            .size(26, 26);
            /*fill: #f34c18;*/
          }
        }
      }
    }

    .cart-model {
      .abs;
      bottom: 0;
      z-index: 20;
      width: 100%;
      .ma-w(640);
      .cf;
      background: #1d2231;
      .wrap {
        height: 100/@rem;
        .cur-cart {
          .borBox;
          .abs;
          left: 20/@rem;
          top: 0;
          z-index: 2;
          .size(100, 100);
          background: #1d2231 url(../../../static/img/carts.png) no-repeat center;
          .rbg-size(50%);
          .borR(50%);
          .transi(.2s);
          i {
            .abs;
            top: -6/@rem;
            right: -8/@rem;
            .block;
            .center;
            line-height: 20/@rem;
            .txt-normal;
            min-width: 20/@rem;
            padding: 4px;
            .fz(20);
            .cf;
            .bdiy(#f74c31);
            .borR(30px);
          }
          &[hasgood] {
            top: -40/@rem;
            .bor(4px, solid, #373c4c);
            box-shadow: 0 1px 10px 0 #fc6b01;
          }
        }
        .left {
          .rel;
          .borBox;
          .fl;
          padding: 0 10/@rem 0 160/@rem;
          width: 68%;
          height: 100%;
          .txt {
            .abs-center-vertical;
            .txt-normal;
            p {
              .fz(20);
            }
          }
        }
        .right {
          .fl;
          width: 32%;
          height: 100%;
          line-height: 100/@rem;
          .center;
          background: #ec3902;
          /*.btn {
            .fr;
          }
          .btn-buy {
            background: #ec3902;
          }
          .btn-add {
            background: #ff9627;
          }*/
        }
      }
    }
  }

  .buyCon {
    .vux-no-group-title {
      margin-top: 0;
      padding: 20/@rem 0 40/@rem;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
        input {
          .c3;
          &:disabled {
            .c3;
          }
        }
      }
      .vux-x-input, .vux-cell-box, .vux-x-textarea {
        .fz(26);
      }
    }

    .top-con {
      .rel;
      .borBox;
      padding: 10/@rem 20/@rem 10/@rem;
      .bor-b;
      .img-con {
        .abs;
        .size(150, 150);
        left: 20/@rem;
        top: 0;
        overflow: hidden;
        background: #f5f5f5 url(../../../static/img/bg_nopic.jpg) no-repeat center;
        -webkit-background-size: cover;
        background-size: cover;
        .bor;
        .borR(3px);
      }
      .side-con {
        .borBox;
        width: 100%;
        height: 100%;
        padding-left: 180/@rem;
        h3 {
          padding-bottom: 10/@rem;
          .txt-normal;
          .cdiy(@c2);
          .fz(34);
          span {
            margin-left: 40/@rem;
            .c9;
            .fz(22);
            .txt-del;
          }
        }
        p {
          .c9;
          .fz(24);
        }
        label {
          .c9;
          .fz(24);
        }
      }
    }

    .tags-con {
      padding: 10/@rem 24/@rem;
      .wrap {
        padding: 14/@rem 0;
        .bor-b;
      }
      h4 {
        .fz(24);
        font-weight: normal;
        .c3;
      }
      ul {
        padding: 14/@rem 0;
        overflow: hidden;
      }
      li {
        .pointer;
        .fl;
        padding: 6/@rem 20/@rem;
        margin: 8/@rem;
        line-height: 1.5;
        font-size: 22/@rem;
        .c6;
        .bf8;
        .bor(1px, solid, #ddd);
        .borR(3px);
        &.active {
          .cf;
          .bdiy(@c3);
          .bor(1px, solid, @c3);
        }
      }
    }

    .number-con {
      .weui-cells {
        padding: 20/@rem 0;
      }
    }

  }

  .btn-addcart {
    width: 100%;
    padding: 30/@rem 0;
    .fz(26);
    .cf;
    .bdiy(@c2);
  }

  .pop-txtcon {
    .vux-no-group-title {
      margin-top: 0;
      padding: 20/@rem 0 40/@rem;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
        input {
          .c3;
          &:disabled {
            .c3;
          }
        }
      }
      .vux-x-input, .vux-cell-box, .vux-x-textarea {
        .fz(26);
      }
    }

    .pop-content {
      .rel;
      height: 100%;
      .borBox;
      padding: 14/@rem 14/@rem 90/@rem;
      h3 {
        .fz(30);
        font-weight: normal;
        .center;
        .c3;
      }
      ul {
        padding: 14/@rem;
        overflow: hidden;
      }
      li {
        margin: 8/@rem;
        line-height: 1.8;
        font-size: 24/@rem;
        .c3;
      }
    }
    .btn-sure {
      .fix;
      bottom: 0;
      z-index: 5;
      width: 100%;
      padding: 30/@rem 0;
      .fz(26);
      .cf;
      .bdiy(@c1);
    }
  }
</style>
