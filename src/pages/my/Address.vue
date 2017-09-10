<template>
  <div class="my-address">
    <ul class="address-list">
      <li :class="item.defaultAddress?'current':''" v-for="(item, index) in list" :key="index">
        <div class="top">
          <h2>{{item.name}}<span>{{item.phone}}</span></h2>
          <p>{{item.address}}</p>
        </div>
        <div class="operates">
          <span class="btn btn-set" v-if="item.defaultAddress">默认收货地址&nbsp;<i class="fa fa-check-circle"></i></span>
          <span class="btn btn-set" v-else @click="setDefault(item.id)">设为默认</span>
          <div class="right">
            <span :data-id="item.addressId" @click="updateAddress(item.id)"><i class="fa fa-pencil-square-o"></i>&nbsp;编辑</span>
            <span @click.stop="delAddress(item.id)"><i class="fa fa-bitbucket"></i>&nbsp;删除</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="iconNoData abs-center-vh" v-if="!list.length"><i></i><p>空空如也</p></div>
    <div class="add-address" @click="addAddress"><i class="fa fa-plus"></i>&nbsp;添加新地址</div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Grid, GridItem, Group, Cell} from 'vux'
  import {userApi} from '../../service/main.js'

  export default {
    name: 'my-address',
    data() {
      return {
        lastPage: {
          name: '',
          data: null
        },
        isPosting: false,
        list: []
      }
    },
    components: {Grid, GridItem, Group, Cell},
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
    computed: {},
    watch: {
      '$route'(to, from) {
        if(to.name==='myaddress'){
          vm.getAddress()
        }
      }
    },
    methods: {
      getAddress() {
        vm.processing()
        vm.lastPage.name = vm.$route.query.from || ''
        if (vm.lastPage.name === 'confirm_order') {
          vm.lastPage.data = me.sessions.get('ynTmpConfirm')
        }
        vm.loadData(userApi.addressList, null, 'POST', function (res) {
          vm.list = res.data.itemList
          // console.log(vm.list, '地址数据')
          vm.processing(0, 1)
        }, function () {
          vm.processing(0, 1)
        })
      },
      setDefault(id) {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.processing()
        vm.loadData(userApi.setDefaultAddress, {addressId: id, defaultAddress: 1}, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          vm.getAddress()
          if (vm.lastPage.name) {
            vm.jump(vm.lastPage.name, {thedata: vm.lastPage.data})
          }
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      },
      addAddress() {
        if (vm.lastPage.name) {
          vm.jump('edit_address', {from: vm.lastPage.name})
        } else {
          vm.jump('edit_address')
        }
      },
      updateAddress(id) {
        for (let i = 0; i < vm.list.length; i++) {
          if (id === vm.list[i].id) {
            vm.$router.push({
              name: 'edit_address',
              query: {from: vm.lastPage.name, linedata: encodeURIComponent(JSON.stringify(vm.list[i]))}
            })
          }
        }
      },
      delAddress(id) {
        if (vm.isPosting) return false
        vm.confirm('确认删除？', '删除后只能重新添加了！', function () {
          vm.processing()
          vm.isPosting = true
          vm.loadData(userApi.delAddress, {addressId: id}, 'POST', function (res) {
            vm.getAddress()
            vm.isPosting = false
            vm.processing(0, 1)
          }, function () {
            vm.isPosting = false
            vm.processing(0, 1)
            vm.toast('删除失败！')
          })
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../../static/css/tools.less';

  .my-address {
    padding-bottom: 60px;
    .add-address {
      .fix;
      bottom: 0;
      width: 100%;
      .ma-w(640);
      .borBox;
      padding: 24/@rem;
      .center;
      .cf;
      .fz(28);
      .bdiy(@c2);
    }
    .address-list {
      li {
        .borBox;
        margin-bottom: 16/@rem;
        .fz(24);
        .bf;
        &.current {
          .bor-b(2px, solid, @c2);
          .operates .btn-set {
            .cdiy(@c2);
            .no-bor;
            .borR(0);
          }
        }
        .top {
          padding: 20/@rem;
        }
        h2 {
          .c3;
          span {
            .fr;
          }
        }
        p {
          padding: 20/@rem 0;
        }
        .operates {
          .rel;
          padding: 0 20/@rem;
          overflow: hidden;
          .bor-t;
          span {
            .iblock;
            padding: 16/@rem 0;
          }
          .btn-set {
            .abs-center-vertical;
            padding: 5/@rem 20/@rem;
            .c3;
            .fz(20);
            .bor(1px, solid, #ddd);
            .borR(80px)
          }
          .right {
            .fr;
            span {
              margin-left: 20/@rem;
            }
          }
        }
      }
    }
  }

</style>
