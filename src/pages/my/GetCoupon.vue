<template>
  <div class="getcoupon-con" v-cloak>
    <div class="f-wrap">
      <div class="top-col">
        <!--<img :src="avatar">
        <h2>{{nickName}}</h2>-->
        <p>点击领取按钮领取您的优惠券，您可在“我的-我的卡券”，查看已领取的优惠券</p>
      </div>
      <!--<group>
        <x-input title="手机号：" placeholder="您的手机号" text-align="right" type="tel" v-model="params.phone"></x-input>
        <x-input title="验证码：" class="weui-vcode" v-model="params.code">
          <x-button class="btn-vercode" slot="right" type="primary" mini :disabled="btnStatus" @click.native="getCode">
            {{btnText}}
          </x-button>
        </x-input>
      </group>-->
      <button type="button" class="btn btn-get" @click="getCoupon">领取优惠券</button>
    </div>
    <!--<p class="b-txt">友你生活 | 开启崭新生活</p>-->
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, XInput, XButton} from 'vux'
  import {userApi} from '../../service/main.js'

  export default {
    name: 'getcoupon-con',
    data() {
      return {
        isPosting: false,
        couponId: null
      }
    },
    components: {Group, XInput, XButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.couponId = vm.$route.query.id
      console.log(vm.couponId)
    },
    methods: {
      getCoupon() {
        if (vm.isPosting) return
        vm.isPosting = true
        vm.processing()
        vm.loadData(userApi.userCoupon, {couponId: vm.couponId}, 'POST', function (res) {
          vm.processing(0, 1)
          vm.isPosting = false
          if (res.success) {
            vm.toast('领取成功！')
            vm.jump('my_coupons')
          } else {
            vm.toast(res.message || '领取失败！', 'warn')
          }
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .getcoupon-con {
    height: 100%;
    overflow-x: hidden;
    .f-wrap {
      padding-bottom: 50px;
    }
    .top-col {
      .center;
      .rel;
      z-index: 2;
      padding: 60/@rem 20/@rem 50/@rem;
      .bf;
      > img {
        .block;
        .size(150, 150);
        .ma-w(100);
        .ma-h(100);
        .ma;
        .bor(2px, solid, #fff);
        .borR(50%);
      }
      h2 {
        padding: 14/@rem 0;
        font-weight: normal;
        .center;
        .cf;
        .fz(26);
      }
    }
    .bottom {
      margin-top: 10/@rem;
    }
    .vux-no-group-title {
      width: 92%;
      margin: 0 auto;
      .no-bg!important;
      &:before, &:after {
        .none;
      }
      .weui-cell:before {
        .none;
      }
      .vux-x-input {
        padding: 24/@rem 0;
        .fz(26);
        .cf;
        .bor-b(1px, solid, #f3f3f3);
        input {
          .ellipsis;
          .ipt-placeholder(#fff, right) !important;
        }
        .weui-icon-clear {
          .cf;
        }
      }
      .weui-btn_primary:not(.weui-btn_disabled):active {
        .bdiy(#0088ec);
      }
    }

    .btn-get {
      .block;
      width: 92%;
      margin: 20/@rem auto;
      .ma-w(640);
      .borBox;
      letter-spacing: 2px;
      padding: 24/@rem 0;
      .center;
      .cf;
      .fz(28);
      .bdiy(@b2);
      .borR(4px);
      .bor(1px, solide, #fff);
      .bsd(0, 3px, 10px, 0, #2892de);
    }
    .b-txt {
      .abs;
      .center;
      width: 100%;
      bottom: 0;
      padding: 30/@rem 0;
      .cc;
      .fz(20);
    }
  }

</style>
