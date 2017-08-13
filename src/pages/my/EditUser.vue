<template>
  <div class="my-edit">
    <group>
      <x-input title="昵称：" placeholder="输入您的昵称" required v-model="nickName"></x-input>
    </group>
    <div class="add-address" @click="updateUser"><i class="fa fa-save"></i>&nbsp;保存</div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell, XInput} from 'vux'
  import {userApi} from '../../store/main.js'

  export default {
    name: 'my-edit',
    data () {
      return {
        onFetching: false,
        isPosting: false,
        userId: null,
        nickName: ''
      }
    },
    components: {Group, Cell, XInput},
    beforeMount () {
      me = window.me
    },
    mounted () {
      vm = this
      // me.attachClick()
      vm.userId = vm.$route.query.userId
      console.log(vm.userId)
    },
    methods: {
      updateUser () {
        if (vm.isPosting) return false
        if (!vm.nickName) {
          vm.toast('请先填写！')
          return false
        }
        vm.isPosting = true
        vm.processing()
        vm.loadData(userApi.updateName, {userId: vm.userId, nickName: vm.nickName}, 'POST', function (res) {
          console.log(res, '修改用户信息')
          this.$store.commit('updateNickName', vm.nickName)
          vm.$router.back()
          vm.isPosting = false
          vm.processing(0, 1)
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

  .my-edit {
    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input {
        padding: 24/@rem 30/@rem;
        .fz(28);
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
