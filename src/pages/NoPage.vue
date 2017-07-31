<template>
  <div class="noPage">
    <a class="btn btn-home" href='#/home'>返回首页</a>
  </div>
</template>

<script>
  export default {
    name: 'noPage',
    data () {
      return {
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../static/css/tools.less';

  .noPage {
    width: 100%;
    height: 100%;
    background: #000 url(../../static/img/404.jpg) no-repeat center;
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
  }

  .btn-home {
    .block;
    .abs-center-horizontal;
    bottom: 300/@rem;
    .size(280, 70);
    line-height: 70/@rem;
    font-weight: normal;
    .cf;
    .fz(28);
    .bdiy(#fa0142);
    .borR(5px);
  }

</style>
