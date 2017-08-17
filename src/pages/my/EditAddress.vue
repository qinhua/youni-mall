<template>
  <div class="address-edit">
    <group>
      <x-input title="收货人：" placeholder="输入姓名" required v-model="param.name"></x-input>
      <x-input title="联系电话：" placeholder="输入电话号码" required v-model="param.phone"></x-input>
      <x-address class="address-area" title="所在地区" @on-hide="logHide" @on-shadow-change="changeArea" :list="addressData" placeholder="请选择地区">
        <template slot="title" scope="props">
        <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
          <span style="vertical-align:middle;">所在地区：</span>
        </span>
        </template>
      </x-address>
      <x-input title="详细地址：" placeholder="输入详细地址" required v-model="param.detailAddress"></x-input>
      <x-input title="邮政编码：" placeholder="输入邮编" v-model="param.postCode"></x-input>
    </group>
    <group>
    </group>
    <div class="add-address" @click="updateAddress"><i class="fa fa-save"></i>&nbsp;保存</div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell, XAddress, ChinaAddressV3Data, XInput} from 'vux'
  import {userApi} from '../../service/main.js'
  export default {
    name: 'address-edit',
    data () {
      return {
        onFetching: false,
        isPosting: false,
        addressData: ChinaAddressV3Data,
        param: {
          userId: null,
          id: null,
          name: '',
          phone: null,
          area: null,
          address: null,
          detailAddress: '',
          postCode: null
        }
      }
    },
    components: {Group, Cell, XAddress, XInput},
    beforeMount () {
      me = window.me
    },
    mounted () {
      vm = this
      // me.attachClick()
      vm.param.id = vm.$route.query.id
      vm.param.userId = vm.$store.state.global.userId
      console.log(vm.param)
    },
    methods: {
      logHide (str) {
        console.log('on-hide', str)
      },
      changeArea (ids, names) {
        console.log(ids, names)
        vm.param.area = names.join('')
      },
      updateAddress () {
        if (vm.isPosting) return false
        console.log(vm.param)
        if (!vm.param.name || !vm.param.phone || !vm.param.area || !vm.param.detailAddress) {
          vm.toast('请先填写完整！', 3)
          return false
        }
        vm.param.address = vm.param.area + vm.param.detailAddress
        vm.$store.commit('updateAddress', {data: vm.param, type: 'push'})
        vm.$router.back()

        /* vm.isPosting = true
        vm.processing()
        // 更新还是新增
        if (vm.userId) {
          vm.loadData(userApi.updateAddress, vm.param, 'POST', function (res) {
            console.log(res, '编辑地址')
//            this.$store.commit('updateNickName', vm.nickName)
            vm.$router.back()
            vm.isPosting = false
            vm.processing(0, 1)
          }, function () {
            vm.isPosting = false
            vm.processing(0, 1)
          })
        } else {
          delete vm.param.id
          vm.loadData(userApi.addAddress, vm.param, 'POST', function (res) {
            console.log(res, '新增地址')
            vm.$router.back()
            vm.isPosting = false
            vm.processing(0, 1)
          }, function () {
            vm.isPosting = false
            vm.processing(0, 1)
          })
        } */
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .address-edit {
    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
        .fz(28);
        input{
          .right;
        }
      }
    }
    .address-area{
      .fz(28);
      .weui-label{
        line-height: 24px;
      }
    }
    .add-address {
      .fix;
      bottom: 0;
      width: 100%;
      .ma-w(640);
      .borBox;
      letter-spacing: 2px;
      padding: 24/@rem;
      .center;
      .cf;
      .fz(28);
      .bdiy(#16a542);
    }
  }

</style>
