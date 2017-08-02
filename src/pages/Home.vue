<template>
  <div class="home">
    <!--定位组件-->
    <div class="location-chooser">
      <p><span>您的位置</span>：武汉市洪山区光谷软件园B7栋</p>
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
          <li>商品类目<i class="ico-arr-down"></i></li>
          <li>品牌<i class="ico-arr-down"></i></li>
          <li>筛选<i class="ico-arr-down"></i></li>
        </ul>
        <div class="filter-data" v-if="showFilter">
          <ul class="filter-tags">
            <li class="active">全部</li>
            <li>瓶装水</li>
            <li>桶装水</li>
            <li>牛奶</li>
            <li>其它</li>
          </ul>
        </div>
      </div>
    </div>
    <!--商品列表-->
    <div class="goods-list"></div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars,indent */
  var me
  var vm
  import {Swiper, GroupTitle, SwiperItem, Grid, GridItem, Marquee, MarqueeItem} from 'vux'
  import { homeApi } from '../store/home.js'
  export default {
    name: 'home',
    data () {
      return {
        banner: [],
        notice: [],
        goods: [],
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
          ]
        },
        showFilter: 1
      }
    },
    components: {Swiper, GroupTitle, SwiperItem, Grid, GridItem, Marquee, MarqueeItem},
    beforeMount () {
      me = window.me
    },
    mounted () {
      vm = this
      // me.attachClick()
      // console.log(data)
      vm.getBanner()
      vm.getNotice()
      vm.getGoods()
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
        })
      }
    },
    /* 商品筛选 */
    showFilter (type) {
      switch (type) {
        case 'goods':
          vm.curFilter = vm.filterData[type]
          vm.showFilter = 1
          break
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
        .cdiy(#e4582d);
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
        left: 20/@rem;
        .rsize(28, 28);
        background: url(../../static/img/ico_toutiao.png) center;
        .ele-base;
      }
      .vux-marquee {
        .borBox;
        padding-left: 64px;
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
        .transi(.2s);
        &.show {
          opacity: 1;
          height: auto;
          padding: 18/@rem;
        }
        .filter-tags {
          overflow: hidden;
          li {
            .pointer;
            .fl;
            padding: 3px 10px;
            margin: 6/@rem 10/@rem;
            line-height: 1;
            font-size: 10px;
            .c6;
            .bf5;
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
