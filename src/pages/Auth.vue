<template>
  <div class="page-auth">
    授权页面
    <div id="userInfo"></div>
  </div>
</template>

<script>
  /* eslint-disable */
  let vm
  let me
  import {commonApi} from '../service/main.js'
  // import {mapState, mapMutations} from 'vuex'
  let url = window.decodeURIComponent(window.location.href + (window.location.href.indexOf('?') > -1 ? '&' : '?') + '_=' + Math.random());
  let hashstr = window.decodeURIComponent(window.location.hash);
  export default {
    name: 'auth',
    data() {
      return {
        appId: 'wxa92cd39da6d03d8f',
        appSecret: 'b6540309f545879b1b33fc8b95fc4f70',
        redirect_uri: window.encodeURIComponent(url.replace(hashstr, '')),
        // redirect_uri: window.encodeURIComponent('https://www.youni.club/yn/youni-mall/#/author'),
        response_type: 'code',
        //scope: 'snsapi_base', // 静默授权
        scope: 'snsapi_userinfo', // 用户确认授权
        state: window.encodeURIComponent(hashstr.replace('#', ''))
      }
    },
    created() {
      me = window.me
    },
    mounted() {
      vm = this
      // 检测用户是否登录
//      if (vm.$store.state.global.wxInfo) {

        if (me.isWeixin) {
          // wx授权页面
          vm.getWxInfo(function (info) {
            /* 保存用户信息 */
            vm.addUser(info)
            me.locals.set('ynWxUser', JSON.stringify({data: info, timeStamp: new Date().getTime()}))
            // alert(JSON.stringify(info))
            vm.$router.push({path: '/home'})
          })
        } else {
          // 外部登录页面
          // location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=123456&connect_redirect=1#wechat_redirect'

          /*测试专用*/
          var info={
               'city': '武汉',
               'country': '中国',
               'errorCode': 0,
               'errorMessage': null,
               'headimgurl': 'http://wx.qlogo.cn/mmopen/QAm7hEbaujS41jY5T0icQd9ySS9FaRJibTiclJGyysBmLoFmswkhLemAHAibYOQml4hibx3BqD2u8NRIwrAhTyeLgjavI70oxia8uk/0',
               'nickname': '覃华',
               'openid': 'oGnE80ixTvBXjQ_Dql0BcTlx',
               'privilege': [],
               'province': '湖北',
               'sex': '1',
               'subscribe': 0,
               'subscribeTime': null,
               'unionid': null
             }
          me.locals.set('ynWxUser', JSON.stringify({data: info, timeStamp: new Date().getTime()}))
          vm.$router.push({path: '/home'})
        }

      /*} else {
        vm.$router.push({path: '/home'})
      }*/
    },
    computed: {},
    methods: {
      /* 添加当前用户 */
      addUser(data) {
        vm.loadData(commonApi.addUser, data, 'POST', function (res) {
        }, function () {
        })
      },
      // 01.拉取wx用户信息
      getWxInfo(cb) {
        let urlParam = me.getURLParams()
        if (urlParam.code) {
          vm.loadData(commonApi.wxAuth, {code: urlParam.code}, 'POST', function (res) {
            if (res.success) {
              cb ? cb(res.data || null) : null
            } else {
              me.lightPop('拉取用户信息失败！')
              cb ? cb(null) : null
            }
          }, function (res) {
            me.lightPop('拉取用户信息失败！')
            // alert(JSON.stringify(res))
          })
          // window.location.href = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + vm.appId + '&secret=' + vm.appSecret + '&code=' + urlParam.code + '&grant_type=authorization_code'
          // location.href = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + resD.access_token + '&openid=' + resD.openid + '&lang=zh_CN'
        } else {
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + vm.appId + '&redirect_uri=' + vm.redirect_uri + '&response_type=' + vm.response_type + '&scope=' + vm.scope + '&state=' + vm.state + '#wechat_redirect'
        }
      },
      // 02.wx外部登录
      login() {
      },
      goBeforeLoginUrl() {
        let url = me.locals.get('beforeLoginUrl')
        if (!url || url.indexOf('/author') !== -1) {
          this.$router.push({path: '/home'})
        } else {
          this.$router.push({path: url})
          me.locals.set('beforeLoginUrl', '')
        }
      }
    },
    /*watch: {
       '$route' (to, from) {}
    }*/
  }
</script>

<style scoped lang='less'>
  /* @import '../../static/css/tools.less'; */

  .page-auth {
    height: 100%;
    overflow: hidden;
  }

</style>
