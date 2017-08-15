<template>
  <div class="goods-detail">
    <div class="top">
      <div class="swiper-detail">
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
              <button type="button" class="btn btn-addcart" @click="addToCart">加入购物车</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <tab :line-width=2 active-color='#f34c18' v-model="curIndex">
        <tab-item class="vux-center" :selected="demo === item" v-for="(item, index) in list" @click="demo = item" :key="index">{{item}}</tab-item>
      </tab>
      <swiper v-model="curIndex" height="100px" :show-dots="false">
        <swiper-item v-for="(item, index) in list" :key="index">
          <div class="tab-swiper vux-center">{{item}} Container</div>
        </swiper-item>
      </swiper>
    </div>
  </div>
</template>
<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import {Tab, TabItem, Swiper, SwiperItem} from 'vux'
  import {goodsApi} from '../../store/main.js'
  export default {
    name: 'goods-detail',
    data () {
      return {
        show: false,
        curOrderFilter: '',
        imgs: [],
        list: ['商品详情', '规格', '评论'],
        params: {
          type: 0,
          pagerSize: 10,
          pageNo: 1,
          goodsType: 'XXX',
          goodsCategory: '',
          brandId: '',
          filter: '',
        },
        isPosting: false,
        onFetching: false,
        curIndex: 0,
        demo: 0,
        getBarWidth: function (index) {
          return (index + 1) * 22 + 'px'
        }
      }
    },
    components: {Tab, TabItem, Swiper, SwiperItem},
    beforeMount() {
      me = window.me
    },
    mounted () {
      vm = this
      vm.id = vm.$route.query.id
      vm.getDetail(vm.mySwiper)
//      vm.$nextTick(function() {
//        vm.$refs.orderScroller.finishInfinite(true)
//        vm.$refs.orderScroller.resize()
//      })
    },
    computed: {},
    watch: {
      '$route' (to, from) {
        vm.getDetail()
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus (data) {
        this.$emit('listenPage', data)
      },
      mySwiper () {
        return new Swiper('.swiper-detail .swiper-container', {
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
      },
      toAppraise (id) {
        this.$router.push({path: '/appraise' + (param ? '/' + param : '')})
      },
      addToCart (id) {
        this.$router.push({path: '/appraise' + (param ? '/' + param : '')})
      },
      refresh (done) {
        console.log('下拉加载')
        setTimeout(function () {
          vm.getOrders()
          vm.$refs.orderScroller.finishPullToRefresh()
        }, 1200)
      },
      infinite (done) {
        console.log('无限滚动')
        setTimeout(function () {
          vm.getOrders(true)
          vm.$refs.orderScroller.finishInfinite(true)
        }, 1000)
      },
      onItemClick2 (type) {
        if (type === 'undefined') {
          vm.params.type = ''
        } else {
          vm.params.type = type
        }
        vm.getOrders()
      },
      filterTicket (type, isMine) {
        vm.curTicketFilter = type
        vm.getOrders()
      },
      getDetail (cb) {
        vm.params.type = vm.$route.params.id
        if (vm.onFetching) return false
        vm.processing()
        vm.onFetching = true
        vm.loadData(goodsApi.detail, vm.params, 'POST', function (res) {
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
      delOrder (id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '订单删除后不可恢复！', function () {
          vm.isPosting = true
          vm.loadData(orderApi.delOrder + '?id=' + id, vm.params, 'POST', function (res) {
            vm.isPosting = false
          }, function () {
            vm.isPosting = false
          })
        }, function () {
        })
      },
      onItemClick (index) {
        console.log('on item click:', index)
      },
      addTab () {
        if (this.list.length < 5) {
          this.list = list().slice(0, this.list.length + 1)
        }
      },
      removeTab () {
        if (this.list.length > 1) {
          this.list = list().slice(0, this.list.length - 1)
        }
      },
      next () {
        if (this.curIndex === this.list.length - 1) {
          this.curIndex = 0
        } else {
          ++this.curIndex
        }
      },
      prev () {
        if (this.curIndex === 0) {
          this.curIndex = this.list.length - 1
        } else {
          --this.curIndex
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../../static/css/tools.less';

  .goods-detail {
    .top{
      margin-bottom: 14/@rem;
      .swiper-detail {
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
      .buy-con{
        padding:20/@rem;
        .bf;
        .wrap{
          .rel;
        }
      }
      .txt-con{
        .borBox;
        padding-right:200/@rem;
        h3{
          .fz(26);
          .c3;
          .ellipsis-clamp-2;
        }
        .middle{
          padding:10/@rem 0;
          .fz(24);
          .txt-del;
          .fz(28);
          .c9;
          sub{
            .fz(24);
            padding-left: 20/@rem;
          }
        }
        p{
          .fz(24);
          .cdiy(@c2);
        }
      }
      .right-con{
        .abs;
        top: 0;
        right: 0;
        width: 200/@rem;
        height: 100%;
        .inner {
          width: 100%;
          height: 100%;
          .rel;
          button{
            .abs-center-vh;
            padding:18/@rem 14/@rem 18/@rem 50/@rem;
            line-height: 1;
            .fz(22);
            .cf;
            .borR(4px);
            .bdiy(@c2);
            &:before{
              position: absolute;
              margin-left: -30/@rem;
              content:'';
              display: block;
              font-size: inherit;
              .size(24,24);
              background: url(../../../static/img/ico_cart.png) no-repeat center;
              -webkit-background-size: 100% 100%;
              background-size: 100% 100%;
            }
          }
        }
      }
    }
    .bottom{

    }
  }

  .order-tab {
    z-index: 10;
    .vux-tab-item {
      .rel;
      .vux-tab-item-badge {
        top: -20px;
        right: 0;
      }
    }
  }

  .order-list {
    .inner-scroller {
      .borBox;
      padding: 44px 0 50px;
      .v-items {
        .borBox;
        margin-bottom: 20/@rem;
        /*padding: 0 20/@rem 20/@rem;*/
        .bf;
        .bsd(0, 2px, 10px, 0, #ccc);
        .item-top {
          padding: 14/@rem 20/@rem;
          .txt-normal;
          .c3;
          .fz(24);
          .bor-b;
          .ico-store {
            .fl;
            display: inline-block;
            margin-top: 2/@rem;
            font-size: inherit;
            .size(30, 30);
            background: url(../../../static/img/ico_store.png);
            .ele-base;
          }
          span {
            .fr;
            .fz(22);
            .cdiy(@c2);
          }
        }
        .item-middle {
          padding: 14/@rem 20/@rem;
          .flex;
          .bf8;
          .img-con {
            .rel;
            .size(130, 130);
            img {
              width: 100%;
              .abs-center-vh;
            }
          }
          .info-con {
            .flex-r(2);
            padding: 0 14/@rem;
            h3 {
              padding-bottom: 10/@rem;
              .txt-normal;
              .c3;
              .fz(26);
              .ellipsis-clamp-2;
            }
            .middle {
              .c9;
              .fz(22);
              .ellipsis-clamp-2;
              .unit-price {
                padding-right: 40/@rem;
                .c3;
                .fz(24);
              }
            }
          }
          .price-con {
            .flex-r(1);
            .right;
            .price {
              padding-bottom: 10/@rem;
              .c3;
              .fz(24);
            }
            .buy-count {
              .c9;
              .fz(22);
            }
          }
        }
        .item-bottom {
          .extra-info {
            margin-top: 2px;
            padding: 10/@rem 20/@rem;
            .bf8;
            p {
              .fz(22);
              .c3;
              span {
                .fr;
              }
              &:not(:last-child) {
                padding-bottom: 10/@rem;
              }
            }
          }
          .total-price {
            padding: 10/@rem 20/@rem;
            .right;
            .c3;
            .fz(22);
            .bor;
            span {
              .fz(30);
            }
          }
          .btns {
            padding: 20/@rem 20/@rem;
            overflow: hidden;
            a {
              .fr;
              padding: 4px 40/@rem;
              margin-left: 20/@rem;
              .cf;
              .fz(22);
              .borR(50px);
              &.btn-cancel, &.btn-del {
                .c6;
                .bor(1px, solid, #ccc);
              }
              &.btn-push, &.btn-appraise, &.btn-pay {
                .cdiy(@c2);
                .bor(1px, solid, @c2);
              }
            }
          }
        }
        &.grey {
          .c9!important;
        }
      }
    }
  }
</style>
