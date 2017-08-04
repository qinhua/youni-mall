<template>
  <div class="home">
    <!--定位组件-->
    <div class="location-chooser">
      <p><span><i class="fa fa-map-marker"></i>&nbsp;您的位置</span>：武汉市洪山区光谷软件园B7栋</p>
      <i class="right-arrow"></i>
    </div>
    <!--banner-->
    <swiper auto class="swiper-home" v-if="banner.length">
      <swiper-item class="black" v-for="(item, index) in banner" :key="index" :data-id="item.id">
        <a :href="item.linkUrl">
          <img class="wd-img" :src="item.image">
          <p>{{item.carName}}</p>
        </a>
      </swiper-item>
    </swiper>
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
    <div class="goods-filter">
      <div class="v-filter-tabs">
        <ul class="v-f-tabs">
          <li @click="showFilter('goods',$event)">商品类目<i class="ico-arr-down"></i></li>
          <li @click="showFilter('brands',$event)">品牌<i class="ico-arr-down"></i></li>
          <li @click="showFilter('specials',$event)">筛选<i class="ico-arr-down"></i></li>
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
      <scroller lock-x height="200px" use-pulldown use-pullup @on-pulldown-loading="onPullDown"
                @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200" reset="2000">

        <!--<panel :list="list"></panel>-->
        <p v-for="i in bottomCount">placeholder {{i}}</p>
        <div class="v-items">
          <!--<img src="../static/">-->
          <div class="infos"></div>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars,indent */
  var me
  var vm
  import {Swiper, GroupTitle, SwiperItem, Grid, GridItem, Marquee, MarqueeItem, Panel, LoadMore, Scroller} from 'vux'
  import { homeApi } from '../store/home.js'
  export default {
    name: 'home',
    data () {
      return {
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
        active: 0,
        showList: true,
        scrollTop: 0,
        onFetching: false,
        bottomCount: 20
      }
    },
    components: {Swiper, GroupTitle, SwiperItem, Grid, GridItem, Marquee, MarqueeItem, Panel, LoadMore, Scroller},
    beforeMount () {
      me = window.me
    },
    mounted () {
      vm = this
      // me.attachClick()
      console.log(vm.$refs)
      vm.getBanner()
      vm.getNotice()
      vm.getGoods()
      vm.$nextTick(function () {
        vm.$refs.scrollerBottom.reset({top: 0})
      })
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
      getBanner () {
        vm.loadData(homeApi.banner, null, 'POST', function (res) {
          console.log(res.data, '首页Banner')
          vm.banner = res.data.itemList
        })
      },
      getNotice () {
        vm.loadData(homeApi.topNotice, null, 'POST', function (res) {
          console.log(res.data, '首页TopNews')
          vm.notice = res.data.itemList
        })
      },
      getGoods (params) {
        params = params || {
            pagerSize: 10,
            pageNo: 1,
            goodsType: 'XXX',
            goodsCategory: 'XXX',
            brandId: 2,
            filter: ''
          }
        vm.loadData(homeApi.goodsList, params, 'POST', function (res) {
          console.log(res.data, '首页GoodsList')
          vm.goods = res.data.itemList
          vm.onFetching = false
        }, function () {
          vm.onFetching = false
        })
      },
      /* 商品筛选 */
      showFilter (type) {
        if (vm.showFilterCon) {
          if (vm.curFilterType === type) {
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
        // vm.getGoods(vm.filterData)
        console.log(vm.filterData, '最后的筛选数据')
      },
      onPullUp () {
        if (this.onFetching) {
          console.log('底部还处于加载状态')
        } else {
          console.log('底部开始加载')
          vm.onFetching = true
          vm.getGoods(vm.filterData)
          setTimeout(function () {
            vm.bottomCount += 10
            vm.$nextTick = function () {
              vm.$refs.scrollerBottom.reset()
            }
          }, 2000)
        }
      },
      onPullDown () {
        if (this.onFetching) {
          console.log('顶部还处于加载状态')
        } else {
          console.log('顶部开始加载')
          vm.onFetching = true
          vm.getGoods(vm.filterData)
          setTimeout(function () {
            vm.bottomCount += 10
            vm.$nextTick = function () {
              vm.$refs.scrollerBottom.reset()
            }
          }, 2000)
        }
      },
      onScrollBottom () {
        if (this.onFetching) {
          console.log('底部还处于加载状态')
          // do nothing
        } else {
          console.log('底部开始加载')
          vm.onFetching = true
          vm.getGoods(vm.filterData)
          setTimeout(function () {
            vm.bottomCount += 10
            vm.scrollTop = 0
            vm.$nextTick(function () {
              vm.$refs.scrollerBottom.reset()
            })
            vm.onFetching = false
          }, 2000)
        }
      },
      onScroll (pos) {
        vm.scrollTop = pos.top
      },
      changeList () {
        this.showList = false
        this.$nextTick = function () {
          this.$refs.scroller.reset({
            top: 0
          })
        }
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
    height: 40px;
    line-height: 40px;
    .bf5;
    p {
      font-size: 14px;
      .c6;
      span {
        .cdiy(#f34c18);
      }
    }
  }

  .swiper-home {
    margin-bottom: 10/@rem;
    .vux-swiper {
      height: 190px !important;
    }
    p {
      padding: 10/@rem 20/@rem;
      .b3;
      .cf;
    }
  }

  .middle-entry {
    margin-bottom: 10/@rem;
    .bf;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    .weui-grid__icon {
      display: block;
      width: 40px !important;
      height: 40px !important;
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
        left: 5px;
        .rsize(28, 28);
        background: url(../../static/img/ico_toutiao.png) center;
        .ele-base;
      }
      .vux-marquee {
        .borBox;
        padding-left: 56px;
        &:before {
          .abs;
          margin-left: -14px;
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
    margin-bottom: 10/@rem;
    .v-filter-tabs {
      .rel;
      width: 100%;
      padding: 5px 0;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      .bf;
      .v-f-tabs {
        height: 38px;
        li {
          .pointer;
          .rel;
          .borBox;
          .fl;
          width: 33.3333%;
          height: 38px;
          line-height: 38px;
          .c3;
          .center;
          font-size: 14px;
          .ico-arr-down {
            position: absolute;
            width: 30px;
            height: 30px;
            top: 6px;
            .transi(.2s);
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
        opacity: 0;
        height: 0;
        width: 100%;
        .bf;
        border-top: 1px solid #eee;
        .bsd(0, 10px, 18px, 0, #999);
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
</style>
