<template>
  <div class="my">
    <div class="user-modal">
      <div class="user-inner">
        <img src="../../static/img/av.jpg">
        <p class="user-name">撕破天<i class="fa fa-pencil-square-o"></i></p>
      </div>
    </div>
    <grid :rows="5" class="order-model">
      <grid-item link="/nearby" @on-item-click="goOrder(1)">
        <p>2</p>
        <label>待付款</label>
      </grid-item>
      <grid-item @on-item-click="goOrder(2)">
        <p>0</p>
        <label>待接单</label>
      </grid-item>
      <grid-item @on-item-click="goOrder(3)">
        <p>0</p>
        <label>待派送</label>
      </grid-item>
      <grid-item @on-item-click="goOrder(4)">
        <p>1</p>
        <label>待收货</label>
      </grid-item>
      <grid-item link="/nearby" @on-item-click="goOrder(5)">
        <p>2</p>
        <label>待评价</label>
      </grid-item>
    </grid>
      <group class="list-modal">
        <cell title="我的红包" link="/pages/my/mypacket">
          <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-money"></i>
          10
        </cell>
        <cell title="我的卡券" link="/pages/my/mycounpons">
          <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-credit-card"></i>
          3
        </cell>
        <cell title="我的水票" link="/ticket/2">
          <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-ticket"></i>
          1
        </cell>
        <cell title="收货地址" link="/my/myaddress"><i slot="icon" width="20" style="margin-right:5px;" class="fa fa-map-signs"></i></cell>
        <cell title="我的收藏" link="/pages/my/mystar"><i slot="icon" width="20" style="margin-right:5px;" class="fa fa-star"></i></cell>
        <cell title="使用帮助" link="/pages/my/help"><i slot="icon" width="20" style="margin-right:5px;" class="fa fa-question-circle"></i></cell>
        <cell title="关于友你" link="/pages/my/aboutus"><i slot="icon" width="20" style="margin-right:5px;" class="fa fa-info-circle"></i></cell>
      </group>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  var me
  var vm
  import {Grid, GridItem, Group, Cell} from 'vux'
  export default {
    name: 'my',
    data () {
      return {
      }
    },
    components: {Grid, GridItem, Group, Cell},
    beforeMount () {
      me = window.me
    },
    mounted () {
      // me.attachClick()
//      this.$axios.get('/user', {
//        params: {
//          ID: 12345
//        }
//      }).then(function (response) {
//        console.log(response)
//      }).catch(function (error) {
//        console.log(error)
//      })
    },
    computed: {
      'this.current': function () {
        return 20
      }
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';
  .my{
    padding-bottom: 60px;
    .user-modal{
      .center;
      background:#5c70ff url(../../static/img/bg_av.jpg);
      .bg100;
      .user-inner{
        padding:50/@rem 20/@rem 30/@rem;
        >img{
          .block;
          .size(130,130);
          .ma-w(100);
          .ma-h(100);
          .ma;
          .bor(3px,solid,#fff);
          .borR(50%);
          box-shadow:0 0 0 5px rgba(255,255,255,.4) ,0 0 0 11px rgba(255,255,255,.2)
        }
        p{
          padding-top:40/@rem;
          .fz(24);
          .cf;
          letter-spacing: 1px;
          i{
            padding-left:10/@rem;
          }
        }
      }
    }
    .order-model{
      .center;
      .bf;
      .weui-grids {
        &:before, &:after {
          .none;
        }
      }
      .weui-grid {
        .pointer;
        padding: 8px 10px;
        &:before {
          top:20px;
          bottom:20px;
        }
        &:after {
          .none;
        }
      }
      label{
        .fz(24);
        .c9;
      }
      p{
        .fz(48);
        .c3;
      }
    }
    .list-modal{
      .weui-cells{
        margin-top:10/@rem;
        padding: 0;
      }
      .weui-cell{
        padding:20/@rem 30/@rem!important;
        .rfz(14)!important;
      }
    }
  }

</style>
