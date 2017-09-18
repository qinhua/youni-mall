<template>
  <div class="nearby" ref="nearby" v-cloak>

    <div class="top-con">
      <!--定位组件-->
      <div class="location-chooser">
        <p><span><i class="fa fa-map-marker"></i>&nbsp;您的位置：</span>{{address || geoAddress}}</p>
        <a @click.prevent="toMap"><i class="right-arrow"></i></a>
      </div>
      <!--过滤条-->
      <div class="sellers-filter" ref="filters02">
        <div class="v-filter-tabs">
          <ul class="v-f-tabs">
            <li :class="curFilterType==='types'?'mfilterActive':''" @click="showFilter('types',$event)">店铺分类<i
              class="ico-arr-down"></i>
            </li>
            <li :class="curFilterType==='services'?'mfilterActive':''" @click="showFilter('services',$event)">业务分类<i
              class="ico-arr-down"></i>
            </li>
            <li :class="curFilterType==='sorts'?'mfilterActive':''" @click="showFilter('sorts',$event)">排序<i
              class="ico-arr-down"></i></li>
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
    </div>

    <!--店铺列表-->
    <div class="sellers-list" ref="sellerList">
      <scroller class="inner-scroller" lock-x use-pullup use-pulldown :pullup-config="pullupConfig"
                :pulldown-config="pulldownConfig"
                @on-scroll="onScroll"
                @on-pulldown-loading="onPullDown" @on-pullup-loading="onPullUp" @on-scroll-bottom="" ref="sellerScroll"
                :scroll-bottom-offst="300">
        <div class="box">
          <section class="v-items" v-for="(item, index) in sellers" :data-id="item.id" @click="toDetail(item.id)">
            <section class="wrap">
              <img :src="item.headimgurl">
              <section class="infos">
                <h3>{{item.name}}
                  <span class="distance">{{(item.distance ? (item.distance / 1000) : 0) | toFixed(1, true)}}km</span>
                </h3>
                <section class="middle">
                  <ol class="star">
                    <li v-for="star in item.score" v-if="item.score">★</li>
                    <li class="gray" v-for="star in 5" v-else>★{{}}</li>
                  </ol>
                  <span class="hasSell"><i>{{item.score | toFixed(1)}}分</i>已售{{item.sellerCount}}单</span>
                </section>
                <div class="tags">
                  <!--<label class="c2">{{item.authLevelName}}</label>-->
                  <span class="dispatchTime">平均{{item.dispatchTime || 22}}分钟送达</span>
                </div>
              </section>
              <div class="bottom" v-if="item.ticket">
                <label class="note" v-if="item.ticket"><i class="ico-hui"></i>{{item.ticket}}</label>
                <!--<span class="dispatchTime">平均{{item.dispatchTime}}分钟送达</span>-->
                <span class="dispatchTime">{{item.label}}</span>
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
          <div class="noMoreData" v-if="sellers.length">{{noMore ? '就这么多了' : '上拉加载'}}</div>
        </div>
        <div class="iconNoData" v-if="!sellers.length"><i></i>
          <p>暂无商品</p></div>
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
        geoData: null,
        address: '',
        sellers: [],
        params: {
          pageSize: 10,
          pageNo: 1,
          sellerLevel: '',
          sellerType: '',
          sortType: ''
        },
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
          ],
          services: [
            {
              key: '',
              value: '全部'
            },
            {
              key: 'seller_service_type.1',
              value: '水'
            },
            {
              key: 'seller_service_type.2',
              value: '奶'
            },
            {
              key: 'seller_service_type.3',
              value: '水&奶'
            }
          ],
          sorts: [
            {
              key: '',
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
          services: {
            index: '',
            key: '',
            value: ''
          },
          sorts: {
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
      vm.getSellers()
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
          vm.filterOffset = vm.$refs.filters02.offsetTop
        }, 300)
        vm.resetScroll()
      })
    },
    computed: {},
    watch: {
      '$route'(to, from) {
        if (to.name === 'nearby') {
          vm.resetScroll()
          vm.getMap()
          vm.getSellers()
        }
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
        vm.getSellers() // 用户修改位置之后重载列表
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
          vm.$refs.sellerScroll.reset()
          vm.$refs.sellerScroll.donePullup()
          vm.$refs.sellerScroll.donePulldown()
          let target = vm.$refs.filters02
          let list = vm.$refs.sellerList
          target.classList.remove('fixed')
          list.classList.remove('fixed')
          vm.$refs.sellerScroll.reset()
        }, 100)
      },
      scrollHandler() {
        // 监听dom的scroll事件
        setTimeout(function () {
          let scrollTop = vm.$refs.nearby.scrollTop
          let target = vm.$refs.filters02
          let list = vm.$refs.sellerList
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
      toDetail(id) {
        if (vm.showFilterCon) return
        vm.$router.push({name: 'seller_detail', query: {id: id}})
      },
      preBook(id) {
        vm.$router.push({path: '/detail/' + id})
      },
      /* 页面数据 */
      getSellers(isLoadMore) {
        if (vm.isPosting) return false
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        vm.processing()
        vm.loadData(nearbyApi.sellerList, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          var resD = res.data.pager
          if (resD.itemList.length) {
            for (var i = 0; i < resD.itemList.length; i++) {
              var cur = resD.itemList[i]
              switch (cur.authLevel) {
                case 'seller_level.1':
                  cur.authLevelName = '普通店铺'
                  break
                case 'seller_level.2':
                  cur.authLevelName = '官方认证'
                  break
                case 'seller_level.3':
                  cur.authLevelName = '金牌店铺'
                  break
              }
              if (!cur.score) {
                cur.score = window.me.Rdn.rdnBetween(1, 6)
              }
            }
          }
          if (!isLoadMore) {
            if (resD.totalCount < vm.params.pageSize) {
              vm.noMore = true
            } else {
              vm.noMore = false
            }
            vm.sellers = resD.itemList
          } else {
            resD.itemList.length ? vm.sellers.concat(resD.itemList) : vm.noMore = true
          }
          console.log(vm.sellers, '附近卖家')
        }, function () {
          vm.isPosting = false
        })
      },
      /* 店铺筛选 */
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
        vm.curSelFilter.types.key ? vm.params.sellerLevel = vm.curSelFilter.types.key : delete vm.params.sellerLevel
        vm.curSelFilter.services.key ? vm.params.sellerType = vm.curSelFilter.services.key : delete vm.params.sellerType
        vm.curSelFilter.sorts.key ? vm.params.sortType = vm.curSelFilter.sorts.key : delete vm.params.sortType
        vm.hideFilter()
        vm.getSellers()
      },
      onScroll(pos) {
        // this.scrollTop = pos.top
        vm.hideFilter()
      },
      onPullDown() {
        if (vm.isPosting) {
          // do nothing
          return false
        } else {
          // this.isPosting = true
          setTimeout(function () {
            vm.getSellers()
            vm.$nextTick(function () {
              vm.$refs.sellerScroll.reset({top: 0})
              vm.$refs.sellerScroll.donePullup()
              vm.$refs.sellerScroll.donePulldown()
            })
          }, 1500)
        }
      },
      onPullUp() {
        if (vm.isPosting) {
          // do nothing
          return false
        } else {
          // vm.isPosting = true
          setTimeout(function () {
            vm.getSellers(true)
            vm.$nextTick(function () {
              vm.$refs.sellerScroll.reset({bottom: 0})
              vm.$refs.sellerScroll.donePullup()
              vm.$refs.sellerScroll.donePulldown()
            })
          }, 200)
        }
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

    .top-con {
      .fix;
      top: 0;
      z-index: 50;
      width: 100%;
      .bf5;
    }
    .location-chooser {
      margin-bottom: 10/@rem;
    }
    .sellers-filter {
      .rel;
      z-index: 10;
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

    .sellers-list {
      height: 100%;
      &.fixed {
        .xs-container {
          margin-top: 90/@rem;
        }
      }
      .inner-scroller {
        .borBox;
        padding: 172/@rem 0 50px;
        height: 100% !important;
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
              .fz(28);
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
                .c9;
                .block;
                .fz(20);
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
        }
      }
    }
  }

</style>
