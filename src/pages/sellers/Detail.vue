<template>
  <div class="seller-detail" ref="sellerDetail" @scroll="scrollHandler" v-cloak>

    <div class="scroll-view" ref="scrollView">
      <!--店铺信息-->
      <div class="seller-info">
        <div class="v-items" :data-id="seller.id" @click="toMore">
          <div class="wrap">
            <div class="img-con" :style="seller.headimgurl?('background-image:url('+seller.headimgurl+')'):''"></div>
            <div class="infos">
              <h3>{{seller.name}}<span
                :class="['service_type',seller.serviceTypeCls]">{{seller.serviceTypeName}}</span>
                <span class="distance">{{(seller.distance ? seller.distance : 0) | toFixed(1, true)}}km</span>
              </h3>
              <div class="middle">
                <ol class="star" v-if="seller.sellerScore" v-cloak>
                  <li v-for="star in seller.sellerScore">★</li>
                </ol>
                <ol class="star" v-else>
                  <li class="gray" v-for="star in 5">★</li>
                </ol>
                <span class="hasSell"><i>{{(seller.sellerScore || 0) | toFixed(1)}}分</i>已售{{seller.sellerCount}}单</span>
              </div>
              <div class="tags">
                <label class="c2">{{seller.authLevelName}}</label>
                <span class="dispatchTime">平均{{seller.dispatchTime || 22}}分钟送达</span>
              </div>
            </div>
            <div class="bottom">
              <label class="note" v-if="seller.companyName"><i class="ion ion-ent">企</i>{{seller.companyName}}</label>
              <span><i class="fa fa-check-circle"></i>营业执照</span>
            </div>
          </div>
        </div>
        <div class="notice-con" v-if="seller.notice" ref="noticeCon">
          <p class="txt-scroll" ref="noticeTxt">{{seller.notice}}</p>
        </div>
      </div>

      <!--过滤条-->
      <div class="bar-chamer">
        <div class="goods-filter" ref="filtersMenu">
          <div class="v-filter-tabs">
            <ul class="v-f-tabs">
              <li class="f-img"></li>
              <li :class="curFilterType==='types'?'mfilterActive':''" @click="showFilter('types',$event)">商品类目<i
                class="ico-arr-down"></i>
              </li>
              <li :class="curFilterType==='brands'?'mfilterActive':''" @click="showFilter('brands',$event)">品牌<i
                class="ico-arr-down"></i>
              </li>
            </ul>
            <div class="filter-data" v-if="showFilterCon" :class="showFilterCon?'show':''" v-cloak>
              <ul class="filter-tags" v-show="curFilterDict">
                <li v-for="(data,idx) in curFilterDict"
                    :class="curSelFilter[curFilterType].index==idx?'sfilterActive':''"
                    :data-key="data.key"
                    :data-value="data.value" @click="chooseFilter(idx,data.key,data.value,$event)" v-cloak>
                  {{data.value}}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!--店铺列表-->
      <div class="goods-list" ref="goodsList">
        <ul class="box">
          <li class="v-items" v-for="(item, index) in goods" :data-id="item.id" v-cloak>
            <section class="wrap">
              <div class="click-wrap" :data-id="item.id" @click="toDetail(item.id)">
                <div class="img-con" :style="item.imgurl?('background-image:url('+item.imgurl+')'):''"></div>
                <section class="infos">
                  <h3><span
                    :class="item.type==='goods_type.2'?'milk':''">{{item.type === 'goods_type.2' ? '奶' : '水'}}</span>{{item.name}}
                  </h3>
                  <section class="middle">
                    <span class="price">￥{{item.price|toFixed}}元</span>
                    <span class="hasSell">已售{{item.saleCount}}单</span>
                  </section>
                  <label>{{item.label}}</label>
                </section>
              </div>
              <group class="buy-count">
                <x-number :class="item.type==='goods_type.2'?'buy-count-milk':''" button-style="round"
                          :disabled="cartData && item.sellerId!==cartData.sellerId" :min="0"
                          :max="200" :value="item.number" align="right" :dataId="item.id"
                          :dataSellerId="item.sellerId" :linedata="item"
                          @on-change="changeCount"></x-number>
                <span class="stock">剩余：{{item.stock}}件</span>
              </group>
            </section>
          </li>
        </ul>
        <load-more :show-loading="!noMore" :tip="!noMore?'上拉加载':'就这么多了'" background-color="#f5f5f5"
                   v-if="goods.length"></load-more>
        <div class="iconNoData" v-if="!goods.length" v-cloak><i></i>
          <p>暂无商品</p></div>
      </div>

    </div>

    <!--底部添加奶pop-checker-->
    <div v-transfer-dom>
      <popup class="buyCountCon" v-model="showPop" position="bottom" max-height="80%">
        <group>
          <div class="tags-con" v-if="favorTags" v-cloak>
            <div class="wrap">
              <h4>口味：</h4>
              <ul>
                <li :class="idx===curFavorIdx?'active':''" v-for="(fa,idx) in favorTags"
                    @click="changeFavorTag(idx,fa)">
                  {{fa}}
                </li>
              </ul>
            </div>
          </div>
          <div class="tags-con" v-if="priceTags.length" v-cloak>
            <h4>订购数量：</h4>
            <ul>
              <li :class="idx===curPriceIdx?'active':''" v-for="(tg,idx) in priceTags" :data-id="tg.id"
                  @click="changePriceTag(idx,tg)">{{tg.note}}({{tg.saleNum}}瓶)<br><i
                class="txt-del">￥{{tg.originPrice}}</i>【￥{{tg.salePrice}}元】
              </li>
            </ul>
          </div>
          <x-input id="curMilkAmount" title="配送量(瓶/天)：" placeholder="请输入每日配送量" required text-align="right" type="number"
                   v-model="curMilkAmount" @on-change="changeMilkAmout"></x-input>
          <x-input class="total-p" title="总价：" text-align="right" type="text" readonly
                   v-model="curTotalPrice"></x-input>
        </group>
        <button type="button" class="btn btn-add-cart" @click="addToCart">加入购物车</button>
      </popup>
    </div>

    <!--购物车效果-->
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
    <!--悬浮购物车-->
    <div class="float-cart" style="bottom:3em" ref="floatCart" v-show="curCount"
         v-jump="['cart']">
      <div class="cart-wrap">
        <div class="num-con"><i class="cur-count">{{curCount}}</i></div>
        <div class="price-con">￥{{cartData.totalPrice | toFixed}}</div>
      </div>
    </div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars,indent */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import Swiper from '../../components/Swiper'
  import {Group, GroupTitle, XNumber,XInput, Popup,LoadMore,TransferDom} from 'vux'
  import {goodsApi, nearbyApi, cartApi} from '../../service/main.js'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'seller_detail',
    directives: {
      TransferDom
    },
    data() {
      return {
        sellerId: null,
        cartData: '',
        seller: {},
        goods: [],
        noticeScroll: false,
        curLinedata: null,
        params: {
          sellerId: null,
          pageSize: 5,
          pageNo: 1,
          /*goodsType: '',
           brandId: ''*/
        },
        /*底部奶的浮窗-start*/
        showPop: false,
        /*价格标签-start*/
        curMilkAmount: 1,
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
        /* filter start */
        showFilterCon: false,
        filterOffset: 0,
        filters: {
          types: [
            {
              key: '',
              value: '全部'
            },
            {
              key: 'goods_type.1',
              value: '桶装水'
            },
            {
              key: 'goods_type.2',
              value: '奶'
            }
          ],
          brands: [
            {
              key: '',
              value: '全部'
            },
            {
              key: 1,
              value: '怡宝'
            },
            {
              key: 2,
              value: '康师傅'
            },
            {
              key: 3,
              value: '百岁山'
            },
            {
              key: 4,
              value: '花果山'
            },
            {
              key: 5,
              value: '水老官'
            },
            {
              key: 6,
              value: '一方人'
            },
            {
              key: 7,
              value: '农夫山泉'
            },
            {
              key: 8,
              value: '八宝山'
            },
            {
              key: 9,
              value: '昆仑山'
            }
          ]
        },
        curFilterType: '', // 当前筛选分类
        curFilterDict: null, // 当前的filter数据
        curSelFilter: {
          types: {
            index: '',
            key: '',
            value: ''
          },
          brands: {
            index: '',
            key: '',
            value: ''
          }
        }, // 当前选择的过滤条件
        /* filter end */
        scrollTop: 0,
        isPosting: false,
        noMore: false,
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
        },
        curCount: 0,
        balls: [ //小球 设为3个
          {
            show: false
          }, {
            show: false

          }, {
            show: false
          }
        ],
        dropBalls: []
      }
    },
    components: {
      Group,
      GroupTitle,
      XNumber,
      XInput,
      Popup,
      LoadMore,
      TransferDom
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
      vm.getSeller()
      vm.getGoods()
      vm.viewCart()
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'seller_detail') {
          vm.resetScroll()
          vm.getSeller()
          vm.getGoods()
        }
      },
      goods() {
        vm.syncList()
      },
      cartData() {
        vm.syncList()
      },
      curCount() {
        vm.syncList()
      }
    },
    methods: {
      /*滚动检测*/
      onScroll() {
        // 监听dom的scroll事件
        vm.throttle(vm.scrollHandler, 1000)
      },
      scrollHandler() {
        // 滚动中的真正的操作
        let target = vm.$refs.filtersMenu
        let docs = vm.$refs.scrollView
        let winH = document.body.clientHeight;
        let docH = docs.offsetHeight;
        let scrollTop = vm.$refs.sellerDetail.scrollTop
        !vm.filterOffset ? vm.filterOffset = target.offsetTop : null
        // console.info('文档高度：' + winH + '\n内容高度：' + docH + '\n滚动高度：' + scrollTop + '\n筛选条位置：' + vm.filterOffset)
        if (vm.showFilterCon) {
          vm.hideFilter()
        }
        if (scrollTop >= vm.filterOffset) {
          target.classList.add('fixed')
        } else {
          target.classList.remove('fixed')
        }
        if (scrollTop >= (docH - winH) - 10) {
          // console.log('到底部了，需要加载了…');
          vm.getGoods(true);
        }
      },
      resetScroll() {
        setTimeout(function () {
          let target = vm.$refs.filtersMenu
          target.classList.remove('fixed')
        }, 100)
      },
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      toDetail(id) {
        if (vm.showFilterCon) {
          vm.showFilterCon = false
          vm.curFilterType = ''
          return false
        }
        vm.$router.push({name: 'goods_detail', query: {id: id}})
      },
      toMore() {
        if (vm.showFilterCon) {
          vm.showFilterCon = false
          vm.curFilterType = ''
          return false
        }
        vm.$router.push({
          name: 'seller_detail_more',
          query: {thedata: window.encodeURIComponent(JSON.stringify(vm.seller))}
        })
      },
      /* 页面数据 */
      getSeller() {
        vm.sellerId = vm.params.sellerId = vm.$route.query.id
        vm.loadData(nearbyApi.sellerDetail, {id: vm.sellerId}, 'POST', function (res) {
          if (res.data) {
            var resD = res.data
            switch (resD.authLevel) {
              case 'seller_level.1':
                resD.authLevelName = '普通店铺'
                break
              case 'seller_level.2':
                resD.authLevelName = '官方认证'
                break
              case 'seller_level.3':
                resD.authLevelName = '金牌店铺'
                break
            }
            switch (resD.serviceType) {
              case 'seller_service_type.1':
                resD.serviceTypeName = '水'
                resD.serviceTypeCls = 'water'
                break
              case 'seller_service_type.2':
                resD.serviceTypeName = '奶'
                resD.serviceTypeCls = 'milk'
                break
              case 'seller_service_type.3':
                resD.serviceTypeName = '水&奶'
                resD.serviceTypeCls = 'water-milk'
                break
            }
            resD.sellerScore = Math.ceil(resD.sellerScore)
            vm.seller = resD
            vm.scrollNotice(vm.seller.notice)
          }
        })
      },
      scrollNotice(text){
        if (text) {
          setTimeout(function () {
            var noticeCon = vm.$refs.noticeCon
            var noticeTxt = vm.$refs.noticeTxt
            if (noticeCon.clientWidth < noticeTxt.clientWidth) {
              if (text.length <= 10) {
                noticeTxt.classList.add('txt-fast')
                return
              }
              if (text.length > 10 && text.length <= 20) {
                noticeTxt.classList.add('txt-medium')
                return
              }
              if (text.length > 20) {
                noticeTxt.classList.add('txt-slow')
                return
              }
            } else {
              noticeTxt.classList.remove('txt-slow,txt-slow,txt-fast')
            }
          }, 0)
        }
      },
      getGoods(isLoadMore) {
        if (vm.isPosting) return false
        vm.isPosting = true
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.loadData(goodsApi.sellerGoods, vm.params, 'POST', function (res) {
          vm.isPosting = false
          var resD = res.data.pager
          if (!isLoadMore) {
            if (resD.totalCount < vm.params.pageSize) {
              vm.noMore = true
            } else {
              vm.noMore = false
            }
            vm.goods = resD.itemList
          } else {
            if (resD.itemList.length) {
              for (var i = 0; i < resD.itemList.length; i++) {
                var cur = resD.itemList[i];
                vm.goods.push(cur)
              }
            } else {
              vm.noMore = true
            }
          }
          console.log(vm.goods, '商家的GoodsList')
        }, function () {
          vm.isPosting = false
        })
      },
      onPullDown() {
        if (vm.isPosting) {
          return false
        } else {
          setTimeout(function () {
            vm.getGoods()
          }, 1000)
        }
      },
      onPullUp() {
        if (vm.isPosting) {
          return false
        } else {
          setTimeout(function () {
            vm.getGoods(true)
          }, 1000)
        }
      },
      /*添加奶*/
      getTags(id) {
        vm.isPosting = true
        vm.loadData(goodsApi.saleConfigList, {goodsId: id}, 'POST', function (res) {
          vm.isPosting = false
          if (res.data.itemList.length) {
            vm.curMilkAmount = 1
            vm.priceTags = res.data.itemList
            vm.curPriceTag = vm.priceTags[0]
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
      /* 商品筛选 */
      showFilter(type, e) {
        if (vm.showFilterCon) {
          if (vm.curFilterType === type) {
            vm.curFilterType = ''
            vm.showFilterCon = false
          } else {
            vm.curFilterType = type
            vm.curFilterDict = vm.filters[type]
            vm.showFilterCon = true
          }
        } else {
          vm.curFilterType = type
          vm.curFilterDict = vm.filters[type]
          vm.showFilterCon = true
        }
      },
      hideFilter() {
        if (vm.showFilterCon) {
          vm.showFilterCon = false
          vm.curFilterType = ''
        }
      },
      chooseFilter(idx, key, value, e) {
        // console.log(arguments)
        vm.curSelFilter[vm.curFilterType].index = idx
        vm.curSelFilter[vm.curFilterType].key = key
        vm.curSelFilter[vm.curFilterType].value = value
        // console.error(JSON.stringify(vm.curSelFilter, null, 2))
        vm.curSelFilter.types.key ? vm.params.goodsType = vm.curSelFilter.types.key : delete vm.params.goodsType
        vm.curSelFilter.brands.key ? vm.params.brandId = vm.curSelFilter.brands.key : delete vm.params.brandId
        vm.hideFilter()
        vm.getGoods()
      },
      /* 购物车 */
      syncList() {
        if (vm.goods && vm.goods.length) {
          for (let i = 0; i < vm.goods.length; i++) {
            let cur01 = vm.goods[i]
            if (vm.cartData && vm.cartData.goodsList.length) {
              for (let j = 0; j < vm.cartData.goodsList.length; j++) {
                let cur02 = vm.cartData.goodsList[j]
                if (cur01.id === cur02.goodsId) {
                  cur01['number'] = cur02.goodsNum
                }
              }
            } else {
              cur01['number'] = 0
            }
          }
        }
      },
      viewCart(cb) {
        vm.loadData(cartApi.view, null, 'POST', function (res) {
          var resD = res.data
          // console.log(resD, '购物车数据')
          vm.cartData = resD
          vm.curCount = resD.totalNum
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
      addToCart() {
        // 判断当前是否填写了数量
        if (vm.curMilkAmount) {
          vm.loadData(cartApi.add, {
            goodsId: vm.curLinedata.id,
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
        // console.log(obj)
        if (vm.cartData.sellerId && obj.sellerId !== vm.cartData.sellerId) {
          vm.clearCart()
          return
        }
        vm.curLinedata = obj
        if (obj.linedata.type === 'goods_type.2' && obj.type === 'add') {
          vm.getTags(obj.id)
          vm.favorTags = obj.linedata.flavourLabel ? obj.linedata.flavourLabel.split(',') : []
          vm.curFavorTag = vm.favorTags.length ? vm.favorTags[0] : ''
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
            return
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
        let cartCls = vm.$refs.floatCart.classList
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(-10px,-80px,0)'
        inner.style.transform = 'translate3d(-10px,-80px,0)'
        el.addEventListener('transitionend', done)
        cartCls.toggle('bulbing')
        setTimeout(function () {
          cartCls.remove('bulbing')
        }, 800)
      },
      /*初始化小球*/
      afterDrop(el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .seller-detail {
    height: 100%;
    overflow: scroll; // 此两个属性至关重要，不写@scroll监听不到滚动
    .swiper-shop {
      margin-bottom: 10/@rem;
      .swiper-pagination {
        bottom: 5px;
      }
      .swiper-pagination-bullet-active {
        background: #eee;
      }
    }

    .seller-info {
      background: url(../../../static/img/bg_user.jpg) no-repeat top center;
      .rbg-size(100%, 100%);
      .v-items {
        .rel;
        padding: 20/@rem;
        .wrap {
          .rel;
        }
        .img-con {
          .abs;
          top: 0;
          .size(150, 150);
          overflow: hidden;
          background: #f5f5f5 url(../../../static/img/bg_nopic.jpg) no-repeat center;
          -webkit-background-size: cover;
          background-size: cover;
        }
        .infos {
          .flex;
          .flex-d-v;
          .borBox;
          width: 100%;
          .h(150);
          padding-left: 170/@rem;
          h3 {
            .flex-r(1);
            .fz(28);
            .txt-normal;
            .cf;
            .ellipsis;
          }
          .middle {
            .flex-r(1);
            span {
              &.price {
                .cf;
                .fz(26);
              }
              &.hasSell {
                .ce;
                .fz(22);
                i {
                  .iblock;
                  padding:6/@rem 30/@rem 0 0;
                  .txt-normal;
                  .cdiy(#ff9900);
                }
              }
            }
            .star {
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
          }
          .tags {
            .flex-r(1);
            label {
              .fl;
              margin-right: 10/@rem;
              padding: 1px 8px;
              line-height: 1.8;
              .cf;
              .fz(16);
              .borR(4px);
              &.c1 {
                .bdiy(#fd5900);
              }
              &.c2 {
                .bdiy(#78c725);
              }
              &.c3 {
                .bdiy(#c77e25);
              }
            }
            .dispatchTime {
              .fr;
              padding-top: 10/@rem;
              .cc;
              .block;
              .fz(20);
            }
          }
          .distance {
            .abs;
            right: 0;
            top: 0;
            .cc;
            .fz(20);
          }
        }
        .bottom {
          overflow: hidden;
          .note {
            .fl;
            .rel;
            padding-top: 10/@rem;
            .cd;
            .block;
            .fz(20);
            i{
              .iblock;
              margin-right:2px;
              padding: 1px;
              background: #18abf3;
              .borR(2px);
            }
          }
          span {
            padding-top: 10/@rem;
            .fr;
            .cdiy(#7cda19);
            .fz(20);
          }
        }
      }
      .service_type {
        margin-left: 4px;
        padding: 0 2px;
        font-weight: normal;
        .cf;
        .fz(22);
        background: #2acaad;
        .borR(2px);
        &.water {
          background: #2acaad;
        }
        &.milk {
          background: #74c361;
        }
        &.water-milk {
          background: #ad64d2;
        }
      }
      .notice-con {
        padding: 5px 20/@rem;
        .fz(20);
        .cf;
        overflow: hidden;
        background: rgba(115, 115, 115, 0.58);
        p {
          .iblock;
          white-space: nowrap;
          word-break: break-all;
        }
        a {
          .cdiy(#38aee8);
        }
      }
    }

    .txt-slow {
      -webkit-animation: txtScroll 30s linear infinite;
      animation: txtScroll 30s linear infinite;
    }

    .txt-medium {
      -webkit-animation: txtScroll 18s linear infinite;
      animation: txtScroll 18s linear infinite;
    }

    .txt-fast {
      -webkit-animation: txtScroll 8s linear infinite;
      animation: txtScroll 8s linear infinite;
    }

    @keyframes txtScroll {
      from {
        -webkit-transform: translate3D(100%, 0, 0);
        transform: translate3D(100%, 0, 0);
      }
      to {
        -webkit-transform: translate3D(-100%, 0, 0);
        transform: translate3D(-100%, 0, 0);
      }
    }

    .bar-chamer {
      min-height: 80/@rem;
    }

    .goods-filter {
      .rel;
      z-index: 10;
      margin-bottom: 1px;
      &.fixed {
        width: 100%;
        .fix;
        top: 0;
      }
      .v-filter-tabs {
        width: 100%;
        margin-bottom: 1px;
        padding: 10/@rem 0;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        .bf;
        .v-f-tabs {
          height: 60/@rem;
          li {
            .pointer;
            .rel;
            .borBox;
            .fl;
            width: 33.3333%;
            height: 60/@rem;
            line-height: 60/@rem;
            .c3;
            .center;
            font-size: 14px;
            .ico-arr-down {
              .abs-center-vertical;
              width: 30px;
              height: 30px;
              &:before {
                content: "";
                position: absolute;
                width: 6px;
                height: 6px;
                border: 1px solid #666;
                border-width: 1px 0 0 1px;
                -webkit-transform: rotate(-135deg);
                transform: rotate(-135deg);
                top: 10px;
                left: 7px;
                .transi(.2s);
              }
            }
            &.mfilterActive {
              .cdiy(#f1582a);
              .ico-arr-down {
                &:before {
                  border-color: #f1582a;
                  -webkit-transform-origin: 0 center;
                  transform-origin: 0 center;
                  -webkit-transform: rotate(45deg);
                  transform: rotate(45deg);
                }
              }
            }
            &:nth-child(2) {
              /*border-left: 1px solid #eee;*/
              border-right: 1px solid #eee;
            }
            &.f-img {
              background: url(../../../static/img/f-tit.png) no-repeat center;
              .rbg-size(70%);
            }
          }
        }
        .filter-data {
          .abs;
          z-index: 10;
          .borBox;
          margin-top: 8/@rem;
          opacity: 0;
          height: 0;
          width: 100%;
          .bf;
          border-top: 1px solid #eee;
          .bsd(0, 10px, 18px, 0, rgba(0, 0, 0, 0.25));
          .transi(.2s);
          &.show {
            opacity: 1;
            height: auto;
            padding: 30/@rem 18/@rem;
          }
          .filter-tags {
            overflow: hidden;
            li {
              .pointer;
              .fl;
              padding: 3px 10px;
              margin: 10/@rem;
              line-height: 1;
              font-size: 12px;
              .c6;
              .bf1;
              .borR(10px);
              &.sfilterActive {
                .cf;
                .bdiy(#f1582a);
              }
            }
          }
        }
      }
    }

    .goods-list {
      .rel;
      /*padding-bottom: 30px;*/
      /*.box {}*/
      .v-items {
        .rel;
        padding: 20/@rem;
        .bf;
        &:not(:last-child) {
          .bor-b;
        }
        .wrap {
          .flex;
          .rel;
          .h(150);
        }
        .click-wrap {
          .borBox;
          .flex-r(1);
          overflow: hidden;
        }
        .img-con {
          .abs-center-vertical;
          .size(140, 140);
          overflow: hidden;
          background: #f5f5f5 url(../../../static/img/bg_nopic.jpg) no-repeat center;
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
            .flex-r(1);
            padding: 8/@rem 0;
            span {
              &.price {
                .c3;
                .fz(24);
              }
              &.hasSell {
                padding-left: 30/@rem;
                .c9;
                .fz(22);
              }
            }
          }
          label {
            .flex-r(1);
            .cdiy(#f34c18);
            .fz(22);
          }
        }
      }
      .buy-count {
        .rel;
        width: 160/@rem;
        .weui-cells {
          .abs-center-vertical;
          right: -10/@rem;
          margin-top: 0;
          .no-bg;
          &:before, &:after {
            .none;
          }
          .weui-cell {
            padding: 0;
          }
          .vux-number-input {
            width: 50/@rem !important;
            height: 34/@rem !important;
            .fz(24);
          }
          .vux-number-selector, .vux-number-selector-plus {
            .size(30, 30);
            padding: 2px;
            font-size: 0;
            line-height: 34/@rem;
            /*border-color: #f34c18;*/
            svg {
              .size(30, 30);
              /*fill: #f34c18;*/
            }
          }
        }
        .stock {
          .fz(22);
          .c9;
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
    }
  }

  .buyCountCon {
    .vux-no-group-title {
      margin-top: 0;
      padding: 20/@rem 0 40/@rem;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
        input {
          .c3;
          &:read-only {
            .c3;
          }
          &:disabled {
            .c3;
          }
        }
      }
      .vux-x-input, .vux-cell-box, .vux-x-textarea {
        .fz(26);
      }
    }

    .tags-con {
      padding: 20/@rem 24/@rem;
      .wrap {
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
    .btn-add-cart {
      width: 100%;
      padding: 30/@rem 0;
      .fz(26);
      .cf;
      .bdiy(@c2);
    }
  }

</style>
