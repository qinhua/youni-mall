<template>
  <div class="nearby" ref="nearby" v-cloak @scroll="scrollHandler">
    <!--定位组件-->
    <div class="location-chooser">
      <p><span><i class="fa fa-map-marker"></i>&nbsp;您的位置：</span>{{address||geoAddress}}</p>
      <a @click.prevent="toMap"><i class="right-arrow"></i></a>
    </div>
    <!--banner-->
    <div class="swiper-home">
      <swiper ref="slider02" skey="s02" :slides="banner" autoPlay="2500"></swiper>
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
    <div class="shops-list" ref="shopsList">
      <scroller class="inner-scroller" lock-x scrollbarY use-pullup use-pulldown :pullup-config="pullupConfig"
                :pulldown-config="pulldownConfig"
                @on-scroll="onScroll"
                @on-pulldown-loading="onPullDown" @on-pullup-loading="onPullUp" @on-scroll-bottom="" ref="myScroll"
                :scroll-bottom-offst="300">
        <div class="box">
          <section class="v-items" v-for="(item, index) in sellers" :data-id="item.id" @click="toDetail(item.id)">
            <section class="wrap">
              <img :src="item.logo">
              <section class="infos">
                <h3>{{item.name}}<span class="distance">{{item.distance | toFixed}}km</span></h3>
                <section class="middle">
                  <ol class="star">
                    <li v-for="star in item.score">★</li>
                  </ol>
                  <span class="hasSell"><i>{{item.score}}.0分</i>已售{{item.saleCount}}单</span>
                </section>
                <ul v-if="item.label">
                  <li v-for="(label,idx) in item.label.split(',')" :class="'c'+(idx+1)">{{label}}</li>
                </ul>
              </section>
              <div class="bottom">
                <label class="note" v-if="item.ticket"><i class="ico-hui"></i>{{item.ticket}}</label>
                <span class="dispatchTime">平均{{item.dispatchTime}}分钟送达</span>
              </div>
            </section>
            <section class="sleep-tips" v-if="item.isSleep">
              <div class="wrap">
                <h3>商家已打烊（{{item.runStartTime}}~{{item.runEndTime}}）<br><span>非营业时间仍可预定</span>
                  <button type="button" class="btn btn-reserve" @click="preBook(item.id)"><i class="fa fa-clock-o"
                                                                                             aria-hidden="true"></i>&nbsp;预定
                  </button>
                </h3>
              </div>
            </section>
          </section>
        </div>
        <!--<div class="iconNoData" @click="beContinue(curNumber)"><i></i><p>暂无内容</p></div>-->
      </scroller>
    </div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars,indent */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import Swiper from '../components/Swiper'
  import {Group, GroupTitle, Grid, GridItem, Marquee, MarqueeItem, XNumber, Scroller, LoadMore} from 'vux'
  import {homeApi, nearbyApi} from '../service/main.js'

  export default {
    name: 'nearby',
    data() {
      return {
        geoData:null,
        address:'',
        banner: [],
        notice: [],
        sellers: [],
        filters: {/*
          shop: [
            {
              key: '',
              value: '全部'
            },
            {
              key: 'seller_level.1',
              value: '普通店'
            },
            {
              key: 'seller_level.2',
              value: '官方认证'
            },
            {
              key: 'seller_level.3',
              value: '金牌店'
            }
          ],*/
          shop: [
            {
              key: 'seller_level.3',
              value: '全部'
            },
            {
              key: 'seller_level.1',
              value: '水'
            },
            {
              key: 'seller_level.2',
              value: '奶'
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
        params:{
          pageSize:10,
          sellerType:'',
          sortType:''
        },
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
      }
    },
    props:['geoAddress'],
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
      // me.attachClick()
      vm.getMap()
      vm.getBanner()
      vm.getNotice()
      vm.getSeller()
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
    computed: {},
    watch: {
      '$route'(to, from) {
        vm.getMap()
      }
    },
    methods: {
      // 全局定位
      getMap(data) {
        var tmp=me.locals.get('cur5656Position')
        // this.$store.commit('storeData',{key:'userPositionData',data:data})
        if(tmp){
          var data=JSON.parse(tmp)
          console.log(data, 'home amap info')
          if(data){
            vm.geoData = data
            vm.address = data.name
          }
        }
      },
      toMap() {
        vm.$router.push({name: 'amap', query: {path: vm.$route.path.replace(/\//g, '')}})
      },
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      scrollHandler() {
        // 监听dom的scroll事件
        setTimeout(function () {
          let scrollTop = vm.$refs.nearby.scrollTop
          let target = vm.$refs.filters02
          let list = vm.$refs.shopsList
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
        vm.$router.push({name: 'shops_detail', query: {id: id}})
      },
      preBook(id) {
        vm.$router.push({path: '/detail/' + id})
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
      getSeller(isLoadMore) {
        if (vm.onFetching) return false
        var params = {
          pagerSize: 10,
          pageNo: 1,
          goodsType: 'XXX',
          goodsCategory: '',
          brandId: '',
          filter: ''
        }
        vm.loadData(nearbyApi.sellerList, params, 'POST', function (res) {
          var resD= res.data.pager.itemList
          console.log(resD, '附近卖家')
          if (!isLoadMore) {
            vm.sellers = resD
            if (res.data.noMore) {
              vm.$nextTick(function () {
                vm.$refs.myScroll.disablePullup()
              })
            }
          } else {
            vm.sellers.push(resD)
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
        vm.getShops(lastF)
      },
      onPullDown() {
        if (vm.onFetching) {
          // do nothing
          return false
        } else {
          // this.onFetching = true
          setTimeout(function () {
            // vm.bottomCount += 10
            vm.getSeller()
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
            vm.getSeller(true)
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
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';

  .nearby {
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

  .shops-list {
    height: auto;
    .inner-scroller {
      .borBox;
      .static;
      .v-items {
        .rel;
        padding: 20/@rem;
        .bf;
        &:not(:last-child) {
          .bor-b;
        }
        .sleep-tips {
          .abs;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          .cf;
          .fz(30);
          .bdiy(rgba(0, 0, 0, .6));
          .wrap {
            .borBox;
            padding: 0 30/@rem;
            .abs-center-vertical;
            width: 100%;
          }
          h3 {
            .rel;
            width: 100%;
            .txt-normal;
            span {
              .fz(20)
            }
          }
          .btn-reserve {
            .abs-center-vertical;
            right: 0;
            .size(120, 60);
            line-height: 60/@rem;
            .fz(24);
            .cf;
            .borR(4px);
            .bdiy(rgba(45, 199, 108, 0.5))
          }
        }
        .wrap {
          .rel;
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
          .h(150);
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
                .c9;
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
            .c9;
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
          .c6;
          .block;
          .fz(20);
          &:before {
            .abs;
            .block;
            left: 0;
            top: 12/@rem;
            content: '';
            .size(26, 26);
            background: url(../../static/img/ico_hui.png) center;
            .ele-base;
          }
        }
        .dispatchTime {
          .fr;
          padding-top: 10/@rem;
          .c9;
          .block;
          .fz(20);
        }
      }
    }
  }
</style>
