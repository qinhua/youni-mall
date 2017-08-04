<template>
  <div class="home">
    <!--定位组件-->
    <div class="location-chooser">
      <p><span><i class="fa fa-map-marker"></i>&nbsp;您的位置</span>：武汉市洪山区光谷软件园B7栋</p>
      <i class="right-arrow"></i>
    </div>
    <!--banner-->
    <div class="swiper-container swiper-home" v-if="banner.length">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in banner" :key="index" :data-id="item.id">
          <a :href="item.linkUrl" target="blank">
            <img class="wd-img" :src="item.image" alt="">
          </a>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
    <!--中间入口-->
    <div class="middle-entry">
      <grid :rows="4">
        <grid-item label="订水" link="/nearby" @on-item-click="setPageStatus(1)">
          <img slot="icon" src="../../static/img/item_water.png">
        </grid-item>
        <grid-item label="订奶" @on-item-click="setPageStatus(2)">
          <img slot="icon" src="../../static/img/item_milk.png">
        </grid-item>
        <grid-item label="购物车">
          <img slot="icon" src="../../static/img/item_cart.png">
        </grid-item>
        <grid-item label="红包">
          <img slot="icon" src="../../static/img/item_redpacket.png">
        </grid-item>
      </grid>
      <div class="top-notice" v-if="notice.length">
        <div class="inner">
          <div class="ico ico-toutiao"></div>
          <marquee>
            <marquee-item v-for="(news, i) in notice" :key="i" :data-id="news.noticeId"
                          @click.native="toTopic(news.linkUrl)"
                          class="align-middle">{{news.content}}
            </marquee-item>
          </marquee>
        </div>
      </div>
    </div>
    <!--过滤条-->
    <div class="goods-filter" ref="filters">
      <div class="v-filter-tabs">
        <ul class="v-f-tabs">
          <li :class="factive==='goods'?'active':''" @click="showFilter('goods',$event)">商品类目<i
            class="ico-arr-down"></i>
          </li>
          <li :class="factive==='brands'?'active':''" @click="showFilter('brands',$event)">品牌<i
            class="ico-arr-down"></i>
          </li>
          <li :class="factive==='specials'?'active':''" @click="showFilter('specials',$event)">筛选<i
            class="ico-arr-down"></i></li>
        </ul>
        <div class="filter-data" v-if="showFilterCon" :class="showFilterCon?'show':''">
          <ul class="filter-tags" v-show="currentFilter">
            <li v-for="(data,idx) in currentFilter" :class="{active:active==idx}" :data-key="data.key"
                :data-value="data.value" @click="chooseFilter(idx,data.key,data.value,$event)">{{data.value}}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--商品列表-->
    <div class="goods-list">
      <scroller class="inner-scroller" lock-x height="500px" use-pulldown :pulldown-config="pulldownConfig"
                @on-scroll="onScroll"
                @on-pulldown-loading="onPullDown" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom"
                :scroll-bottom-offst="300">
        <div class="box">
          <!--<p v-for="i in bottomCount">placeholder {{i}}</p>-->
          <!--<load-more tip="loading"></load-more>-->
          <section class="v-items" v-for="(item, index) in goods" :data-id="item.id">
            <section class="wrap">
              <img :src="item.imgurl">
              <section class="infos">
                <h3>{{item.name}}</h3>
                <section class="middle">
                  <span class="price">￥{{item.price}}</span>
                  <span class="hasSell">已售{{item.saleCount}}单</span>
                </section>
                <label>{{item.label}}</label>
              </section>
              <group class="buy-count">
                <!--<x-number v-model="roundValue" button-style="round" :min="0" :max="5"-->
                <x-number button-style="round" :min="0" :max="5"
                          @on-change="change(index)"></x-number>
              </group>
            </section>
          </section>
          <load-more tip="loading"></load-more>
        </div>
        <!--<div class="iconNoData" @click="beContinue(curNumber)"><i></i><p>暂无内容</p></div>-->
      </scroller>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars,indent */
  var me
  var vm
  import Swiper from 'swiper'
  import {Group, GroupTitle, Grid, GridItem, Marquee, MarqueeItem, XNumber, Scroller, LoadMore} from 'vux'
  import { homeApi } from '../store/home.js'
  export default {
    name: 'home',
    data () {
      return {
        location: '',
        banner: [],
        notice: [],
        goods: [],
        list: [{
          src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
          title: '标题一',
          desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
          url: '/component/cell'
        }, {
          src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
          title: '标题二',
          desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
          url: {
            path: '/component/radio',
            replace: false
          },
          meta: {
            source: '来源信息',
            date: '时间',
            other: '其他信息'
          }
        }],
        filters: {
          goods: [
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
              value: '牛奶'
            },
            {
              key: -1,
              value: '其它'
            }
          ],
          brands: [
            {
              key: 0,
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
          ],
          specials: [
            {
              key: 0,
              value: '全部'
            },
            {
              key: 1,
              value: '有优惠'
            },
            {
              key: 2,
              value: '有红包'
            },
            {
              key: 3,
              value: '买二送一'
            }
          ]
        },
        curFilterType: '',
        currentFilter: null,
        filterData: [],
        showFilterCon: false,
        factive: '',
        active: 0,
        showList: true,
        scrollTop: 0,
        roundValue: 0,
        onFetching: false,
        pulldownConfig: {
          content: '下拉刷新',
          height: 60,
          autoRefresh: false,
          downContent: '下拉刷新',
          upContent: '松开以加载',
          loadingContent: '加载中…',
          clsPrefix: 'xs-plugin-pulldown-'
        },
        bottomCount: 20
      }
    },
    components: {
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
    beforeMount () {
      me = window.me
    },
    mounted () {
      vm = this
      // me.attachClick()
//      this.top = 1
//      this.bottom = 20
      var mySwiper = function () {
        return new Swiper('.swiper-container.swiper-home', {
          initialSlide: 0,
          direction: 'horizontal',
          autoplay: 2000,
          preloadImages: true,
          autoplayDisableOnInteraction: false,
          observer: true,
          observeParents: true,
          // If we need pagination
          pagination: '.swiper-pagination',
          paginationClickable: true,
          // Navigation arrows
          // nextButton: '.swiper-button-next',
          // prevButton: '.swiper-button-prev',
          grabCursor: true,
          onClick: function (swiper) {
            var curIdx = swiper.activeIndex
          },
          onSlideChangeEnd: function () {
          }
        })
      }
      vm.getBanner(mySwiper)
      vm.getNotice()
      vm.getGoods()
//      this.$nextTick(function () {
//        vm.$refs.scrollerBottom.reset({top: 0})
//      })
    },
    computed: {},
    methods: {
      // 向父组件传值
      setPageStatus (data) {
        this.$emit('listenPage', data)
      },
      toTopic (url) {
        location.href = url
      },
      /* 页面数据 */
      getBanner (cb) {
        vm.loadData(homeApi.banner, null, 'POST', function (res) {
          console.log(res.data, '首页Banner')
          vm.banner = res.data.itemList
          cb ? cb() : null
        })
      },
      getNotice () {
        vm.loadData(homeApi.topNotice, null, 'POST', function (res) {
          console.log(res.data, '首页TopNews')
          vm.notice = res.data.itemList
        })
      },
      getGoods (isLoadMore) {
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
          console.log(res.data, '首页GoodsList')
          if (!isLoadMore) {
            vm.goods = res.data.itemList
          } else {
            vm.goods.push(res.data.itemList)
          }
          vm.onFetching = false
        }, function () {
          vm.onFetching = false
        })
      },
      /* 商品筛选 */
      showFilter (type, e) {
        vm.factive = type
        console.log(vm.active)
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
      chooseFilter (idx, key, value, e) {
        console.log(arguments)
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
      onPullDown () {
        if (vm.onFetching) {
          // do nothing
          return false
        } else {
          this.onFetching = true
          setTimeout(function () {
//            vm.bottomCount += 10
            vm.getGoods()
            console.log(vm.$refs.scrollerBottom)
            vm.$nextTick(function () {
              vm.$refs.scrollerBottom.donePulldown()
            })
            vm.onFetching = false
          }, 2000)
        }
      },
      onScrollBottom () {
        if (vm.onFetching) {
          // do nothing
          return false
        } else {
          vm.onFetching = true
          setTimeout(function () {
//            vm.bottomCount += 10
            vm.getGoods(true)
            vm.$nextTick(function () {
              vm.$refs.scrollerBottom.reset()
            })
            vm.onFetching = false
          }, 2000)
        }
      },
      onScroll (pos) {
        this.scrollTop = pos.top
        vm.factive = ''
        vm.showFilterCon ? vm.showFilterCon = false : null
      },
      changeList () {
        this.showList = false
        this.$nextTick(function () {
          vm.$refs.scrollerEvent.reset({top: 0})
        })
      },
      change (index, val) {
        console.log(arguments)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';

  .home {
  }

  .location-chooser {
    .rel;
    .borBox;
    padding: 0 20/@rem;
    height: 80/@rem;
    line-height: 80/@rem;
    .bf5;
    p {
      .fz(24);
      .c6;
      span {
        .cdiy(#f34c18);
      }
    }
  }

  .swiper-home {
    margin-bottom: 10/@rem;
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
    margin-bottom: 10/@rem;
    &.fix {
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
          &.active {
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
            &.active {
              .cf;
              .bdiy(#f1582a);
            }
          }
        }
      }
    }
  }

  .goods-list {
    height: auto;
    .inner-scroller {
      .static;
      .v-items {
        padding: 20/@rem;
        .bf;
        &:not(:last-child) {
          .bor-b;
        }
        .wrap {
          .rel;
          .h(150);
        }
        img {
          .abs;
          left: 0;
          top: 0;
          .size(150, 150);
          background: #f5f5f5 url(../../static/img/noImg.png) no-repeat center;
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
        .abs-center-vertical;
        right: 0;
        .weui-cells {
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
            .size(34, 34);
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
