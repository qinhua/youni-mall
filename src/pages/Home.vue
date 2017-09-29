<template>
  <div class="home" ref="home" @scroll="scrollHandler" v-cloak>

    <div class="scroll-view" ref="scrollView">
      <!--地图组件-->
      <div class="location-chooser" keep-alive>
        <p><span><i class="fa fa-map-marker"></i>&nbsp;您的位置：</span>{{address || geoAddress}}</p>
        <a @click.prevent="toMap"><i class="right-arrow"></i></a>
      </div>

      <!--banner-->
      <div class="swiper-home">
        <swiper ref="slider01" skey="s01" :slides="banner" autoPlay="2500" v-cloak></swiper>
      </div>

      <!--中间入口-->
      <div class="middle-entry">
        <grid :rows="4">
          <grid-item label="订水" data-type="1" link="/nearby/1">
            <img slot="icon" src="../../static/img/item_water.png">
          </grid-item>
          <grid-item label="订奶" data-type="2" link="/nearby/2">
            <img slot="icon" src="../../static/img/item_milk.png">
          </grid-item>
          <grid-item label="购物车" link="/cart">
            <img slot="icon" src="../../static/img/item_cart.png">
          </grid-item>
          <grid-item label="红包" link="/bind">
            <img slot="icon" src="../../static/img/item_redpacket.png">
          </grid-item>
        </grid>
        <div class="top-notice" v-if="notice.length" v-cloak>
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

      <!--商品列表-->
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
                    <span class="price">￥{{item.price | toFixed}}元</span>
                    <span class="hasSell">已售{{item.saleCount}}单</span>
                  </section>
                  <ul class="tags" v-if="item.label" v-cloak>
                    <li v-for="t in item.label.split(',')">{{t}}</li>
                  </ul>
                  <label></label>
                </section>
              </div>
              <group class="buy-count">
                <x-number :class="item.type==='goods_type.2'?'buy-count-milk':''" button-style="round"
                          :disabled="cartData && item.sellerId!==cartData.sellerId" :min="0"
                          :max="200" :value="item.number" align="right" :dataId="item.id"
                          :dataSellerId="item.sellerId" :linedata="item"
                          @on-change="changeCount"></x-number>
                <!--<span class="stock">库存：{{item.stock}}件</span>-->
                <!--<x-number button-style="round" :min="0"
                          :max="50" :value="item.number" align="right" :dataId="item.id"
                          :dataSellerId="item.sellerId" :linedata="item"
                          @on-change="changeCount"></x-number>-->
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
    <div class="float-cart" ref="floatCart" v-show="curCount"
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
  //  import $ from 'jquery'
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
    XInput,
    Popup,
    LoadMore,
    TransferDom
  } from 'vux'
  import {homeApi, goodsApi, cartApi} from '../service/main.js'
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: 'home',
    directives: {
      TransferDom
    },
    data() {
      return {
        geoData: null,
        address: '',
        cartData: '',
        banner: [],
        notice: [],
        goods: [],
        curLinedata: null,
        params: {
          status: 1,
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
        noMore: false,
        isPosting: false,
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
      XInput,
      Popup,
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
      vm.$nextTick(function () {
        // 点击区域之外隐藏筛选栏
        /*document.addEventListener('click', function (e) {
         if (e.target.offsetParent) {
         if (JSON.stringify(e.target.offsetParent.classList).indexOf('filter') === -1) {
         vm.hideFilter()
         return false
         }
         }
         }, false)*/
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
        let scrollTop = vm.$refs.home.scrollTop
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
        if (scrollTop >= (docH - winH) - 44) {
          // console.log('到底部了，需要加载了…')
          vm.onPullUp()
        }
      },
      resetScroll() {
        setTimeout(function () {
          let target = vm.$refs.filtersMenu
          target.classList.remove('fixed')
        }, 100)
      },
      toMap() {
        vm.$router.push({name: 'amap', query: {path: vm.$route.path.replace(/\//g, '')}})
      },
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      toTopic(url) {
        if (vm.showFilterCon) {
          vm.showFilterCon = false
          vm.curFilterType = ''
          return false
        }
        location.href = url
      },
      toDetail(id) {
        if (vm.showFilterCon) {
          vm.showFilterCon = false
          vm.curFilterType = ''
          return false
        }
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
//        vm.processing()
        !isLoadMore ? vm.params.pageNo = 1 : vm.params.pageNo++
        /* if (!isLoadMore) {
         vm.params.pageNo = 1
         } else {
         if (!vm.noMore) {
         vm.params.pageNo++
         } else {
         return false
         }
         }*/
        vm.loadData(goodsApi.list, vm.params, 'POST', function (res) {
          vm.isPosting = false
//          vm.processing(0, 1)
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
            // resD.itemList.length ? vm.goods.concat(resD.itemList) : vm.noMore = true
          }
          console.log(vm.goods, '首页GoodsList')
        }, function () {
          vm.isPosting = false
//          vm.processing(0, 1)
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
          if (res.success && res.data.itemList.length) {
            vm.curMilkAmount = 1
            vm.priceTags = res.data.itemList
            vm.curPriceTag = vm.priceTags[0]
            vm.curTotalPrice = me.floatMulti(vm.curMilkAmount, vm.curPriceTag.salePrice) + '元'
            vm.showPop = true
          } else {
            vm.toast(res.message || '此商品暂无法购买', 'warn')
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
      /* 上下拉刷新 */
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
      goConfirm() {
        // 判断当前是否填写了数量
        if (vm.curMilkAmount) {
          vm.loadData(cartApi.add, {
            goodsId: vm.curLinedata.id,
            goodsNum: vm.curMilkAmount
          }, 'POST', function (res) {
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
          vm.showPop = false
        } else {
          vm.toast('至少选1件哦！', 'warn')
        }
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

    .bar-chamer {
      min-height: 80/@rem;
    }

    .goods-filter {
      .rel;
      z-index: 10;
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
        .bdiy(#fdfdfd);
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
      padding-bottom: 30px;
      /*.box {}*/
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
          .size(140, 140);
          overflow: hidden;
          background: #f5f5f5 url(../../static/img/bg_nopic.jpg) no-repeat center;
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
