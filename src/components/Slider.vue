<template>
  <div class="swiper">
    <h2 class="title"></h2>
    <div class="swiper-container sliders-con">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item,index) in slides" :index="index+1">
          <a :href="item.url" target="blank">
            <h4>{{item.time}}</h4>
            <img class="wd-img" :src="item.imageUrl" alt="">
            <p>{{item.carName}}</p>
          </a>
        </div>
      </div>
      <!--<div class="swiper-pagination"></div>-->
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
//  import $ from 'jquery'
  import Swiper from 'swiper'
  export default {
    name: 'slider',
    data () {
      return {
        slides: [{
          time: '7月7日',
          carName: '森雅',
          imageUrl: 'static/img/m01.jpg'
        }, {
          time: '7月8日',
          carName: '红旗',
          imageUrl: 'static/img/m02.jpg'
        }, {
          time: '7月9日',
          carName: '奥迪',
          imageUrl: 'static/img/m03.jpg'
        }, {
          time: '7月10日',
          carName: '骏派',
          imageUrl: 'static/img/m04.jpg'
        }, {
          time: '7月11日',
          carName: '马自达',
          imageUrl: 'static/img/m05.jpg'
        }, {
          time: '7月12日',
          carName: '一汽丰田',
          imageUrl: 'static/img/m06.jpg'
        }, {
          time: '7月13日',
          carName: '大众',
          imageUrl: 'static/img/m07.jpg'
        }, {
          time: '7月14日',
          carName: '奔腾',
          imageUrl: 'static/img/m08.jpg'
        }]
      }
    },
    mounted () {
//      console.log('vue中的myMixin：', window.me)
      var me = window.me
      // initial swiper
      var mySlider = new Swiper('.swiper-container.sliders-con', {
        initialSlide: 0,
        direction: 'horizontal',
        loop: true,
        autoplay: 1200,
        preloadImages: true,
        autoplayDisableOnInteraction: false,
        observer: true,
        observeParents: true,
        slidesPerView: 4,
        slidesPerGroup: 1,
        spaceBetween: 3,
        // If we need pagination
//        pagination: '.swiper-pagination',
//        paginationClickable: true,
        // Navigation arrows
//        nextButton: '.swiper-button-next',
//        prevButton: '.swiper-button-prev',
        grabCursor: true,
        onClick: function (swiper) {
          var curIdx = swiper.activeIndex
          me.statistic('715一汽商城', '首页-小图区', '点击第' + (curIdx + 1) + '个')
        },
        onSlideChangeEnd: function () {
          me.statistic('715一汽商城', '首页-小图区', '滑动图片')
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import '../../static/css/tools.less';

  .swiper {
    position: relative;
    padding: 0 0 30/@rem 0;
    .title {
      width: 100%;
      height: 61/@rem;
      background: url(../../static/img/txt01.png) no-repeat center;
      -webkit-background-size: auto 100%;
      background-size: auto 100%;
    }
  }

  .sliders-con {
    padding: 28/@rem 0;
    .swiper-wrapper {
      .swiper-slide {
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
      }
    }
  }


</style>
