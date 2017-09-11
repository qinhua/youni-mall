<template>
  <div class="seller-detail" ref="sellerDetail" @scroll="scrollHandler">
    <!--banner-->
    <!--<div class="swiper-shop">-->
    <!--<swiper ref="slider02" skey="s03" :slides="banner" autoPlay="2500"></swiper>-->
    <!--</div>-->
    <div class="shop-info">
      <div class="v-items" :data-id="seller.id">
        <div class="wrap">
          <img :src="seller.headimgurl">
          <div class="infos">
            <h3>{{seller.name}}({{seller.serviceTypeName}})<span
              class="distance">{{seller.distance ? ((seller.distance / 1000) | toFixed(1)) : seller.distance}}km</span>
            </h3>
            <div class="middle">
              <ol class="star">
                <li class="gray" v-for="star in 5" v-if="!seller.score">★</li>
                <li v-for="star in 5" v-else>★</li>
              </ol>
              <span
                class="hasSell"><i>{{((seller.score || 0) / 1000) | toFixed(1)}}分</i>已售{{seller.sellerCount}}单</span>
            </div>
            <div class="tags">
              <label class="c2">{{seller.authLevelName}}</label>
              <span class="dispatchTime">平均{{seller.dispatchTime || 22}}分钟送达</span>
            </div>
          </div>
          <div class="bottom">
            <label class="note" v-if="seller.note">{{seller.note || '商家特惠'}}</label>
          </div>
        </div>
      </div>
      <div class="contacts">
        <p>地址：{{seller.address}}</p>
        <p>配送电话：<a :href="'tel:'+seller.phone">{{seller.phone}}</a>，楼梯房需收取上楼费</p>
      </div>
    </div>

    <!--过滤条-->
    <div class="goods-filter" ref="filters03">
      <div class="v-filter-tabs">
        <ul class="v-f-tabs">
          <li class="f-img"></li>
          <li :class="curFilterType==='categorys'?'mfilterActive':''" @click="showFilter('categorys',$event)">商品类目<i
            class="ico-arr-down"></i>
          </li>
          <li :class="curFilterType==='brands'?'mfilterActive':''" @click="showFilter('brands',$event)">品牌<i
            class="ico-arr-down"></i>
          </li>
        </ul>
        <div class="filter-data" v-if="showFilterCon" :class="showFilterCon?'show':''">
          <ul class="filter-tags" v-show="curFilterDict">
            <li v-for="(data,idx) in curFilterDict" :class="curSelFilter[curFilterType].index==idx?'sfilterActive':''"
                :data-key="data.key"
                :data-value="data.value" @click="chooseFilter(idx,data.key,data.value,$event)">{{data.value}}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!--店铺列表-->
    <div class="goods-list" ref="goodsList">
      <scroller class="inner-scroller" lock-x scrollbarY use-pullup use-pulldown :pullup-config="pullupConfig"
                :pulldown-config="pulldownConfig"
                @on-scroll="onScroll"
                @on-pulldown-loading="onPullDown" @on-pullup-loading="onPullUp" @on-scroll-bottom="" ref="myScroll"
                :scroll-bottom-offst="300">
        <div class="box">
          <section class="v-items" v-for="(item, index) in goods" :data-id="item.id">
            <section class="wrap">
              <div class="click-wrap" :data-id="item.id" @click="toDetail(item.id)">
                <img :src="item.imgurl">
                <section class="infos">
                  <h3>{{item.name}}</h3>
                  <section class="middle">
                    <span class="price">￥{{item.price}}</span>
                    <span class="hasSell">已售{{item.saleCount}}单</span>
                  </section>
                  <label>{{item.label}}</label>
                </section>
              </div>
              <group class="buy-count">
                <x-number button-style="round" :disabled="cartData && item.sellerId!==cartData.sellerId" :min="0"
                          :max="50" :value="item.number" align="right" :dataId="item.id"
                          :dataSellerId="item.sellerId"
                          @on-change="changeCount"></x-number>
              </group>
            </section>
          </section>
          <div class="noMoreData" v-if="goods.length">{{noMore ? '就这么多了' : '上拉加载'}}</div>
          <div class="iconNoData" v-else><i></i><p>暂无商品</p></div>
        </div>
      </scroller>
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
    <div class="float-cart" ref="floatCart" v-show="curCount"
         v-jump="['cart']">
      <div class="cart-wrap"><i class="cur-count">{{curCount}}</i></div>
    </div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars,indent */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import Swiper from '../../components/Swiper'
  import {Group, GroupTitle, Grid, GridItem, Marquee, MarqueeItem, XNumber, Scroller, LoadMore} from 'vux'
  import {goodsApi, nearbyApi,cartApi} from '../../service/main.js'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'seller_detail',
    data() {
      return {
        sellerId: null,
        cartData: '',
        seller: {},
        goods: [],
        params: {
          sellerId: null,
          pageSize: 5,
          pageNo: 1,
          /*goodsCategory: '',
           brandId: ''*/
        },
        /* filter start */
        showFilterCon: false,
        filterOffset: 0,
        filters: {
          categorys: [
            {
              key: '',
              value: '全部'
            },
            {
              key: 1,
              value: '桶装水'
            },
            {
              key: 2,
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
          categorys: {
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
      Marquee,
      MarqueeItem,
      XNumber,
      Scroller,
      LoadMore
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
      // 点击区域之外隐藏筛选栏
      document.addEventListener('click', function (e) {
        if (e.target.offsetParent) {
          if (JSON.stringify(e.target.offsetParent.classList).indexOf('filter') === -1) {
            vm.hideFilter()
            return false
          }
        }
      }, false)
      vm.$nextTick(function () {
        //获取筛选栏位置
        setTimeout(function(){
          vm.filterOffset = vm.$refs.filters03.offsetTop
        },300)
        vm.resetScroll()
      })
    },
    /*computed: {
     //如果要动态改变，必须有setter方法
     curCount: {
     get: function () {
     return this.$store.state.cart.count
     },
     set: function (newValue) {
     this.$store.commit('updateCart', newValue)
     }
     }
     },*/
    watch: {
      '$route'(to, from) {
        if (to.name === 'seller_detail') {
          vm.getSeller()
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
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      resetScroll() {
        setTimeout(function () {
          vm.$refs.myScroll.reset()
          vm.$refs.myScroll.donePullup()
          vm.$refs.myScroll.donePulldown()
          let target = vm.$refs.filters03
          let list = vm.$refs.goodsList
          target.classList.remove('fixed')
          list.classList.remove('fixed')
          vm.$refs.myScroll.reset()
        }, 100)
      },
      scrollHandler() {
        // 监听dom的scroll事件
        setTimeout(function () {
          let scrollTop = vm.$refs.sellerDetail.scrollTop
          let target = vm.$refs.filters03
          let list = vm.$refs.goodsList
          if (vm.showFilterCon) {
            vm.hideFilter()
          }
          if (scrollTop >= vm.filterOffset) {
            target.classList.add('fixed')
            list.classList.add('fixed')
          } else {
            target.classList.remove('fixed')
            list.classList.remove('fixed')
          }
        }, 300)
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
                break
              case 'seller_service_type.2':
                resD.serviceTypeName = '奶'
                break
              case 'seller_service_type.3':
                resD.serviceTypeName = '水+奶'
                break
            }
            vm.seller = resD
          }
        })
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
              /*vm.$nextTick(function () {
               vm.$refs.myScroll.disablePullup()
               })*/
            } else {
              vm.noMore = false
            }
            vm.goods = resD.itemList
          } else {
            resD.itemList.length ? vm.goods.concat(resD.itemList) : vm.noMore = true
          }
          console.log(vm.goods, '商家的GoodsList')
        }, function () {
          vm.isPosting = false
        })
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
        console.error(JSON.stringify(vm.curSelFilter, null, 2))
        vm.curSelFilter.categorys.key ? vm.params.goodsCategory = vm.curSelFilter.categorys.key : delete vm.params.goodsCategory
        vm.curSelFilter.brands.key ? vm.params.brandId = vm.curSelFilter.brands.key : delete vm.params.brandId
        vm.hideFilter()
        vm.getGoods()
      },
      onScroll(pos) {
        this.scrollTop = pos.top
        vm.hideFilter()
      },
      onPullDown() {
        if (vm.isPosting) {
          // do nothing
          return false
        } else {
          // this.isPosting = true
          setTimeout(function () {
            // vm.bottomCount += 10
            vm.getGoods()
            vm.$nextTick(function () {
              vm.$refs.myScroll.reset({top: 0})
              vm.$refs.myScroll.donePullup()
              vm.$refs.myScroll.donePulldown()
            })
          }, 1500)
        }
      },
      /* 上下拉刷新 */
      onPullUp() {
        if (vm.isPosting) {
          // do nothing
          return false
        } else {
          // vm.isPosting = true
          setTimeout(function () {
            // vm.bottomCount += 10
            vm.getGoods(true)
            vm.$nextTick(function () {
              vm.$refs.myScroll.reset({bottom: 0})
              vm.$refs.myScroll.donePullup()
              vm.$refs.myScroll.donePulldown()
            })
          }, 200)
        }
      },
      changeCount(obj) {
        console.log(obj)
        if (obj.type === 'add') {
          this.additem(obj.event)
          this.count++
        } else if (obj.type === 'sub') {
          this.count--
        } else {
          this.count = obj.value
        }
        vm.$store.commit('updateCart', this.count)
        console.log(vm.$store.state.cart.count)
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
      changeCount(obj) {
        if (vm.isPosting) return
        vm.isPosting = true
        if (obj.type === 'add') {
          if (vm.cartData.sellerId && vm.cartData.sellerId !== obj.sellerId) {
            //vm.toast('购物车中已有其他店铺商品，请先清空')
            vm.confirm('温馨提示', '当前购物车中已有其他店铺商品，请先清空！', function () {
              vm.isPosting = true
              vm.loadData(cartApi.clear, null, 'POST', function (res) {
                vm.viewCart()
                vm.isPosting = false
              }, function () {
                vm.isPosting = false
              })
            })
            return
          }
          vm.loadData(cartApi.add, {goodsId: obj.id}, 'POST', function (res) {
            if (res.success) {
              vm.viewCart()
              vm.additem(obj.event)
            } else {
              vm.toast(res.message || '购物车中已有其他店铺商品，请先清空')
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
        setTimeout(function(){
          cartCls.remove('bulbing')
        },800)
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

    .shop-info {
      background: url(../../../static/img/bg_user.jpg) no-repeat top center;
      .rbg-size(100%);
      .v-items {
        .rel;
        padding: 20/@rem;
        .wrap {
          .rel;
        }
        img {
          .abs;
          left: 0;
          top: 0;
          .size(150, 150);
          background: #f5f5f5 url(../../../static/img/noImg.png) no-repeat center;
          -webkit-background-size: 30% auto;
          background-size: 30% auto;
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
            .price {
            }
            span {
              &.price {
                .cf;
                .fz(24);
                .txt-del;
              }
              &.hasSell {
                .ce;
                .fz(22);
                i {
                  padding-right: 30/@rem;
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
                .fz(24);
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
        }
        .note {
          .fl;
          .rel;
          padding: 10/@rem 0 0 30/@rem;
          .cd;
          .block;
          .fz(20);
          &:before {
            .abs;
            .block;
            left: 0;
            top: 12/@rem;
            content: '惠';
            .size(26, 26);
            .center;
            line-height: 26/@rem;
            background: #f38918;
          }
        }
      }
      .contacts {
        padding: 5px 20/@rem;
        .fz(20);
        .cf;
        background: rgba(0, 0, 0, .5);
        p {
          .ellipsis-clamp-2;
        }
        a {
          .cdiy(#38aee8);
        }
      }
    }

    .goods-filter {
      .rel;
      z-index: 10;
      margin-bottom: 10/@rem;
      .transi(.2s);
      &.fixed {
        width: 100%;
        .fix;
        top: 0;
      }
      .v-filter-tabs {
        width: 100%;
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
              position: absolute;
              width: 30px;
              height: 30px;
              top: 6/@rem;
              &:before {
                content: "";
                position: absolute;
                width: 6px;
                height: 6px;
                border: 1px solid #666;
                border-width: 1px 0 0 1px;
                -webkit-transform: rotate(-135deg);
                transform: rotate(-135deg);
                top: 8px;
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
          .bsd(0, 10px, 18px, 0, #ccc);
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
      /*max-height:500px;*/
      overflow: auto;
      &.fixed {
        .xs-container {
          margin-top: 90/@rem;
        }
      }
      .inner-scroller {
        .borBox;
        height:100%!important;
        .v-items {
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
          img {
            .abs;
            left: 0;
            top: 0;
            .size(150, 150);
            background: #f5f5f5 url(../../../static/img/noImg.png) no-repeat center;
            -webkit-background-size: 30% auto;
            background-size: 30% auto;
          }
          .infos {
            .flex;
            .flex-d-v;
            .borBox;
            width: 100%;
            height: 100%;
            padding-left: 170/@rem;
            h3 {
              .flex-r(1);
              .fz(28);
              .txt-normal;
              .c3;
              .ellipsis;
            }
            .middle {
              .flex-r(1);
              padding: 10/@rem 0;
              .price {
              }
              span {
                &.price {
                  .c3;
                  .fz(24);
                  .txt-del;
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
        }
      }
    }
  }

</style>
