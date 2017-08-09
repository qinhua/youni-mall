<template>
  <div class="my-address">
    <ul class="address-list">
      <li class="current">
        <h2>七灵<span>13260610021</span></h2>
        <p>在武汉光谷软件园十万八千里深的坑里，遥望月球上两个小姐姐</p>
        <div class="operates">
          <span class="btn btn-setDefault">默认收货地址</span>
          <div class="right">
            <span><i class="fa fa-pencil-square-o"></i>&nbsp;编辑</span>
            <span><i class="fa fa-bitbucket"></i>&nbsp;删除</span>
          </div>
        </div>
      </li>
      <li>
        <h2>天启2<span>15858554545</span></h2>
        <p>在武汉光谷软件园十万八千里深的坑里，遥望月球上两个小姐姐</p>
        <div class="operates">
          <span class="btn btn-setDefault">设为默认</span>
          <div class="right">
            <span><i class="fa fa-pencil-square-o"></i>&nbsp;编辑</span>
            <span><i class="fa fa-bitbucket"></i>&nbsp;删除</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="add-address" @click="addAddress"><i class="fa fa-plus"></i>&nbsp;添加新地址</div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  var me
  var vm
  import {Grid, GridItem, Group, Cell} from 'vux'
  import {userApi} from '../../store/home.js'
  export default {
    name: 'my-address',
    data () {
      return {
        onFetching: false,
        isPosting: false,
        address: null
      }
    },
    components: {Grid, GridItem, Group, Cell},
    beforeMount () {
      me = window.me
    },
    mounted () {
      vm = this
      // me.attachClick()
    },
    computed: {},
    methods: {
      getAddress () {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loading()
        vm.loadData(userApi.orders, vm.params, 'POST', function (res) {
          vm.address = res.data.itemList
          console.log(vm.address, '地址数据')
          vm.isPosting = false
          vm.loading(0, 1)
        }, function () {
          vm.isPosting = false
          vm.loading(0, 1)
        })
      },
      addAddress () {
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.loading()
        vm.loadData(userApi.orders, vm.params, 'POST', function (res) {
          console.log(res.data)
          vm.isPosting = false
          vm.loading(0, 1)
        }, function () {
          vm.isPosting = false
          vm.loading(0, 1)
        })
      },
      updateAddress (id) {
      },
      delAddress (id) {
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
        padding: 20/@rem 20/@rem 0;
        .fz(24);
        .bf;
        &.current {
          .bor-b(2px, solid, @c2);
        }
        h2 {
          .c3;
          span {
            .fr;
          }
        }
        p {
          padding: 20/@rem 0;
          .bor-b;
        }
        .operates {
          overflow: hidden;
          span {
            .iblock;
            padding: 16/@rem 0;
          }
          .btn-setOperate {
            .fl;
            .cdiy(@c2);
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
