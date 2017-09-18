<template>
  <div class="appraise-con" v-cloak>
    <group class="bottom">
      <cell title="星级：" class="rater">
        <rater v-model="params.score" slot="value"></rater>
      </cell>
      <x-textarea title="评价内容：" :max="200" placeholder="一些想对店家说的话…" @on-blur="" v-model="params.content"
                  show-clear></x-textarea>
    </group>
    <div class="btn btn-save" @click="score"><i class="fa fa-save"></i>&nbsp;保存</div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell, Rater, XTextarea} from 'vux'
  import {orderApi} from '../../service/main.js'

  export default {
    name: 'appraise-con',
    data() {
      return {
        isPosting: false,
        params: {
          app_order_number: null,
          score: 0,
          content: ''
        }
      }
    },
    components: {Group, Cell, Rater, XTextarea},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.params.app_order_number = vm.$route.query.id || null
    },
    watch: {
      '$route'(to, from) {
        if (to.name === 'appraise') {
          vm.params.app_order_number = vm.$route.query.id || null
        }
      }
    },
    methods: {
      score() {
        if (!vm.params.score) {
          vm.toast('请选择星级！')
          return false
        }
        /*if (!vm.params.content) {
         vm.toast('请填写评价内容！')
         return false
         }*/
        /*if (vm.isPosting) return false
        vm.isPosting = true
        vm.processing()
        vm.loadData(orderApi.score, vm.params, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          if (res.success) {*/
            vm.toast('评价成功！')
            vm.$router.back()
          /*} else {
            vm.toast(res.data || '评价失败！')
          }
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })*/
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .appraise-con {
    .vux-no-group-title {
      margin-top: 0;
      .vux-x-input, .weui-cell {
        padding: 24/@rem 30/@rem;
        input {
          .ellipsis;
        }
      }
      .weui-textarea {
        height: 150px;
      }
      .rater, .vux-x-input, .vux-cell-box, .vux-x-textarea {
        .fz(26);
      }
    }
    .btn-save {
      .fix;
      bottom: 0;
      z-index: 20;
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
