<template>
  <div class="help-me">
    <ul class="ques-list">
      <li>
        <div class="title"><i>Q：</i>
          <p>我在微信中要如何订水？</p></div>
        <div class="answer">
          <i>A：</i>
          <p>您现在可以直接在友你梦想公众号里订水订奶，优惠多多哦。</p>
        </div>
      </li>
      <li>
        <div class="title"><i>Q：</i>
          <p>不想订水了，押金怎么退？</p></div>
        <div class="answer">
          <i>A：</i>
          <p>目前押金支持用户主动申请退还，您可以在“我的-我的押金”中看到所有押金，点击“退还押金”即可发起退款申请，待后台审核完成即可。</p>
        </div>
      </li>
      <li>
        <div class="title"><i>Q：</i>
          <p>换手机号之后如何重新绑定？</p></div>
        <div class="answer">
          <i>A：</i>
          <p>这个很简单，只需要在微信里面重新使用新手机号绑定就可以了。</p>
        </div>
      </li>
    </ul>
    <div class="bottom">
      <a href="tel:027-5858548">欢迎致电咨询：<span>027-5858548</span></a>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  export default {
    name: 'help',
    data () {
      return {
        address: null
      }
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

  .help-me {
    .rel;
    min-height: 100%;
    .ques-list {
      .borBox;
      padding: 30/@rem;
      .bf;
      span {
        .fz(26);
        .c3;
      }
      li {
        margin-bottom: 10/@rem;
        padding: 20/@rem 0;
        &:not(:last-child) {
          border-bottom: 1px dashed #ddd;
        }
        i {
          .fl;
          .fz(28);
          .fw(600);
          .cdiy(@c2);
        }
        .title {
          overflow: hidden;
          i {
            .cdiy(@c2);
          }

          p {
            overflow: hidden;
            margin-left: 44/@rem;
            .c3;
          }
        }
        .answer {
          padding-top: 20/@rem;
          overflow: hidden;
          i {
            .cdiy(@b1);
          }
          p {
            overflow: hidden;
            margin-left: 44/@rem;
            .c9;
          }
        }

      }
    }
    .bottom {
      .abs-center-horizontal;
      bottom: 0;
      padding: 20/@rem 0;
      .center;
      a {
        .fz(22);
        .c9;
        span {
          .cdiy(#2877f3);
        }
      }
    }
  }

</style>
