<template>
  <div class="my-address">
      <div class="add-address"><span><i class="fa fa-plus"></i>添加新地址</span></div>
      <group class="address-list">
        <cell title="家庭地址" link="/pages/my/RedPocket">
          <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-pencil-square-o"></i>
          10
        </cell>
        <cell title="公司地址" link="/pages/my/MyCoupons">
          <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-credit-card"></i>
          3
        </cell>
      </group>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  var me
  var vm
  import {Grid, GridItem, Group, Cell} from 'vux'
  export default {
    name: 'my-address',
    data () {
      return {
        address: null
      }
    },
    components: {Grid, GridItem, Group, Cell},
    beforeMount () {
      me = window.me
    },
    mounted () {
      // me.attachClick()
    },
    computed: {
    },
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';
  .my-address{
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
