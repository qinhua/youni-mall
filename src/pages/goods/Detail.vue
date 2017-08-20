<template>
  <div class="goods-detail">
    <div class="top">
      <div class="banner-goods-detail">
        <div class="swiper-container" v-show="imgs.length">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, index) in imgs" :key="index" :data-id="item.id">
              <a :href="item.linkUrl" target="blank">
                <img class="wd-img" :src="item.image" alt="">
              </a>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <div class="buy-con">
        <div class="wrap">
          <div class="txt-con">
            <h3>白塔山冰泉20L</h3>
            <p class="middle"><span>￥18.00</span><sub>已售206单</sub></p>
            <p>￥10（新用户专享，首单6折）</p>
          </div>
          <div class="right-con">
            <div class="inner">
              <div class="number-con" v-if="goodsNum">
                <group>
                  <x-number :value="goodsNum" :min="0" :max="50" @on-change="changeNum"></x-number>
                </group>
              </div>
              <button v-else type="button" class="btn btn-addcart" @click="addToCart">加入购物车</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <tab :line-width=2 active-color="#f34c18" v-model="curIndex">
        <tab-item class="vux-center" :selected="curIndex === index" v-for="(item, index) in tablist"
                  @click.native="chooseCol(index)" :key="index">{{item}}
        </tab-item>
      </tab>
      <div class="swiper-container swiper-goods-detail" v-show="imgs.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="detail-con">
              <img src="../../../static/img/detail/s01.jpg" class="wd-img" alt="">
            </div>
          </div>
          <div class="swiper-slide">
            <ul class="goods-param">
              <li>规格：4L*6</li>
              <li>产地：由于农夫山泉采取的是“水源地建厂，水源地灌装”、“水源地就近区域销售”的策略，各地购买到的农夫山泉水源地不尽相同，具体以瓶身标注为准 </li>
              <li>贮存方法：避免阳光直接照射及高温</li>
            </ul>
          </div>
          <div class="swiper-slide">
            <div class="appraise">
              <ul class="appraise-nav">
                <li :selected="appIdx === 0" @click="filterAppraise(0)">全部</li>
                <li class="good" :selected="appIdx === 1" @click="filterAppraise(1)">好评</li>
                <li class="middle" :selected="appIdx === 2" @click="filterAppraise(2)">中评</li>
                <li class="bad" :selected="appIdx === 3" @click="filterAppraise(3)">差评</li>
              </ul>
              <div class="appraise-content">
                <ol>
                  <li v-for="uu in appraise">
                    <div class="wrap">
                      <div class="buyer">
                        <img :src="uu.imgUrl" alt="">
                        <span>{{uu.name}}</span>
                      </div>
                      <div class="mtxt-con">
                        <div class="score-con" v-if="uu.score">
                          <ul class="u-stars">
                            <li v-for="idx in uu.score">★</li>
                          </ul>
                          <span>{{uu.score}}.0</span>
                        </div>
                        <div class="score-con grey" v-else>
                          <ul class="u-stars">
                            <li>★</li>
                            <li>★</li>
                            <li>★</li>
                            <li>★</li>
                            <li>★</li>
                          </ul>
                          <span>0.0</span>
                        </div>
                        <div class="txt-con">
                          <p>{{uu.content}}</p>
                        </div>
                        <span class="time">{{uu.createTime}}</span>
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--购物车-->
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
    <div class="cart-model">
      <div class="wrap">
        <div class="cur-cart" ref="curCart" :hasgood="goodsNum>0"><i v-if="goodsNum">{{goodsNum}}</i></div>
        <div class="left">
          <div class="txt" v-if="goodsNum">
            <h4>当前共{{goodsNum}}件</h4>
            <p>合计：{{total}}.00元</p>
          </div>
        </div>
        <div class="right">
          去结算
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  let me
  let vm
  import Swiper from 'swiper'
  import {Tab, TabItem, XNumber, Group} from 'vux'
  import {goodsApi} from '../../service/main.js'

  export default {
    name: 'goods-detail',
    data() {
      return {
        id: null,
        show: false,
        curOrderFilter: '',
        imgs: [],
        tablist: ['商品详情', '规格', '评论'],
        balls: [ //小球 设为3个
          {
            show: false
          }, {
            show: false
          }, {
            show: false
          },
        ],
        dropBalls: [],
        isPosting: false,
        onFetching: false,
        goodsNum: 0,
        unitPrice: 10,
        detailSwiper: null,
        curIndex: 0,
        appIdx: 0,
        appraiseData: null,
        appraise: []
      }
    },
    components: {Tab, TabItem, XNumber, Group},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.id = vm.$route.query.id
      // vm.goodsNum = this.$store.state.cart.count
      vm.getDetail(function () {
        vm.mySwiper()
        vm.swiperDetail()
        vm.getAppraise()
      })
//      vm.$nextTick(function() {
//        vm.$refs.orderScroller.finishInfinite(true)
//        vm.$refs.orderScroller.resize()
//      })
    },
    computed: {
      total() {
        return vm.goodsNum * vm.unitPrice
      }
    },
    watch: {
      '$route'(to, from) {
        vm.getDetail()
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      mySwiper() {
        return new Swiper('.banner-goods-detail .swiper-container', {
          initialSlide: 0,
          direction: 'horizontal',
          autoplay: 2000,
          preloadImages: true,
          autoplayDisableOnInteraction: false,
          observer: true,
          observeParents: true,
          // If we need pagination
          pagination: '.swiper-detail .swiper-pagination',
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
      },
      swiperDetail() {
        vm.detailSwiper = new Swiper('.swiper-container.swiper-goods-detail', {
          initialSlide: 0,
          direction: 'horizontal',
          preloadImages: true,
          autoplayDisableOnInteraction: false,
          observer: true,
          autoHeight: true,
          observeParents: true,
          grabCursor: true,
          // onClick: function (swiper) {
          // var curIdx = swiper.activeIndex
          // },
          onSlideChangeEnd: function (swiper) {
            vm.curIndex = swiper.activeIndex
          }
        })
      },
      addToCart(id) {
        vm.goodsNum++
      },
      refresh(done) {
        console.log('下拉加载')
        setTimeout(function () {
          vm.getOrders()
          vm.$refs.orderScroller.finishPullToRefresh()
        }, 1200)
      },
      infinite(done) {
        console.log('无限滚动')
        setTimeout(function () {
          vm.getOrders(true)
          vm.$refs.orderScroller.finishInfinite(true)
        }, 1000)
      },
      filterTicket(type, isMine) {
        vm.curTicketFilter = type
        vm.getOrders()
      },
      getDetail(cb) {
        vm.id = vm.$route.params.id
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(goodsApi.detail, {id: vm.id}, 'POST', function (res) {
          // var resD = res.data.itemList
          vm.imgs = res.data.itemList
          console.log(vm.imgs, '商品图片数据')
          cb ? cb() : null
          vm.onFetching = false
          vm.processing(0, 1)
        }, function () {
          vm.onFetching = false
          vm.processing(0, 1)
        })
      },
      chooseCol(index) {
        vm.detailSwiper.slideTo(index)
      },
      getAppraise(index) {
        vm.loadData(goodsApi.appraise, {type: index || 0}, 'POST', function (res) {
          vm.appraiseData = vm.appraise = res.data.itemList
          console.log(vm.appraiseData, '用户评价数据')
          cb ? cb() : null
        }, function () {
        })
      },
      filterAppraise(index) {
        vm.appIdx = index
        vm.appraise = []
        if (vm.appraiseData) {
          if (index === 0) {
            vm.appraise = vm.appraiseData
            return;
          }
          for (let i = 0; i < vm.appraiseData.length; i++) {
            if (vm.appraiseData[i].type === index) {
              vm.appraise.push(vm.appraiseData[i])
            }
          }
        } else {
          vm.getAppraise()
        }
      },
      changeNum(obj) {
        // this.goodsNum=this.$store.state.cart.count
        console.log(arguments)
        if (obj.type === 'add') {
          this.additem(obj.event)
          this.goodsNum++
        } else if (obj.type === 'sub') {
          this.goodsNum--
        } else {
          this.goodsNum = obj.value
        }
        vm.$store.commit('updateCart', this.goodsNum)
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
        // let cartCls = vm.$refs.curCart.classList
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0,-10px,0)'
        inner.style.transform = 'translate3d(0,-10px,0)'
        el.addEventListener('transitionend', done)
        /* cartCls.toggle('bulbing')
        setTimeout(() => {
          cartCls.remove('bulbing')
        }, 800) */
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

  .goods-detail {
    height: 100%;
    overflow: auto;
    .top {
      margin-bottom: 14/@rem;
      .swiper-detail {
        min-height: 320/@rem;
        margin-bottom: 10/@rem;
        .swiper-container {
          .swiper-pagination {
            bottom: 5px;
          }
          .swiper-pagination-bullet-active {
            background: #eee;
          }
        }
      }
      .buy-con {
        padding: 20/@rem;
        .bf;
        .bor-t;
        .wrap {
          .rel;
        }
      }
      .txt-con {
        .borBox;
        padding-right: 200/@rem;
        h3 {
          .fz(26);
          .c3;
          .ellipsis-clamp-2;
        }
        .middle {
          padding: 10/@rem 0;
          .fz(24);
          .fz(28);
          .c9;
          span{
            .txt-del;
          }
          sub {
            .fz(24);
            padding-left: 20/@rem;
          }
        }
        p {
          .fz(24);
          .cdiy(@c2);
        }
      }
      .right-con {
        .abs;
        top: 0;
        right: 0;
        width: 200/@rem;
        height: 100%;
        .inner {
          .rel;
          width: 100%;
          height: 100%;
          button {
            .abs-center-vh;
            padding: 18/@rem 14/@rem 18/@rem 50/@rem;
            line-height: 1;
            .fz(22);
            .cf;
            .borR(4px);
            .bdiy(@c3);
            &:before {
              position: absolute;
              margin-left: -30/@rem;
              content: '';
              display: block;
              font-size: inherit;
              .size(24, 24);
              background: url(../../../static/img/ico_cart.png) no-repeat center;
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
    .number-con {
      .weui-cells {
        .abs-center-vertical;
        right: 0;
        margin-top: 0;
        .no-bg;
        &:before, &:after {
          .none;
        }
        .weui-cell {
          padding: 0;
        }
        .vux-number-input {
          .borBox;
          padding: 0;
          width: 60/@rem !important;
          height: 60/@rem !important;
          .fz(24);
        }
        .vux-number-selector, .vux-number-selector-plus {
          .rel;
          .borBox;
          .size(60, 60);
          /*padding:0;*/
          font-size: 0;
          line-height: 34/@rem;
          svg {
            .abs-center-vh;
            .size(26, 26);
            /*fill: #f34c18;*/
          }
        }
      }
    }
    .bottom {
      .swiper-goods-detail {
        width: 100%;
        padding-bottom: 120/@rem;
        .swiper-slide {
          padding-bottom: 20px;
          .bf;
        }
        .goods-param {
          .borBox;
          padding: 20/@rem;
          overflow: hidden;
          li {
            .fl;
            padding: 4px 0;
            .fz(22);
          }
        }
        .appraise {
          .borBox;
          padding: 20/@rem 0;
          .appraise-nav {
            .borBox;
            width: 96%;
            .ma;
            overflow: hidden;
            padding: 20/@rem 0;
            .bor-b;
            > li {
              margin-right: 6px;
              padding: 4px 8px;
              line-height: 1;
              opacity: .5;
              .fl;
              .rfz(13);
              .cf;
              .bdiy(#ddd);
              .transi(.2s);
              &[selected='selected'] {
                padding: 4px 10px;
                opacity: 1;
                .cf;
                .bdiy(@c2);
              }
              &.good {
                .bdiy(@c2);
              }
              &.middle {
                .bdiy(orange);
              }
              &.bad {
                .bdiy(#999);
              }
            }
          }
          .appraise-content {
            width: 100%;
            .bf5;
            li {
              margin-top: 10/@rem;
              padding: 16/@rem;
              .bf;
            }
            .wrap {
              .rel;
            }
            .buyer {
              .abs;
              top: 0;
              left: 0;
              width: 120/@rem;
              .center;
              img {
                .block;
                .size(80, 80);
                .ma;
                .borR(50%);
              }
              span {
                padding: 5px 0;
                .rfz(12);
                .c6;
              }
            }
            .mtxt-con {
              .borBox;
              width: 100%;
              min-height: 130/@rem;
              padding-left: 140/@rem;
              .score-con {
                overflow: hidden;
                .cdiy(#f37f18);
                .u-stars {
                  .fl;
                  overflow: hidden;
                  li {
                    padding: 0;
                    margin-top: 0;
                    .fl;
                    .rfz(16);
                    .no-bor;
                  }
                }
                span {
                  .fl;
                  .rfz(14);
                  margin: 2px 0 0 10px;
                }
                &.grey {
                  .c9;
                }
              }
              p {
                clear: both;
                padding: 10/@rem 0;
                .fz(22);
                .c3;
              }
            }
            .time {
              .abs;
              top: 0;
              right: 0;
              .c9;
              .rfz(10);
            }

          }
        }
      }
    }
  }

  .cart-model {
    .fix;
    bottom: 0;
    z-index: 20;
    width: 100%;
    .ma-w(640);
    .cf;
    background: #1d2231;
    .wrap {
      height: 100/@rem;
      .cur-cart {
        .borBox;
        .abs;
        left: 20/@rem;
        top: 0;
        .size(100, 100);
        .bor(4px, solid, #373c4c);
        background: #1d2231 url(../../../static/img/carts.png) no-repeat center;
        .rbg-size(50%);
        .borR(50%);
        .transi(.2s);
        i {
          .abs;
          top: -6/@rem;
          right: -8/@rem;
          .block;
          .center;
          line-height: 20/@rem;
          .txt-normal;
          min-width: 20/@rem;
          padding: 4px;
          .fz(20);
          .cf;
          .bdiy(#f74c31);
          .borR(30px);
        }
        &[hasgood] {
          top: -40/@rem;
          box-shadow: 0 1px 10px 0 #fc6b01;
        }
      }
      .left {
        .rel;
        .borBox;
        .fl;
        padding: 0 10/@rem 0 160/@rem;
        width: 68%;
        height: 100%;
        .txt {
          .abs-center-vertical;
          .txt-normal;
          p {
            .fz(20);
          }
        }
      }
      .right {
        .fl;
        width: 32%;
        height: 100%;
        line-height: 100/@rem;
        .center;
        background: -webkit-linear-gradient(90deg, #dc0404, #ff7600);
        background: linear-gradient(90deg, #dc0404, #ff7600);
      }
    }
  }
</style>
