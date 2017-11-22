<template>
  <div class="aboutus">
    <div class="top">
      <img src="../../../static/img/logo.png" alt="友你生活">
      <h2>- 友你生活 -</h2>
      <p class="intro">
        友你生活是一家集食品研发、销售、技术转让为一身的新型公司。业务范围涵盖水果、蔬菜、预包装食品兼散装食品、乳制品（不含婴幼儿配方乳粉）的批零兼营；日用百货的销售与网上销售；厂房场地租赁；信息系统集成服务；计算机软件开发；互联网信息服务；计算机网络技术服务；会议会展服务；广告设计、制作、安装、代理及发布；餐饮管理；企业管理咨询；企业营销策划。</p>
      <ul class="contact">
        <li><i class="wx"></i>
          <p>官方微信：友你生活（youni-club）</p></li>
        <!--<li><i class="wb"></i>
          <p>官方微博：友你生活</p></li>-->
      </ul>
    </div>
    <div class="bottom">
      <div class="terms">
        <a href="javascript:;">《隐私协议》</a>&nbsp;|&nbsp;<a href="#rules">《服务条款》</a>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  export default {
    name: 'aboutus',
    data () {
      return {}
    },
    beforeMount () {
      // me = window.me
    },
    mounted () {
      // me.attachClick()
    },
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  @import '../../../static/css/tools.less';

  .aboutus {
    .rel;
    min-height: 100%;
    .top {
      padding: 50/@rem 30/@rem 10/@rem;
      .bf;
      > img {
        .block;
        .size(150, 150);
        .ma;
      }
      h2 {
        padding: 20/@rem 0;
        .center;
        .fz(36);
        span {
          .c3;
        }
      }
      .intro {
        padding: 0 20/@rem 40/@rem;
        line-height: 1.5;
        .fz(24);
        .c6;
        .indent;
      }
      .contact {
        margin-top: 30/@rem;
        .bor-t;
        li {
          i {
            .fl;
            .size(30, 30);
            margin: 18/@rem 10/@rem 0 0;
            &.wx {
              background: url(../../../static/img/ico_wx.png);
              .ele-base;
            }
            &.wb {
              background: url(../../../static/img/ico_wb.png);
              .ele-base;
            }
          }
          p {
            height: 66/@rem;
            line-height: 66/@rem;
            margin-left: 16/@rem;
            overflow: hidden;
            .c3;
            .fz(24);
          }
        }
      }
    }
    .bottom {
      .abs-center-horizontal;
      bottom: 0;
      .terms {
        padding: 20/@rem 0;
        .center;
        .cdiy(#f3834b);
        a {
          .iblock;
          .fz(22);
          .cdiy(#f3834b);
        }
      }
    }
  }

</style>
