<template>
  <div class="nearby">
    <!--定位组件-->
    <div class="location-chooser">
      <p><span><i class="fa fa-map-marker"></i>&nbsp;您的位置：</span>{{location}}</p>
      <a @click.prevent="toMap"><i class="right-arrow"></i></a>
    </div>
    <!--banner-->
    <div class="swiper-container swiper-home" v-show="banner.length">
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
                          @click.native="toTopic(news.linkUrl)"
                          class="align-middle">{{news.content}}
            </marquee-item>
          </marquee>
        </div>
      </div>
    </div>
    <!--过滤条-->
    <div class="shops-filter" ref="filters">
      <div class="v-filter-tabs">
        <ul class="v-f-tabs">
          <li :class="factive==='shop'?'active':''" @click="showFilter('shop',$event)">店铺分类<i
            class="ico-arr-down"></i>
          </li>
          <li :class="factive==='sort'?'active':''" @click="showFilter('sort',$event)">排序<i
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
    <!--店铺列表-->
    <div class="shops-list">
      <scroller class="inner-scroller" lock-x use-pulldown :pulldown-config="pulldownConfig"
                @on-scroll="onScroll"
                @on-pulldown-loading="onPullDown" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom"
                :scroll-bottom-offst="300">
        <div class="box">
          <section class="v-items" v-for="(item, index) in shops" :data-id="item.id" @click.prevent="toDetail(item.id)">
            <section class="wrap">
              <img :src="item.imgurl">
              <section class="infos">
                <h3>{{item.name}}<span class="distance">{{item.distance}}km</span></h3>
                <section class="middle">
                  <ol class="star">
                    <li v-for="star in item.score">★</li>
                  </ol>
                  <span class="hasSell"><i>{{item.score}}.0分</i>已售{{item.saleCount}}单</span>
                </section>
                <ul>
                  <li v-for="(label,idx) in item.labels" :class="'c'+(idx+1)">{{label}}</li>
                </ul>
              </section>
              <div class="bottom">
                <label class="note" v-if="item.note"><i class="ico-hui"></i>{{item.note}}</label>
                <span class="dispatchTime">平均{{item.dispatchTime}}分钟送达</span>
              </div>
            </section>
            <section class="sleep-tips" v-if="item.sleep">
              <div class="wrap">
                <h3>商家已打烊（09:00~22:00）<br><span>非营业时间仍可预定</span>
                  <button type="button" class="btn btn-reserve"><i class="fa fa-clock-o" aria-hidden="true"></i>&nbsp;预定
                  </button>
                </h3>
              </div>
            </section>
          </section>
          <load-more tip="loading"></load-more>
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
  import Swiper from 'swiper'
  import {Group, GroupTitle, Grid, GridItem, Marquee, MarqueeItem, XNumber, Scroller, LoadMore} from 'vux'
  import { homeApi, nearbyApi } from '../store/main.js'
  export default {
    name: 'nearby',
    data () {
      return {
        location: '',
        banner: [],
        notice: [],
        shops: [],
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
        active: 0,
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
      vm.getPos()
      let mySwiper = function () {
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
          // onClick: function (swiper) {
          // var curIdx = swiper.activeIndex
          // },
          // onSlideChangeEnd: function () {
          // }
        })
      }
      vm.getBanner(mySwiper)
      vm.getNotice()
      vm.getShops()
      this.$nextTick(function () {
        vm.$refs.scrollerBottom.reset({top: 0})
      })
    },
    computed: {},
    watch: {
      '$route' (to, from) {
        vm.getPos()
      }
    },
    methods: {
      // 全局定位
      getPos () {
        var lp = me.locals.get('cur5656Position')
        if (lp) {
          vm.location = JSON.parse(lp).name
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
      },
      // 向父组件传值
      setPageStatus (data) {
        this.$emit('listenPage', data)
      },
      toMap () {
        vm.$router.push({path: '/map/' + vm.$route.path.replace(/\//g, '_')})
      },
      toTopic (url) {
        location.href = url
      },
      toDetail (id) {
        vm.$router.push({path: '/detail/' + id})
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
      getShops (isLoadMore) {
        if (vm.onFetching) return false
        var params = vm.filterData || {
            pagerSize: 10,
            pageNo: 1,
            goodsType: 'XXX',
            goodsCategory: '',
            brandId: '',
            filter: ''
          }
        vm.loadData(nearbyApi.shopsList, params, 'POST', function (res) {
          console.log(res.data, '首页shopsList')
          if (!isLoadMore) {
            vm.shops = res.data.itemList
          } else {
            vm.shops.push(res.data.itemList)
          }
          vm.onFetching = false
        }, function () {
          vm.onFetching = false
        })
      },
      /* 商品筛选 */
      showFilter (type, e) {
        vm.factive = type
        // console.log(vm.active)
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
      onPullDown () {
        if (vm.onFetching) {
          // do nothing
          return false
        } else {
          // this.onFetching = true
          setTimeout(function () {
            // vm.bottomCount += 10
            vm.getShops()
            vm.$nextTick(function () {
              vm.$refs.scrollerBottom.donePulldown()
              vm.onFetching = false
            })
          }, 2000)
        }
      },
      onScrollBottom () {
        if (vm.onFetching) {
          // do nothing
          return false
        } else {
          // vm.onFetching = true
          setTimeout(function () {
            // vm.bottomCount += 10
            vm.getShops(true)
            vm.$nextTick(function () {
              vm.$refs.scrollerBottom.reset()
              vm.onFetching = false
            })
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
      changeCount (index, val) {
        console.log(arguments)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';

  .nearby {
  }

  .location-chooser {
    .rel;
    .borBox;
    padding: 0 40/@rem 0 20/@rem;
    height: 80/@rem;
    line-height: 80/@rem;
    .bf5;
    p {
      .fz(24);
      .c6;
      .ellipsis;
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

  .shops-filter {
    .rel;
    z-index: 10;
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
