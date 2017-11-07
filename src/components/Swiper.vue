<template>
  <div class="v-swiper">
    <div :class="'swiper-container v-swiper-con' + ' ' + skey">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item,index) in slides" :key="index+1">
          <a :href="item.linkUrl" target="blank">
            <img class="wd-img swiper-lazy" :data-src="item.image" alt="">
          </a>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-unused-vars */
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'
  export default {
    name: 'slider',
    data () {
      return {}
    },
    props: ['skey', 'slides', 'autoPlay', 'direction', 'loop'],
    mounted () {
      // var me = window.me
      var vm = this
      let curCls = '.' + vm.skey
      let isAuto = (vm.autoPlay ? vm.autoPlay : (vm.autoPlay === false ? false : 1500))
      // initial swiper
      var mySlider = function () {
        return new Swiper('.v-swiper-con' + curCls, {
          initialSlide: 0,
          direction: vm.direction || 'horizontal',
          loop: false,
          autoplay: isAuto,
          //preloadImages: true,
          lazyLoading: true,
          autoplayDisableOnInteraction: false,
          observer: true,
          observeParents: true,
          // If we need pagination
          pagination: curCls + ' .swiper-pagination',
          paginationClickable: true,
          // Navigation arrows
          // nextButton: '.swiper-button-next',
          // prevButton: '.swiper-button-prev',
          grabCursor: true
          /* onClick: function (swiper) {
           var curIdx = swiper.activeIndex
           me.statistic('众情重惠，不蓉错过', '首页-小图区', '点击第' + (curIdx + 1) + '个')
           },
           onSlideChangeEnd: function () {
           me.statistic('众情重惠，不蓉错过', '首页-小图区', '滑动图片')
           } */
        })
      }
      mySlider()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '../../static/css/tools.less';

  .v-swiper {
    .rel;
  }

  .swiper-container {
    .swiper-wrapper {
      /*.swiper-slide {
        a {
          .fz(24);
        }
        h4 {
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
        }
      }*/
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
