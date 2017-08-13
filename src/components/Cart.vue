<template>
  <div class="cart">
    <!--小红点-->
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
    <div class="float-cart" v-show="$route.path.indexOf('/home')>-1">
      <div class="cart-wrap"><i class="cur-count" v-if="curCount">{{curCount}}</i></div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable */
  export default {
    name: 'slider',
    data () {
      return {
        count: 0,
        balls: [ //小球 设为3个
          {
            show: false
          }, {
            show: false
          }, {
            show: false
          },
        ],
        dropBalls: []
      }
    },
    mounted () {
//      console.log('vue中的myMixin：', window.me)
      let me = window.me
    },
    methods () {
      // drop
      additem(event){
        this.drop(event.target);
      },
      /* 购物车小球动画实现 */
      drop (el) {
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
      beforeDrop (el) {
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
      dropping (el, done) {
        let rf = el.offsetHeight
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(-10px,-80px,0)'
        inner.style.transform = 'translate3d(-10px,-80px,0)'
        el.addEventListener('transitionend', done)
      },
      /*初始化小球*/
      afterDrop (el) {
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
<style lang="less" scoped>
  @import '../../static/css/tools.less';

  .cart {
    .ball-container{
      .ball{
        position: fixed;
        left: 32px;
        bottom: 22px;
        z-index: 200;
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41); /*贝塞尔曲线*/
      }
      .inner{
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #f33232;
        transition: all 0.4s linear;
      }
    }
    .float-cart{
      .fix;
      left:20/@rem;
      bottom:150/@rem;
      z-index:12;
      .cart-wrap{
        .rel;
        .size(80,80);
        background: rgba(0,0,0,.5) url(../../static/img/ico_cart.png) no-repeat center;
        -webkit-background-size: 56% auto;
        background-size: 56% auto;
        .borR(50%);
        i{
          .abs;
          top:-6/@rem;
          right:-6/@rem;
          .block;
          .center;
          line-height: 20/@rem;
          .txt-normal;
          min-width:20/@rem;
          padding:4px;
          .fz(20);
          .cf;
          .bdiy(#f74c31);
          .borR(50%);
        }
      }
    }
  }

</style>
