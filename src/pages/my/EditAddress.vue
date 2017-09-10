<template>
  <div class="address-edit">
    <div class="f-wrap" v-show="!showMap">
      <group>
        <x-input title="收货人：" placeholder="输入姓名" required v-model="params.name"></x-input>
        <x-input title="联系电话：" placeholder="输入电话号码" required v-model="params.phone"></x-input>
        <x-address class="address-area" title="所在地区" @on-hide="logHide" @on-shadow-change="changeArea"
                   :list="addressData" placeholder="请选择地区">
          <template slot="title" scope="props">
        <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
          <span style="vertical-align:middle;">所在地区：</span>
        </span>
          </template>
        </x-address>
        <x-input title="详细地址：" placeholder="输入详细地址" v-model="detailAddress" required readonly text-align="right"
                 @click.native="choosePoint"></x-input>
        <x-input title="门牌号：" placeholder="门牌号" v-model="params.houseCode"></x-input>
        <div class="checker-group">
          <label>设为默认地址：</label>
          <checker v-model="params.defaultAddress" default-item-class="demo-item"
                   selected-item-class="demo-item-selected">
            <checker-item :value="item.key" v-for="(item, index) in status" :key="index" @on-item-click="changeStatus">
              {{item.value}}
            </checker-item>
          </checker>
        </div>
      </group>
      <div class="add-address" @click="updateAddress"><i class="fa fa-save"></i>&nbsp;保存</div>
    </div>
    <amap @on-receive-data="getMap" v-if="showMap"></amap>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell, XAddress, ChinaAddressV3Data, XInput, Checker, CheckerItem} from 'vux'
  import Amap from '../../components/Amap.vue'
  import {commonApi, userApi} from '../../service/main.js'

  export default {
    name: 'address-edit',
    data() {
      return {
        lastPage: {
          name: '',
          data: null
        },
        showMap: false,
        lineData: null,
        isPosting: false,
        addressData: ChinaAddressV3Data,
        status: [{key: 1, value: '是'}, {key: 0, value: '否'}],
        area: '',
        detailAddress: '',
        params: {
          name: '',
          addressId: null,
          phone: '',
          address: '',
          houseCode: '',
          lat: '',
          lon: '',
          defaultAddress: 0
        }
      }
    },
    components: {Amap, Group, Cell, XAddress, XInput, Checker, CheckerItem},
    beforeMount() {
      me = window.me
    },
    mounted() {
      // me.attachClick()
      vm = this
      this.$nextTick(function () {
        vm.getAddress()
      })
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'edit_address') {
          vm.getAddress()
          vm.showMap = false
        }
      }
    },
    methods: {
      logHide(str) {
        console.log('on-hide', str)
      },
      choosePoint() {
        vm.showMap = true
      },
      getMap(data) {
        vm.showMap = false
        // console.log(data, 'home amap info')
        vm.params.lon = data.lng
        vm.params.lat = data.lat
        vm.detailAddress = data.name
      },
      switchData(data, value, target, isUpdate) {
        let tmp
        if (isUpdate) {
          tmp = []
          for (let i = 0; i < data.length; i++) {
            if (value === data[i].key) {
              tmp.push(data[i].name)
            }
          }
          vm[target] = tmp
        } else {
          let tt = value.join('')
          for (let i = 0; i < data.length; i++) {
            if (tt === data[i].name) {
              tmp = data[i].key
            }
          }
          vm.params[target] = tmp
        }
      },
      getAddress() {
        var parms = vm.$route.query
        vm.lineData = parms.linedata ? JSON.parse(decodeURIComponent(parms.linedata)) : null
        if (vm.lineData && vm.lineData.id) {
          vm.detailAddress = vm.lineData.address
          vm.params = {
            addressId: vm.lineData.id,
            name: vm.lineData.name,
            phone: vm.lineData.phone,
            address: vm.lineData.address,
            houseCode: vm.lineData.houseCode,
            defaultAddress: vm.lineData.defaultAddress ? 1 : 0
          }
        } else {
          vm.detailAddress = ''
          vm.params = {
            name: '',
            phone: '',
            address: '',
            houseCode: '',
            lat: '',
            lon: '',
            defaultAddress: 0
          }
          vm.lastPage.name = parms.from || ''
          if (vm.lastPage.name === 'confirm_order') {
            vm.params.defaultAddress = 1
            vm.lastPage.data = me.sessions.get('ynTmpConfirm')
          }
        }
      },
      changeArea(ids, names) {
        console.log(ids, names)
        vm.area = names[0] + (names[1].indexOf('市辖区') === -1 ? names[1] : '') + names[2]
        vm.detailAddress = ''
        console.log(vm.area)
      },
      changeStatus(value, disabled) {
        console.log(value, disabled)
      },
      validate() {
        if (vm.params.name === '') {
          vm.toast('请填写收货人！', 'warn')
          return false
        }
        if (!vm.params.phone) {
          vm.toast('请填写电话号码！', 'warn')
          return false
        }
        if (!vm.area) {
          vm.toast('请选择地区！', 'warn')
          return false
        }
        if (!vm.detailAddress) {
          vm.toast('请输入详细地址！', 'warn')
          return false
        }
        if (!vm.params.houseCode) {
          vm.toast('请填写门牌号！', 'warn')
          return false
        }
        return true
      },

      updateAddress() {
        if (vm.isPosting) return false
        if (vm.validate()) {
          vm.isPosting = true
          vm.processing()
          if (vm.detailAddress.indexOf('省') === -1 && vm.detailAddress.indexOf('市') === -1) {
            vm.params.address = vm.area + vm.detailAddress
          } else {
            vm.params.address = vm.detailAddress
          }
          console.log('最后选择的数据：', vm.params)
          // 更新还是新增
          vm.loadData(userApi.setAddress, vm.params, 'POST', function (res) {
            vm.isPosting = false
            vm.processing(0, 1)
            if (vm.lastPage.name && vm.lastPage.name === 'confirm_order') {
              vm.jump(vm.lastPage.name, {thedata: vm.lastPage.data})
            } else {
              vm.$router.back()
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

  .address-edit {
    height: 100%;
    overflow-x: hidden;
    .f-wrap {
      height: 100%;
    }
    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
        .fz(28);
        input {
          .right;
        }
      }
    }
    .address-area {
      .fz(28);
      .weui-label {
        line-height: 24px;
      }
    }
    .checker-group {
      .rel;
      .flex;
      padding: 24/@rem 30/@rem;
      .fz(26);
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 15px;
        right: 0;
        height: 1px;
        border-top: 1px solid #D9D9D9;
        color: #D9D9D9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
      label {
        .abs-center-vertical;
      }
      .vux-checker-box {
        .flex-r(1);
        .vux-checker-item {
          .fr;
          margin-left: 4px;
        }
      }
    }
    .vux-x-input, .address-area, .vux-selector, .vux-cell-box, .vux-x-textarea {
      .fz(26);
    }

    .demo-item {
      border: 1px solid #ececec;
      padding: 4px 15px;
      .borR(4px);
    }

    .demo-item-selected {
      .cdiy(#f34c18);
      border: 1px solid #f34c18;
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
      .bdiy(@c2);
    }
  }

</style>
