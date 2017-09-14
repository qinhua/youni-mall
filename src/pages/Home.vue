<template>
  <!--<div class="home" ref="home" v-cloak @scroll="scrollHandler">-->
  <div class="home" ref="home" v-cloak>
    <!--地图组件-->
    <div class="location-chooser">
      <p><span><i class="fa fa-map-marker"></i>&nbsp;您的位置：</span>{{address || geoAddress}}</p>
      <a @click.prevent="toMap"><i class="right-arrow"></i></a>
    </div>

    <!--banner-->
    <div class="swiper-home">
      <swiper ref="slider01" skey="s01" :slides="banner" autoPlay="2500"></swiper>
    </div>

    <!--中间入口-->
    <div class="middle-entry">
      <grid :rows="4">
        <grid-item label="订水" link="/home" @on-item-click="setPageStatus(1)">
          <img slot="icon" src="../../static/img/item_water.png">
        </grid-item>
        <grid-item label="订奶" link="/nearby" @on-item-click="setPageStatus(2)">
          <img slot="icon" src="../../static/img/item_milk.png">
        </grid-item>
        <grid-item label="购物车" link="/cart">
          <img slot="icon" src="../../static/img/item_cart.png">
        </grid-item>
        <grid-item label="红包" link="/coupons">
          <img slot="icon" src="../../static/img/item_redpacket.png">
        </grid-item>
      </grid>
      <div class="top-notice" v-if="notice.length">
        <div class="inner">
          <div class="ico ico-toutiao"></div>
          <marquee>
            <marquee-item v-for="(news, i) in notice" :key="i" :data-id="news.noticeId"
                          @click.native="toTopic(news.url)"
                          class="align-middle">{{news.name}}
            </marquee-item>
          </marquee>
        </div>
      </div>
    </div>

    <!--过滤条-->
    <div style="height:44px;">
      <sticky>
        <div class="goods-filter" ref="filters01">
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
                <li v-for="(data,idx) in curFilterDict"
                    :class="curSelFilter[curFilterType].index==idx?'sfilterActive':''"
                    :data-key="data.key"
                    :data-value="data.value" @click="chooseFilter(idx,data.key,data.value,$event)">{{data.value}}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </sticky>
    </div>

    <!--商品列表-->
    <div class="goods-list" ref="goodsList">
      <scroller class="inner-scroller" scrollbarY lock-x use-pullup use-pulldown :pullup-config="pullupConfig"
                :pulldown-config="pulldownConfig"
                @on-scroll="onScroll"
                @on-pulldown-loading="onPullDown" @on-pullup-loading="onPullUp" @on-scroll-bottom="" ref="myScroll"
                :scroll-bottom-offst="300">
        <div class="box">
          <section class="v-items" v-for="(item, index) in goods" :data-id="item.id">
            <section class="wrap">
              <div class="click-wrap" :data-id="item.id" @click="toDetail(item.id)">
                <div class="img-con">
                  <img :src="item.imgurl">
                </div>
                <section class="infos">
                  <h3>{{item.name}}</h3>
                  <section class="middle">
                    <span class="price">￥{{item.price}}</span>
                    <span class="hasSell">已售{{item.saleCount}}单</span>
                  </section>
                  <ul class="tags" v-if="item.label">
                    <li v-for="t in item.label.split(',')">{{t}}</li>
                  </ul>
                  <label></label>
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
          <div class="iconNoData" v-else><i></i>
            <p>暂无商品</p></div>
          <!--<load-more tip="loading"></load-more>-->
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
  import $ from 'jquery'
  import Swiper from '../components/Swiper'
  import {
    Group,
    GroupTitle,
    Grid,
    GridItem,
    Marquee,
    MarqueeItem,
    XNumber,
    XSwitch,
    Sticky,
    Scroller,
    LoadMore
  } from 'vux'
  import {homeApi, cartApi} from '../service/main.js'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'home',
    data() {
      return {
        geoData: null,
        address: '',
        cartData: '',
        banner: [],
        notice: [],
        goods: [],
        params: {
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
        noMore: false,
        isPosting: false,
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
    props: ['geoAddress'],
    components: {
      Swiper,
      Group,
      GroupTitle,
      Grid,
      GridItem,
      Marquee,
      MarqueeItem,
      XNumber,
      Sticky,
      Scroller,
      LoadMore
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
      vm.getMap()
      vm.getBanner()
      vm.getNotice()
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
        setTimeout(function () {
          vm.filterOffset = vm.$refs.filters01.offsetTop
        }, 300)
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
        if (to.name === 'home') {
          vm.resetScroll()
          vm.getMap()
          vm.getGoods()
          vm.viewCart()
        }
      },
      goods() {
        vm.syncList()
      }
    },
    methods: {
      // 全局定位
      getMap(data) {
        var tmp = me.locals.get('cur5656Position')//存储的用户选择位置
        if (tmp) {
          var data = JSON.parse(tmp)
          console.log(data, 'home amap info')
          if (data) {
            vm.geoData = data
            vm.address = data.name
          }
        }
        vm.getGoods() // 用户修改位置之后重载列表
      },
      toMap() {
        vm.$router.push({name: 'amap', query: {path: vm.$route.path.replace(/\//g, '')}})
      },
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      resetScroll() {
        setTimeout(function () {
          vm.$refs.myScroll.reset()
          vm.$refs.myScroll.donePullup()
          vm.$refs.myScroll.donePulldown()
          let target = vm.$refs.filters01
          let list = vm.$refs.goodsList
          target.classList.remove('fixed')
          list.classList.remove('fixed')
          vm.$refs.myScroll.reset()
        }, 100)
      },
      scrollHandler() {
        // 监听dom的scroll事件
        setTimeout(function () {
          let scrollTop = vm.$refs.home.scrollTop
          let target = vm.$refs.filters01
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
      toTopic(url) {
        if (vm.showFilterCon) return
        location.href = url
      },
      toDetail(id) {
        if (vm.showFilterCon) return
        vm.$router.push({name: 'goods_detail', query: {id: id}})
      },
      /* 页面数据 */
      getBanner(cb) {
        vm.loadData(homeApi.banner, null, 'POST', function (res) {
          console.log(res.data, '首页Banner')
          vm.banner = res.data.itemList
          cb ? cb() : null
        })
      },
      getNotice() {
        vm.loadData(homeApi.topNotice, null, 'POST', function (res) {
          console.log(res.data, '首页TopNews')
          vm.notice = res.data.itemList
        })
      },
      getGoods(isLoadMore) {
        if (vm.isPosting) return
        vm.isPosting = true
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.loadData(homeApi.goodsList, vm.params, 'POST', function (res) {
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
          console.log(vm.goods, '首页GoodsList')
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
        if (this.scrollTop <= 0 && vm.$refs.filters01.classList.contains('fixed')) {
          vm.$refs.filters01.classList.remove('fixed')
          vm.$refs.goodsList.classList.remove('fixed')
          vm.$refs.home.scrollTop = 250
          return false
        }
      },
      /* 上下拉刷新 */
      onPullDown() {
        if (vm.onFetching) {
          // do nothing
          return false
        } else {
          // this.onFetching = true
          setTimeout(function () {
            vm.getGoods()
            vm.$nextTick(function () {
              vm.$refs.myScroll.reset({top: 0})
              vm.$refs.myScroll.donePullup()
              vm.$refs.myScroll.donePulldown()
            })
          }, 1500)
        }
      },
      onPullUp() {
        if (vm.onFetching) {
          // do nothing
          return false
        } else {
          setTimeout(function () {
            vm.getGoods(true)
            vm.$nextTick(function () {
              vm.$refs.myScroll.reset({bottom: 0})
              vm.$refs.myScroll.donePullup()
              vm.$refs.myScroll.donePulldown()
            })
          }, 200)
        }
      },
      /* 购物车--start */
      // 同步购物车商品数量至列表
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
          vm.syncList()
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
      /* 购物车--end */
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';

  .home {
    height: 100%;
    overflow: scroll; // 此两个属性至关重要，不写@scroll监听不到滚动
  }

  .swiper-home {
    min-height: 320/@rem;
    margin-bottom: 10/@rem;
    .swiper-container {
      /*p {
        padding: 10/@rem 20/@rem;
        .b3;
        .cf;
      }*/
      .swiper-pagination {
        bottom: 5px;
      }
      .swiper-pagination-bullet-active {
        background: #eee;
      }
    }
  }

  .middle-entry {
    margin-bottom: 10/@rem;
    .bf;
    border-top: 1px solid #eee;
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
    .top-notice {
      padding-bottom: 10/@rem;
      .inner {
        .rel;
        width: 94%;
        height: 20px;
        .ma;
        padding: 20/@rem 0;
        .bor-t;
      }
      .ico-toutiao {
        .abs-center-vertical;
        left: 10/@rem;
        .size(54, 54);
        background: url(../../static/img/ico_toutiao.png) center;
        .ele-base;
      }
      .vux-marquee {
        .borBox;
        padding-left: 120/@rem;
        &:before {
          .abs;
          margin-left: -30/@rem;
          content: "";
          position: absolute;
          width: 1px;
          height: 20px;
          background: #eee;
        }
        li {
          .ellipsis;
        }
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
            background: url(../../static/img/f-tit.png) no-repeat center;
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
      .static;
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
        .img-con {
          .abs-center-vertical;
          .size(130, 130);
          overflow: hidden;
          img {
            width: 100%;
            background: #f5f5f5 url(../../static/img/noImg.png) no-repeat center;
            -webkit-background-size: 30% auto;
            background-size: 30% auto;
          }
        }
        /*img {
          .abs;
          left: 0;
          top: 0;
          .size(150, 150);
        }*/
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
                .fz(26);
              }
              &.hasSell {
                padding-left: 30/@rem;
                .c9;
                .fz(22);
              }
            }
          }
          .tags {
            .flex-r(1);
            .cdiy(#f34c18);
            .fz(22);
            overflow: hidden;
            li {
              .fl;
              margin-right: 10/@rem;
              padding: 1px 8px;
              line-height: 1.8;
              .cf;
              .fz(16);
              .borR(4px);
              background: orange;
            }
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

</style>
