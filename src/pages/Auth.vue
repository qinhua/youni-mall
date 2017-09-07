<template>
  <div class="page-auth">
    授权页面
    <div id="userInfo"></div>
  </div>
</template>

<script>
  /* eslint-disable */
  import $ from 'jquery'

  let vm
  let me
  import {Tabbar, TabbarItem} from 'vux'
  import {commonApi} from '../service/main.js'
  // import {mapState, mapMutations} from 'vuex'
  var url = window.decodeURIComponent(window.location.href + (window.location.href.indexOf('?') > -1 ? '&' : '?') + '_=' + Math.random());
  var hashstr = window.decodeURIComponent(window.location.hash);
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
    components: {Tabbar, TabbarItem},
    beforeMount() {
      // console.log(window.me)
    },
    mounted() {
      // me.attachClick()
      vm = this
      let urlParam = me.getURLParams()
      /*window.weixinAuthBase = function(callback, appId, store) {
        try {
          appId = 'wxa92cd39da6d03d8f'; //appId
          var url = decodeURIComponent(window.location.href + (window.location.href.indexOf('?') > -1 ? '&' : '?') + '_=' + Math.random());
          var hashstr = decodeURIComponent(window.location.hash);
          var authObj = {
            appid: appId,
            redirect_uri: url.replace(hashstr, ''),
            response_type: 'code',
            //scope: 'snsapi_base',//静默授权
            scope: 'snsapi_userinfo', //用户确认授权
            state: hashstr.replace('#', '')
          };
          var code = urlParam.code;
        } catch (e) {
          alert(e.message);
        }
        if (!code || code == 'undefined') {
          document.write('正在授权，如果无响应请<a href="javascript:location.reload();">点击刷新</a>');
          location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + authObj.appid + '&redirect_uri=' + window.encodeURIComponent(authObj.redirect_uri) + '&response_type=' + authObj.response_type + '&scope=' + authObj.scope + '&state=' + window.encodeURIComponent(authObj.state) + '#wechat_redirect';
        } else {
          window.location.hash = urlParam.state;
          $.ajax({
            // url: window.location.protocol + '//api.share.m.kakamobi.com/api/open/sign/token.htm',
            //            url: window.location.protocol + '//api-share-m.kakamobi.com/api/open/sign/read-user-info.htm',
            url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + vm.appId + '&secret=' + vm.appSecret + '&code=' + urlParam.code + '&grant_type=authorization_code',
            type: 'get',
            data: {},
            dataType: 'JSON',
            // cache: false,
            // async: false,
            success: function(ret) {
              callback(ret.data);
            },
            error: function(res) {
              callback(res);
            }
          })
        }
      }
      window.weixinAuthBase(function(obj) {
        $("#userInfo").text(JSON.stringify(obj))
      }) */

      // 检测用户是否登录
      if (!me.locals.get('ynWxUser')) {
        if (me.isWeixin) {
          // wx授权页面
          if (urlParam.code) {
            alert('1')
            vm.loadData(commonApi.wxAuth, {code: urlParam.code}, 'POST', function (res) {
              var resD = res.data.authResult ? JSON.parse(res.data.authResult) : null
              alert(JSON.stringify(resD))
              if (resD) {
                // 获取用户信息
                /*$.ajax({
                  url: 'https://api.weixin.qq.com/sns/userinfo',
                  type: 'get',
                  data: {
                    access_token: resD.access_token,
                    openid: resD.openid
                  },
                  dataType: 'JSON'
                  ,
                  // cache: false,
                  // async: false,
                  success: function (res) {
                    alert(JSON.stringify(res))
//                  callback(ret.data);
                  },
                  error: function (res) {
                    alert(JSON.stringify(res))
//                  callback(res);
                  }
                })*/
                location.href = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + resD.access_token + '&openid=' + resD.openid + '&lang=zh_CN'
              }
            }, function (res) {
              alert(JSON.stringify(res))
            })
            // window.location.href = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + vm.appId + '&secret=' + vm.appSecret + '&code=' + urlParam.code + '&grant_type=authorization_code'
          } else {
            alert('2')
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + vm.appId + '&redirect_uri=' + vm.redirect_uri + '&response_type=' + vm.response_type + '&scope=' + vm.scope + '&state=' + vm.state + '#wechat_redirect'
          }
        } else {
          // 外部登录页面
        }
      } else {
        // 如果有token 但是vuex中没有用户登录信息则做登录操作
        this.login()
      }
    },
    computed: {},
    methods: {
      // 从子组件获取数据
      getPageStatus(data) {
        vm.curSelected = data
      },
      login() {
        let url = this.webUrl + '/Wap/User/info'
        // 通过cookie中保存的token 获取用户信息
        this.$http.get(url).then(
          function (response) {
            response = response.body
            console.log(response)
            if (response) {
              // 保存用户登录状态(Vuex)
              this.$store.commit('getUser', response)
              setTimeout(function () {
                this.goBeforeLoginUrl() // 页面恢复(进入用户一开始请求的页面)
              }, 2000)
            } else {
              this.alert('服务器tm撸猫去了 :(', 'wrong')
              if (me.locals.get('ynWxUser')) {
                // 跳转到微信授权页面
                window.location.href = this.webUrl + '/Wap/User/getOpenid'
              }
            }
          })
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
    watch: {
      // '$route' (to, from) {}
    }
  }
</script>

<style scoped lang='less'>
  /* @import '../../static/css/tools.less'; */

  .page-auth {
    height: 100%;
    overflow: hidden;
  }

</style>
