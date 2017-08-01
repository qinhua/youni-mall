<template>
  <div class="home">
    <div class="location-chooser">
      <p><span>您的位置</span>：武汉市洪山区光谷软件园B7栋</p>
      <i class="right-arrow"></i>
    </div>
    <swiper auto class="swiper-home">
      <swiper-item class="black" v-for="(item, index) in slides" :key="index">
        <a :href="item.url">
          <img :src="item.imageUrl">
          <p>{{item.carName}}</p>
        </a>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  var me
  var vm
  import { Swiper, GroupTitle, SwiperItem, XButton, Divider } from 'vux'
  import {homeApi} from '../store/home.js'
  export default {
    name: 'home',
    data () {
      return {
        current: 0,
        slides: [{
          carName: '奔腾X40',
          imageUrl: 'static/img/p01.jpg',
          url: 'http://123.click.kakamobi.cn/28f14df89e60fa30b50b5ce651af05cf'
        }, {
          carName: '森雅R7',
          imageUrl: 'static/img/p02.jpg',
          url: 'http://123.click.kakamobi.cn/d80eac19ee10e62c48f6e75d33cdb67c'
        }, {
          carName: '红旗H7',
          imageUrl: 'static/img/p03.jpg',
          url: 'http://123.click.kakamobi.cn/449c9d28fb0504cef14ff84286789f55'
        }, {
          carName: '新骏派D60',
          imageUrl: 'static/img/p04.jpg',
          url: 'http://123.click.kakamobi.cn/ef3806b3738dee24f34d5ae0de201dd7'
        }]
      }
    },
    components: {Swiper, GroupTitle, SwiperItem, XButton, Divider},
    beforeMount () {
      me = window.me
      console.log(homeApi)
    },
    mounted () {
      // me.attachClick()
      this.$axios.post(homeApi.banner, {
        firstName: 'Fred',
        lastName: 'Flintstone'
      }).then(function (response) {
        console.log(response)
      }).catch(function (error) {
        console.log(error)
      })
    },
    computed: {
      'this.current': function () {
        return 20
      }
    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../static/css/tools.less';

  .home {
    .transi(.3s)
  }

  .location-chooser {
    .rel;
    .borBox;
    padding: 0 20/@rem;
    /*  height: 70/@rem;
      line-height: 70/@rem;*/
    height: 40px;
    line-height: 40px;
    .bf5;
    p {
      .fz(24);
      .c6;

      span {
        .cdiy(#e4582d);
      }
    }
  }

  .right-arrow {
    position: absolute;
    width: 30px;
    height: 30px;
    top: 5px;
    right: 5px;
    &:before {
      content: "";
      position: absolute;
      width: 12px;
      height: 12px;
      border: 1px solid #666;
      border-width: 1px 0 0 1px;
      /*-webkit-transform: rotate(-45deg);*/
      /*transform: rotate(-45deg);*/
      -webkit-transform: rotate(135deg);
      transform: rotate(135deg);
      top: 8px;
      left: 7px;
    }
  }

  .vux-swiper {
    height: auto;
    img {
      width: 100%;
    }
  }
</style>
