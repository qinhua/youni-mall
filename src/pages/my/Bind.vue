<template>
  <div class="bind-con" v-cloak>
    <div class="f-wrap">
      <group>
        <x-input title="手机号：" placeholder="您的手机号" text-align="right" type="tel" required
                 v-model="params.phone"></x-input>
        <x-input title="验证码：" class="weui-vcode" v-model="params.code">
          <x-button class="btn-vercode" slot="right" type="primary" mini :disabled="btnStatus" @click.native="getCode">
            {{btnText}}
          </x-button>
        </x-input>
      </group>
      <div class="btn btn-save" @click="bindMe"><i class="fa fa-save"></i>&nbsp;绑定</div>
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
    },
    methods: {
      validate() {
        if (!vm.params.phone) {
          vm.toast('请填写手机号！', 'warn')
          return false
        }
        if (!vm.params.phone.match(/^(13|15|18|17)\d{9}$/)) {
          vm.toast('请填写正确的手机号！', 'warn')
          return false
        }
        if (!vm.params.code) {
          vm.toast('请填写验证码！', 'warn')
          return false
        }
        return true
      },
      getCode() {
        if (vm.isPosting) return false
        if (!vm.params.phone) {
          vm.toast('请填写手机号 ！', 'warn')
          return false
        }
        if (!vm.params.phone.match(/^(13|15|18|17)\d{9}$/)) {
          vm.toast('请填写正确的手机号 ！', 'warn')
          return false
        }
        vm.isPosting = true
        vm.loadData(commonApi.sendSms, {phone: vm.params.phone}, 'POST', function (res) {
          /*vm.toast('已发送，请注意查收！')
          vm.btnText = '60s后再次获取'
          vm.btnStatus = true
          setTimeout(function () {
            vm.btnText = '发送验证码'
            vm.btnStatus = false
          }, 60000)*/
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
    .f-wrap {
      height: 100%;
      padding-bottom: 50px;
    }
    .bottom {
      margin-top: 10/@rem;
    }
    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
        input {
          .ellipsis;
        }
      }
      .vux-x-input, .address-area, .vux-cell-box, .vux-x-textarea {
        .fz(26);
      }
    }
    .btn-save {
      width: 96%;
      margin: 20/@rem auto;
      .ma-w(640);
      .borBox;
      letter-spacing: 2px;
      padding: 24/@rem 0;
      .center;
      .cf;
      .fz(28);
      .bdiy(#16a542);
      .borR(4px);
    }
    .b-txt {
      .abs;
      .center;
      width: 100%;
      bottom: 0;
      padding: 30/@rem 0;
      .cb;
      .fz(20);
    }
  }

</style>
