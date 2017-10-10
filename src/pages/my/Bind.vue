<template>
  <div class="bind-con" v-cloak>
    <div class="f-wrap">
      <div class="top-col">
        <img :src="avatar">
        <h2>{{nickName}}</h2>
      </div>
      <group>
        <x-input title="手机号：" placeholder="您的手机号" text-align="right" type="tel" v-model="params.phone"></x-input>
        <x-input title="验证码：" class="weui-vcode" v-model="params.code">
          <x-button class="btn-vercode" slot="right" type="primary" mini :disabled="btnStatus" @click.native="getCode">
            {{btnText}}
          </x-button>
        </x-input>
      </group>
      <div class="btn btn-save" @click="bindMe">立即绑定</div>
    </div>
    <p class="b-txt">友你生活 | 开启崭新生活</p>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, XInput, XButton} from 'vux'
  import {commonApi, userApi} from '../../service/main.js'

  export default {
    name: 'bind-con-con',
    data() {
      return {
        isPosting: false,
        btnText: '发送验证码',
        btnStatus: false,
        nickName: '',
        avatar: '',
        params: {
          phone: '',
          code: ''
        }
      }
    },
    components: {Group, XInput, XButton},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.nickName = vm.$store.state.global.wxInfo.nickname
      vm.avatar = vm.$store.state.global.wxInfo.headimgurl
    },
    watch: {
      '$route' (to, from) {
        if (to.name === 'bind') {
          vm.nickName = vm.$store.state.global.wxInfo.nickname
          vm.avatar = vm.$store.state.global.wxInfo.headimgurl
        }
      }
    },
    methods: {
      validate() {
        if (!vm.params.phone) {
          me.lightPop('请填写手机号！')
          return false
        }
        if (!vm.params.phone.match(/^(13|15|18|17)\d{9}$/)) {
          me.lightPop('请填写正确的手机号！')
          return false
        }
        if (!vm.params.code) {
          me.lightPop('请填写验证码！')
          return false
        }
        return true
      },
      getCode() {
        if (vm.isPosting) return false
        if (!vm.params.phone) {
          me.lightPop('请填写手机号 ！')
          return false
        }
        if (!vm.params.phone.match(/^(13|15|18|17)\d{9}$/)) {
          me.lightPop('请填写正确的手机号 ！')
          return false
        }
        vm.isPosting = true
        vm.loadData(commonApi.sendSms, {phone: vm.params.phone}, 'POST', function (res) {
          vm.btnStatus = true
          me.verCodeBtn(60, '.btn-vercode', function () {
            vm.btnStatus = false
          })
          vm.isPosting = false
        }, function () {
          vm.isPosting = false
        })
      },
      bindMe() {
        if (vm.isPosting) return
        if (vm.validate()) {
          vm.isPosting = true
          vm.processing()
          vm.loadData(userApi.bind, vm.params, 'POST', function (res) {
            vm.processing(0, 1)
            vm.isPosting = false
            if (res.success) {
              vm.toast('绑定成功！')
              vm.jump('home')
            } else {
              vm.toast(res.message || '绑定失败！', 'warn')
            }
          }, function () {
            vm.isPosting = false
            vm.processing(0, 1)
          })
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .bind-con {
    height: 100%;
    overflow-x: hidden;
    background: url(../../../static/img/bg_bind.jpg) no-repeat top center;
    .rbg-size(100%, 100%);
    .f-wrap {
      padding-bottom: 50px;
    }
    .top-col {
      .center;
      .rel;
      z-index: 2;
      padding: 60/@rem 20/@rem 50/@rem;
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
      .weui-btn_primary:not(.weui-btn_disabled):active{
        .bdiy(#0088ec);
      }
    }
    .btn-vercode {
      .borR(3px);
      .bdiy(#2196F3);
      &:disabled {
        .ce;
        .bdiy(#72acd2);
      }
    }

    .btn-save {
      width: 92%;
      margin: 20/@rem auto;
      .ma-w(640);
      .borBox;
      letter-spacing: 2px;
      padding: 24/@rem 0;
      .center;
      .cdiy(#268ed2);
      .fz(28);
      .bdiy(rgba(255, 255, 255, 0.5));
      .borR(4px);
      .bor(1px, solid, #fff);
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
