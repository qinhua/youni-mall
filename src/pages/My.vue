<template>
  <div class="my">
    <!--<router-view></router-view>-->
    <div class="user-modal">
      <div class="user-inner">
        <img src="../../static/img/av.jpg">
        <p class="user-name" @click="jumpTo('/edit_user', userId||255)">{{nickName}}<i class="fa fa-pencil-square-o"></i></p>
      </div>
      <canvas id="canvas" style="position:absolute;bottom:0px;left:0px;z-index:1;"></canvas>
    </div>
    <div class="order-model">
      <div class="arc"></div>
      <grid :rows="5">
        <grid-item @on-item-click="goOrder(1)">
          <p>2</p>
          <label>待支付</label>
        </grid-item>
        <grid-item @on-item-click="goOrder()">
          <p>0</p>
          <label>待接单</label>
        </grid-item>
        <grid-item @on-item-click="goOrder(2)">
          <p>0</p>
          <label>待派送</label>
        </grid-item>
        <grid-item @on-item-click="goOrder()">
          <p>1</p>
          <label>派送中</label>
        </grid-item>
        <grid-item @on-item-click="goOrder(3)">
          <p>2</p>
          <label>待评价</label>
        </grid-item>
      </grid>
    </div>
    <group class="list-modal">
      <cell title="我的卡券" link="/mycoupons">
        <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-credit-card"></i>
        3
      </cell>
      <cell title="我的水票" link="/ticket/2">
        <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-ticket"></i>
        1
      </cell>
      <cell title="我的押金" link="/myguarantee">
        <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-money"></i>
      </cell>
      <cell title="收货地址" link="/myaddress"><i slot="icon" width="20" style="margin-right:5px;"
                                              class="fa fa-map-signs"></i></cell>
      <cell title="我的收藏" link="/myfavor"><i slot="icon" width="20" style="margin-right:5px;"
                                            class="fa fa-star"></i></cell>
      <cell title="使用帮助" link="/help"><i slot="icon" width="20" style="margin-right:5px;"
                                         class="fa fa-question-circle"></i></cell>
      <cell title="关于友你" link="/aboutus"><i slot="icon" width="20" style="margin-right:5px;"
                                            class="fa fa-info-circle"></i></cell>
    </group>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Grid, GridItem, Group, Cell} from 'vux'

  export default {
    name: 'my',
    data () {
      return {
        nickName: '七灵'
      }
    },
    components: {Grid, GridItem, Group, Cell},
    beforeMount () {
      me = window.me
    },
    mounted () {
      // me.attachClick()
      this.nickName = this.$store.state.global.nickName
      var canvas = document.getElementById('canvas')
      var ctx = canvas.getContext('2d')
      canvas.width = canvas.parentNode.offsetWidth
      canvas.height = canvas.parentNode.offsetHeight
      // 如果浏览器支持requestAnimFrame则使用requestAnimFrame否则使用setTimeout
      window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60)
          }
      })()
      // 初始角度为0
      var step = 0
      // 定义三条不同波浪的颜色
      var lines = ['rgba(0,222,255, 0.2)',
        'rgba(157,192,249, 0.2)',
        'rgba(0,168,255, 0.2)']
      var loop = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        step++
        // 画3个不同颜色的矩形
        for (var j = lines.length - 1; j >= 0; j--) {
          ctx.fillStyle = lines[j]
          // 每个矩形的角度都不同，每个之间相差45度
          var angle = (step + j * 45) * Math.PI / 180
          var deltaHeight = Math.sin(angle) * 50
          var deltaHeightRight = Math.cos(angle) * 50
          ctx.beginPath()
          ctx.moveTo(0, canvas.height / 2 + deltaHeight)
          ctx.bezierCurveTo(canvas.width / 2, canvas.height / 2 + deltaHeight - 50, canvas.width / 2, canvas.height / 2 + deltaHeightRight - 50, canvas.width, canvas.height / 2 + deltaHeightRight)
          ctx.lineTo(canvas.width, canvas.height)
          ctx.lineTo(0, canvas.height)
          ctx.lineTo(0, canvas.height / 2 + deltaHeight)
          ctx.closePath()
          ctx.fill()
        }
        window.requestAnimFrame(loop)
      }
      loop()
    },
    computed: {},
    methods: {
      // 向父组件传值
      setPageStatus (data) {
        this.$emit('listenPage', data)
      },
      jumpTo (path, param) {
        this.$router.push({path: path + (param ? '/' + param : '')})
      },
      goOrder (param) {
        this.$router.push({path: '/order' + (param ? '/' + param : '')})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';

  .my {
    padding-bottom: 150/@rem;
    .user-modal {
      .rel;
      .center;
      background: #3077d2 url(../../static/img/bg_user.jpg);
      .bg100;
      .user-inner {
        .rel;
        z-index: 2;
        padding: 50/@rem 20/@rem 90/@rem;
        > img {
          .block;
          .size(130, 130);
          .ma-w(100);
          .ma-h(100);
          .ma;
          .bor(3px, solid, #fff);
          .borR(50%);
          box-shadow: 0 0 0 5px rgba(255, 255, 255, .4), 0 0 0 11px rgba(255, 255, 255, .2)
        }
        p {
          padding-top: 40/@rem;
          .fz(24);
          .cf;
          letter-spacing: 1px;
          i {
            padding-left: 10/@rem;
          }
        }
      }
      canvas{
        opacity: .25;
      }
    }
    .order-model {
      .rel;
      z-index: 5;
      margin-top: -50/@rem;
      .center;
      .arc {
        height: 50/@rem;
        background: url(../../static/img/arc.png);
        -webkit-background-size: 100% auto;
        background-size: 100% auto;
      }
      .weui-grids {
        margin-top: -10/@rem;
        .bf;
        &:before, &:after {
          .none;
          .no-bor;
        }
      }
      .weui-grid {
        .pointer;
        padding: 8px 10px;
        &:before {
          top: 20px;
          bottom: 20px;
        }
        &:after {
          .none;
        }
      }
      label {
        .fz(24);
        .c9;
      }
      p {
        .fz(46);
        .cdiy(#212225);
      }
    }
    .list-modal {
      .weui-cells {
        margin-top: 10/@rem;
        padding: 0;
      }
      .weui-cell {
        padding: 24/@rem !important;
        .fz(24) !important;
      }
    }
  }

</style>
