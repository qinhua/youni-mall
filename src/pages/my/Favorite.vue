<template>
  <div class="my-favorite">
    <!--<group title="switch the type">-->
      <!--<radio title="type" v-model="type" :options="['1', '2', '3', '4', '5']"></radio>-->
    <!--</group>-->
    <panel header="收藏的商品" :footer="footer" :list="list" :type="type"></panel>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  var me
  var vm
  import {Group, Cell, Panel, Radio} from 'vux'
  import {userApi} from '../../store/home.js'
  export default {
    name: 'my-favorite',
    data () {
      return {
        address: null,
        onFetching: false,
        isPosting: false,
        type: '1',
        list: [{
          src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
          title: '好水，好喝的水',
          desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
          url: '/component/cell'
        }, {
          src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
          title: '好奶好生活，想念你味道',
          desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
          url: {
            path: '/component/radio',
            replace: false
          },
          meta: {
            source: '来源信息',
            date: '时间',
            other: '其他信息'
          }
        }]
//        footer: {
//          title: '查看更多',
//          url: 'http://vux.li'
//        }
      }
    },
    components: {Group, Cell, Panel, Radio},
    beforeMount () {
      me = window.me
    },
    mounted () {
      // me.attachClick()
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../../static/css/tools.less';
  .my-favorite{
    padding-bottom: 60px;
    .add-address{
      .borBox;
      padding:30/@rem;
      .center;
      .bf;
      /*background:#5c70ff url(../../../static/img/bg_av.jpg);
      .bg100;*/
      span{
        .fz(26);
        .c3;
      }
    }
    .address-list{
      .weui-cells{
        margin-top:10/@rem;
        padding: 0;
      }
      .weui-cell{
        padding:20/@rem 30/@rem!important;
        .rfz(14)!important;
      }
    }
  }

</style>
