<template>
  <div class="shops-detail" ref="shopsDetail" @scroll="scrollHandler">
    <!--banner-->
    <!--<div class="swiper-shop">-->
    <!--<swiper ref="slider02" skey="s03" :slides="banner" autoPlay="2500"></swiper>-->
    <!--</div>-->
    <div class="shop-info">
      <div class="v-items">
        <div class="wrap">
          <img :src="shopInfo.imgurl">
          <div class="infos">
            <h3>{{shopInfo.name}}<span class="distance">{{shopInfo.distance}}km</span></h3>
            <div class="middle">
              <ol class="star">
                <li v-for="star in shopInfo.score">★</li>
              </ol>
              <span class="hasSell"><i>{{shopInfo.score}}.0分</i>已售{{shopInfo.saleCount}}单</span>
            </div>
            <ul>
              <li v-for="(label,idx) in shopInfo.labels" :class="'c'+(idx+1)">{{label}}</li>
            </ul>
          </div>
          <div class="bottom">
            <label class="note" v-if="shopInfo.note">{{shopInfo.note}}</label>
            <span class="dispatchTime">平均{{shopInfo.dispatchTime}}分钟送达</span>
          </div>
        </div>
      </div>
      <p class="contacts">配送电话：027-25252545，楼梯房需收取上楼费</p>
    </div>

    <!--过滤条-->
    <div class="shops-filter" ref="filters02">
      <div class="v-filter-tabs">
        <ul class="v-f-tabs">
          <li :class="factive==='shop'?'mfilterActive':''" @click="showFilter('shop',$event)">店铺分类<i
            class="ico-arr-down"></i>
          </li>
          <li :class="factive==='sort'?'mfilterActive':''" @click="showFilter('sort',$event)">排序<i
            class="ico-arr-down"></i>
          </li>
          <li :class="factive==='specials'?'mfilterActive':''" @click="showFilter('specials',$event)">筛选<i
            class="ico-arr-down"></i></li>
        </ul>
        <div class="filter-data" v-if="showFilterCon" :class="showFilterCon?'show':''">
          <ul class="filter-tags" v-show="currentFilter">
            <li v-for="(data,idx) in currentFilter" :class="subActive==idx?'sfilterActive':''" :data-key="data.key"
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
                <x-number button-style="round" :min="0" :max="50" align="right" @on-change="changeCount"
                          fillable></x-number>
              </group>
            </section>
          </section>
          <!--<load-more tip="loading"></load-more>-->
        </div>
        <!--<div class="iconNoData" @click="beContinue(curNumber)"><i></i><p>暂无内容</p></div>-->
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
    <div class="float-cart" ref="floatCart"
         v-show="curCount && ($route.name==='home'||$route.name==='shops_detail')" v-jump="['cart']">
      <div class="cart-wrap"><i class="cur-count" v-if="curCount">{{curCount}}</i></div>
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
  import {homeApi, nearbyApi} from '../../service/main.js'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'shops_detail',
    data() {
      return {
        location: '',
        banner: [],
        notice: [],
        shopInfo: [],
        goods: [],
        filters: {
          shop: [
            {
              key: 0,
              value: '全部'
            },
            {
              key: 1,
              value: '瓶装水'
            },
            {
              key: 2,
              value: '桶装水'
            },
            {
              key: 3,
              value: '认证卖家'
            },
            {
              key: 4,
              value: '金牌卖家'
            }
          ],
          sort: [
            {
              key: 0,
              value: '默认排序'
            },
            {
              key: 1,
              value: '离我最近'
            },
            {
              key: 2,
              value: '销量最高'
            },
            {
              key: 3,
              value: '好评最多'
            }
          ],
          specials: [
            {
              key: 0,
              value: '全部'
            },
            {
              key: 1,
              value: '水票'
            },
            {
              key: 2,
              value: '满减'
            },
            {
              key: 3,
              value: '折扣'
            }
          ]
        },
        curFilterType: '',
        currentFilter: null,
        filterData: [],
        showFilterCon: false,
        factive: '',
        subActive: 0,
        /* filter end */
        showList: true,
        scrollTop: 0,
        roundValue: 0,
        onFetching: false,
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
        count: 0,
        balls: [ //小球 设为3个
          {
            show: false
          }, {
            show: false
          }, {
            show: false
          },
        ],
        dropBalls: []
      }
    },
    components: {
      Swiper,
      Group,
      GroupTitle,
      Grid,
      GridItem,
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
      me.attachClick()
      // vm.getPos()
      // vm.getBanner()
      vm.getShop()
      vm.getGoods()
      // 点击区域之外隐藏筛选栏
      document.addEventListener('click', (e) => {
        if (e.target.offsetParent) {
          if (JSON.stringify(e.target.offsetParent.classList).indexOf('filter') === -1) {
            vm.hideFilter()
            return false
          }
        }
      }, false)
      vm.$nextTick(function () {
        setTimeout(() => {
          vm.filterOffset = vm.$refs.filters02.offsetTop
        }, 500) //获取筛选栏位置
        vm.$refs.myScroll.reset()
        vm.$refs.myScroll.donePullup()
        vm.$refs.myScroll.donePulldown()
      })
    },
    computed: mapState({
      curCount: state => state.cart.count
    }),
    watch: {
      '$route'(to, from) {
        vm.getPos()
      }
    },
    methods: {
      // 全局定位
      getPos() {
        var lp = me.locals.get('cur5656Position')
        setTimeout(function () {
          if (lp) {
            vm.location = JSON.parse(lp).name || JSON.parse(lp).formattedAddress
          } else {
            try {
              vm.location = '定位中…'
              var map, geolocation;
              // 加载地图，调用浏览器定位服务
              map = new AMap.Map('mapContainer', {
                resizeEnable: true
              });
              map.plugin('AMap.Geolocation', function () {
                geolocation = new AMap.Geolocation({
                  enableHighAccuracy: true,//是否使用高精度定位，默认:true
                  timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                  buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                  zoomToAccuracy: true,  //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                  buttonPosition: 'RB'
                });
                map.addControl(geolocation);
                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
                AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
              });

              // 解析定位结果
              function onComplete(data) {
                me.locals.set('cur5656Position', JSON.stringify(data))
                vm.location = data.formattedAddress
                var str = ['定位成功'];
                str.push('经度：' + data.position.getLng());
                str.push('纬度：' + data.position.getLat());
                if (data.accuracy) {
                  str.push('精度：' + data.accuracy + ' 米');
                }
                // 如为IP精确定位结果则没有精度信息
                str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
                // document.getElementById('tip').innerHTML = str.join('<br>');
              }

              // 解析定位错误信息
              function onError(data) {
                vm.location = '定位失败'
                // document.getElementById('tip').innerHTML = '定位失败';
              }
            } catch (e) {
              console.log(e)
            }
          }
        }, 200)
      },
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      scrollHandler() {
        // 监听dom的scroll事件
        setTimeout(function () {
          let scrollTop = vm.$refs.shopsDetail.scrollTop
          let target = vm.$refs.filters02
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
      getBanner(cb) {
        vm.loadData(homeApi.banner, null, 'POST', function (res) {
          console.log(res.data, '首页Banner')
          vm.banner = res.data.itemList
          cb ? cb() : null
        })
      },
      getShop() {
        vm.loadData(nearbyApi.shopsList, null, 'POST', function (res) {
          vm.shopInfo = res.data.itemList[0]
        })
      },
      toDetail(id) {
        if (vm.showFilterCon) return
        vm.$router.push({name: 'goods_detail', query: {id: id}})
      },
      getGoods(isLoadMore) {
        if (vm.onFetching) return false
        var params = vm.filterData || {
          pagerSize: 10,
          pageNo: 1,
          goodsType: 'XXX',
          goodsCategory: '',
          brandId: '',
          filter: ''
        }
        vm.loadData(homeApi.goodsList, params, 'POST', function (res) {
          console.log(res.data, '首页goodsList')
          if (!isLoadMore) {
            vm.goods = res.data.itemList
            if (res.data.noMore) {
              vm.$nextTick(function () {
                vm.$refs.myScroll.disablePullup()
              })
            }
          } else {
            vm.shops.push(res.data.itemList)
          }
          vm.onFetching = false
        }, function () {
          vm.onFetching = false
        })
      },
      /* 商品筛选 */
      showFilter(type, e) {
        vm.factive = type
        // console.log(vm.subActive)
        if (vm.showFilterCon) {
          if (vm.curFilterType === type) {
            vm.factive = ''
            vm.showFilterCon = false
          } else {
            vm.curFilterType = type
            vm.currentFilter = vm.filters[type]
            vm.showFilterCon = true
          }
        } else {
          vm.curFilterType = type
          vm.currentFilter = vm.filters[type]
          vm.showFilterCon = true
        }
        // 默认选中已选择的筛选条件
      },
      hideFilter() {
        if (vm.showFilterCon) {
          vm.showFilterCon = false
          vm.factive = ''
        }
      },
      chooseFilter(idx, key, value, e) {
        vm.shops = []
        console.log(JSON.stringify(vm.filterData), vm.curFilterType)
        if (JSON.stringify(vm.filterData).indexOf(vm.curFilterType) === -1) {
          vm.filterData.push({
            type: vm.curFilterType,
            filterId: key,
            filterName: value !== '全部' ? value : ''
          })
        } else {
          for (var i = 0; i < vm.filterData.length; i++) {
            console.log(vm.filterData[i].filterName, value)
            if (vm.filterData[i].filterName !== value) {
              vm.filterData[i] = {
                type: vm.curFilterType,
                filterId: key,
                filterName: value !== '全部' ? value : ''
              }
            }
          }
        }
        vm.factive = ''
        vm.showFilterCon = false
        console.log(vm.filterData, '最后的筛选数据')
        var lastF = {
          goodsType: 1,
          goodsCategory: 'water',
          brandId: 2,
          filter: '有折扣，有满减'
        }
        vm.getGoods(lastF)
      },
      onPullDown() {
        if (vm.onFetching) {
          // do nothing
          return false
        } else {
          // this.onFetching = true
          setTimeout(function () {
            // vm.bottomCount += 10
            vm.getShops()
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
          // vm.onFetching = true
          setTimeout(function () {
            // vm.bottomCount += 10
            vm.getShops(true)
            vm.$nextTick(function () {
              vm.$refs.myScroll.reset({bottom: 0})
              vm.$refs.myScroll.donePullup()
              vm.$refs.myScroll.donePulldown()
            })
          }, 200)
        }
      },
      onScroll(pos) {
        this.scrollTop = pos.top
        vm.factive = ''
        vm.showFilterCon ? vm.showFilterCon = false : null
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
        let cartCls = vm.$refs.floatCart.classList
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(-10px,-80px,0)'
        inner.style.transform = 'translate3d(-10px,-80px,0)'
        el.addEventListener('transitionend', done)
        cartCls.toggle('bulbing')
        setTimeout(() => {
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

  .shops-detail {
    height: 100%;
    overflow: scroll; // 此两个属性至关重要，不写@scroll监听不到滚动
  }

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
          .fz(30);
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
              .fz(22);
            }
          }
        }
        ul {
          .flex-r(1);
          li {
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
      .dispatchTime {
        .fr;
        padding-top: 10/@rem;
        .cc;
        .block;
        .fz(20);
      }
    }
    .contacts {
      padding: 5px 20/@rem;
      .fz(20);
      .cf;
      background: rgba(0, 0, 0, .5);
    }
  }

  .shops-filter {
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
            border-left: 1px solid #eee;
            border-right: 1px solid #eee;
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
      margin-top: 100/@rem;
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
            .fz(30);
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
</style>
