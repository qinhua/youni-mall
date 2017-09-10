<template>
  <div class="v-slide-tab">
    <div :class="'swiper-container slide-tab-con' + ' ' + skey">
      <div class="swiper-wrapper">
        <div :class="['swiper-slide',current===index?'active':'']" v-for="(item,index) in slides" :key="index+1"
             @click="selectTab(index,item.key,item.value)">
          <a :data-id="item.key">{{item.value}}</a>
        </div>
      </div>
      <!--<div class="swiper-pagination"></div>-->
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-unused-vars */
  import $ from 'jquery'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'

  let vm
  export default {
    name: 'slideTab',
    data() {
      return {
        current: 0
      }
    },
    props: ['skey', 'slides', 'autoPlay', 'direction', 'loop'],
    mounted() {
      vm = this
      console.log(this.slides)
      let curCls = '.' + vm.skey
      let isAuto = vm.autoPlay ? vm.autoPlay : false
      // initial swiper
      var mySlideTab = function () {
        return new Swiper('.slide-tab-con' + curCls, {
          initialSlide: 0,
          direction: vm.direction || 'horizontal',
          loop: false,
          autoplay: isAuto,
          preloadImages: true,
          autoplayDisableOnInteraction: false,
          observer: true,
          slidesPerView: 4,
          observeParents: true,
          // If we need pagination
          pagination: '.slide-tab-con' + (curCls ? (' ' + curCls + ' .swiper-pagination') : ' .swiper-pagination'),
          paginationClickable: true,
          // Navigation arrows
          // nextButton: '.swiper-button-next',
          // prevButton: '.swiper-button-prev',
          grabCursor: true,
          onInit: function (swiper) {
            /*$(document).on('click', '.swiper-slide', function () {
              var curIdx = $(this).index()
              var $navs = $('.swiper-slide')
              $navs.eq(curIdx).addClass('active').siblings('.swiper-slide').removeClass('active')
            })*/
          },
          /* onClick: function (swiper) {
             var curIdx = swiper.activeIndex
           },
           onSlideChangeEnd: function (swiper) {
             var curIdx = swiper.activeIndex
 //             swiper[curIdx].classList.add('active')
           }*/
        })
      }
      mySlideTab()
    },
    methods: {
      selectTab(index, key, value) {
        vm.current = index
        vm.$emit('on-select', {index: index, key: key, value: value})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '../../static/css/tools.less';

  .v-slide-tab {
    .rel;
  }

  .swiper-container {
    .bf;
    .swiper-wrapper {
      height: 40px;
      .swiper-slide {
        .center;
        &.active {
          a {
            color: #5cc5d0;
          }
        }
        a {
          line-height: 40px;
          .fz(24);
        }
        /*h4 {
          padding: 5/@rem 0;
          .center;
          .bdiy(#ff3969);
          .fz(24);
          .cf;
        }
        img {
          margin: 6/@rem 0;
        }
        p {
          padding: 10/@rem 0;
          .center;
          .fz(24);
          .cdiy(#5b4ae6);
        }*/
      }
    }
    /*.swiper-button-prev, .swiper-button-next {
      position: absolute;
      top: 50%;
      width: 40px;
      height: 44px;
      margin-top: -22px;
      z-index: 43;
      -webkit-background-size: cover;
      background-size: cover;
    }
    .swiper-button-prev {
      left: 10px;
      cursor: pointer;
      !*background: url("../images/btn_pre.png") no-repeat center;*!
    }
    .swiper-button-next {
      right: 10px;
      cursor: pointer;
      !*background: url("../images/btn_next.png") no-repeat center;*!
    }
    .swiper-pagination {
      bottom: 0;
    }
    .swiper-pagination-bullet {
      width: 20/@rem;
      height: 20/@rem;
      margin: 0 4px;
      background: rgba(255, 255, 255, .5);
    }
    .swiper-pagination-bullet-active {
      width: 20/@rem;
      height: 20/@rem;
      opacity: 1;
      background: #0090ca;
    }*/
  }

</style>
