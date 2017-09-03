<template>
  <div class="address-edit">
    <group>
      <x-input title="收货人：" placeholder="输入姓名" required v-model="params.name"></x-input>
      <x-input title="联系电话：" placeholder="输入电话号码" required v-model="params.phone"></x-input>
      <x-address class="address-area" title="所在地区" @on-hide="logHide" @on-shadow-change="changeArea" :list="addressData"
                 placeholder="请选择地区">
        <template slot="title" scope="props">
        <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
          <span style="vertical-align:middle;">所在地区：</span>
        </span>
        </template>
      </x-address>
      <x-input title="详细地址：" placeholder="输入详细地址" required v-model="detailAddress"></x-input>
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
    <group>
    </group>
    <div class="add-address" @click="updateAddress"><i class="fa fa-save"></i>&nbsp;保存</div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell, XAddress, ChinaAddressV3Data, XInput, Checker, CheckerItem} from 'vux'
  import {userApi} from '../../service/main.js'

  export default {
    name: 'address-edit',
    data() {
      return {
        lastPage: null,
        lineData: null,
        onFetching: false,
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
          defaultAddress: 0
        }
      }
    },
    components: {Group, Cell, XAddress, XInput, Checker, CheckerItem},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
      // vm.params.id = vm.$route.query.id
      vm.getAddress()
    },
    watch: {
      '$route'(to, from) {
        vm.getAddress()
      }
    },
    methods: {
      logHide(str) {
        console.log('on-hide', str)
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
        vm.lastPage = vm.$route.query.from || null
        vm.lineData = vm.$route.query.linedata ? JSON.parse(decodeURIComponent(vm.$route.query.linedata)) : null
        console.log(vm.lineData)
        if (vm.lineData&&vm.lineData.addressId) {
          vm.params = {
            addressId: vm.lineData.addressId,
            name: vm.lineData.name,
            phone: vm.lineData.phone,
            address: vm.lineData.address,
            houseCode: vm.lineData.houseCode,
            defaultAddress: vm.lineData.defaultAddress
          }
        }
        /*if (vm.onFetching) return false
        vm.onFetching = true
        vm.loadData(userApi.addressList, {id: vm.params.id}, 'POST', function (res) {
          if (res) {
            let resD = res.data.itemList
            /!*此处转换一些字段类型*!/
            // a.比如把type和goodsCategory转换成数组
            vm.switchData(vm.types, vm.params.type, 'tmpType')
            vm.switchData(vm.categories, vm.params.category, 'tmpCat')
            vm.renderTags(resD.label)
            vm.goods = resD
            console.log(vm.goods)
          }
          vm.onFetching = false
        }, function () {
          vm.onFetching = false
        })*/
      },
      changeArea(ids, names) {
        console.log(ids, names)
        /*vm.params.province = ids[0]
        vm.params.city = ids[1]*/
        vm.area = names[0] + (names[1].indexOf('市辖区') === -1 ? names[1] : '') + names[2]
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
          /*vm.$store.commit('updateAddress', {data: vm.param, type: 'push'})
          vm.$router.back()*/
          vm.params.address = vm.area + vm.detailAddress
          vm.isPosting = true
          vm.processing()
          console.log('最后选择的数据：', vm.params)
          // 更新还是新增
          vm.loadData(userApi.setAddress, vm.params, 'POST', function (res) {
            console.log(res, '新增/更新地址')
            if(vm.lastPage){
              vm.$router.push({name:vm.lastPage})
            }else{
              vm.$router.back()
            }
            vm.isPosting = false
            vm.processing(0, 1)
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
      .bdiy(#16a542);
    }
  }

</style>
