<template>
  <div class="getcoupon-con" v-cloak>
    <div class="f-wrap">
      <div class="top-col">
        <section class="v-items" v-if="coupons.id">
          <!--<div :class="('stamp type0'+coupons.type) + (!coupons.status?' expired':'')">-->
          <div class="stamp type01">
            <div class="wrap">
              <div class="par">
                <!--<p>{{coupons.sellerName}}</p>-->
                <div class="content">
                  <h3 class="value">{{coupons.discountRate}}折<sub class="type" v-if="coupons.goodsTypeName">{{coupons.goodsTypeName}}</sub>
                  </h3>
                  <sub class="sign">最多抵扣￥{{coupons.maxAmount | toFixed}}元</sub>
                  <!--<sub class="type">{{coupons.goodsTypeName}}</sub>-->
                </div>
                <p class="info">{{coupons.couponNote || '平台优惠'}}<span v-if="coupons.newUser">首单优惠</span></p>
              </div>
              <div class="copy" v-if="coupons.expireTime&&!coupons.expired">{{coupons.label}}<p>
                {{coupons.createTime+ '~' + coupons.expireTime}}
              </p>
              </div>
              <div class="copy" v-else-if="!coupons.expireTime"><span class="exp">永久有效</span></div>
              <div class="copy" v-else><span class="exp">已过期</span></div>
            </div>
            <i></i>
          </div>
        </section>
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
      <button type="button" class="btn btn-get" @click="get">领取优惠券</button>
    </div>
    <p class="b-txt">友你生活 | 开启崭新生活</p>
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
        couponId: null,
        coupons: {}
      }
    },
    components: {Group, XInput, XButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.couponId = vm.$route.query.id
      vm.getCoupon()
    },
    methods: {
      getCoupon() {
        if (vm.isPosting) return
        vm.isPosting = true
        vm.processing()
        vm.loadData(userApi.platformCoupon, {id: vm.couponId}, 'POST', function (res) {
          vm.processing(0, 1)
          vm.isPosting = false
          var resD = res.data.itemList
          for (var i = 0; i < resD.length; i++) {
            resD[i].expired = me.compareCurrentDate(resD[i].expireTime)
            switch (resD[i].goodsType) {
              case 'goods_type.1':
                resD[i].goodsTypeName = '水'
                break
              case 'goods_type.2':
                resD[i].goodsTypeName = '奶'
                break
            }
            resD[i].createTime = resD[i].createTime ? resD[i].createTime.split(' ')[0] : ''
            resD[i].expireTime = resD[i].expireTime ? resD[i].expireTime.split(' ')[0] : ''
            if (!vm.coupons.id && vm.couponId === resD[i].id) {
              vm.coupons = resD[i]
            }
          }
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      get() {
        if (vm.isPosting) return
        vm.isPosting = true
        vm.loadData(userApi.userCoupon, {couponId: vm.couponId}, 'POST', function (res) {
          vm.isPosting = false
          if (res.success) {
            vm.confirm('领取成功', '您可在“我的-我的卡券”查看！', function () {
              vm.jump('home')
            }, function () {
              vm.jump('my_coupons')
            }, '确定', '查看')
          } else {
            vm.toast(res.message || '领取失败！', 'warn')
          }
        }, function () {
          vm.isPosting = false
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
      .rel;
      z-index: 2;
      padding: 20/@rem 20/@rem 20/@rem;
      .bf;
    }

    .v-items {
      .borBox;
      width: 100%;
      margin-bottom: 10/@rem;
      .stamp {
        .rel;
        .borBox;
        min-height: 200/@rem;
        margin: 0 auto 16/@rem;
        overflow: hidden;
        &:before {
          .abs;
          .block;
          top: 0;
          left: 0;
          width: 20px;
          height: 100%;
          content: '';
        }
        &:after {
          .abs;
          .block;
          top: 0;
          right: 0;
          width: 20px;
          height: 100%;
          content: '';
        }
        .wrap {
          .flex;
          .borBox;
          .abs;
          padding: 20/@rem 0 20/@rem 20/@rem;
          content: '';
          top: 0;
          bottom: 0;
          left: 10px;
          right: 10px;
          z-index: -1;
          background-color: #e0552e;
        }
        i {
          position: absolute;
          right: -20%;
          top: 120/@rem;
          height: 300/@rem;
          width: 320px;
          z-index: 5;
          .fz(24);
          background-color: rgba(255, 255, 255, .15);
          transform: rotate(-30deg);
        }
        .par {
          .rel;
          .flex-r(3);
          z-index: 5;
          .left;
          border-right: 2px dashed rgba(255, 255, 255, .3);
          p {
            .rel;
            padding-top: 5/@rem;
            color: #fff;
            .fz(24);
            span {
              .abs;
              right: 14/@rem;
              padding: 0 2px;
              .fz(22);
              color: rgba(255, 255, 255, .8);
              .bor(1px, solid, rgba(255, 255, 255, .8));
              .borR(2px);

            }
          }
          .content {
            padding: 10/@rem 0;
            .value {
              .fz(34);
              color: #fff;
              font-weight: normal;
              margin-right: 14/@rem;
              line-height: 60/@rem;
              sub {
                padding: 2px;
                line-height: 1;
                .fr;
                .fz(24);
                color: rgba(255, 255, 255, .8);
                .bor(1px, solid, rgba(255, 255, 255, .8));
                .borR(2px);
              }
            }
            .sign {
              .block;
              .fz(24);
              color: rgba(255, 255, 255, .8);
            }
            .info {
              .cdiy(#ffe041);
            }
          }
        }
        .copy {
          .rel;
          .flex-r(1);
          .rel;
          z-index: 5;
          padding: 30/@rem;
          .fz(26);
          .center;
          color: rgb(255, 255, 255);
          .exp {
            .abs-center-vh;
          }
          p {
            .fz(18);
            margin-top: 10/@rem;
          }
        }
        /*&.type-coupon {*/
        &.type01 {
          &:before {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #f1a83f 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #f1a83f 5px) repeat-y;
            background-size: 20px 18px;
            background-position: -10px 3px;
          }
          &:after {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #f1a83f 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #f1a83f 5px) repeat-y;
            background-size: 20px 18px;
            background-position: 10px 3px;
          }
          .wrap {
            background-color: #f1a83f;
          }
        }
        /*&.type-ticket {*/
        &.type02 {
          &:before {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #3fa1f1 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #3fa1f1 5px) repeat-y;
            background-size: 20px 18px;
            background-position: -10px 3px;
          }
          &:after {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #3fa1f1 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #3fa1f1 5px) repeat-y;
            background-size: 20px 18px;
            background-position: 10px 3px;
          }
          .wrap {
            background-color: #3fa1f1;
          }
        }
        /*&.type-redpacket {*/
        &.type03 {
          &:before {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background-size: 20px 18px;
            background-position: -10px 3px;
          }
          &:after {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background-size: 20px 18px;
            background-position: 10px 3px;
          }
          .wrap {
            background-color: #e0552e;
          }
        }
        &.type04 {
          &:before {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background-size: 20px 18px;
            background-position: -10px 3px;
          }
          &:after {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #e0552e 5px) repeat-y;
            background-size: 20px 18px;
            background-position: 10px 3px;
          }
          .wrap {
            background-color: #e0552e;
          }
        }
        /*&.type-expired {*/
        &.expired {
          &:before {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #bbb 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #bbb 5px) repeat-y;
            background-size: 20px 18px;
            background-position: -10px 3px;
          }
          &:after {
            background: -webkit-radial-gradient(transparent 0, transparent 5px, #bbb 5px) repeat-y;
            background: radial-gradient(transparent 0, transparent 5px, #bbb 5px) repeat-y;
            background-size: 20px 18px;
            background-position: 10px 3px;
          }
          .wrap {
            background-color: #bbb;
          }
        }
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
      .bdiy(#ff070a);
      .borR(5px);
      .bsd(0, 2px, 10px, 0, #f96769);
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
