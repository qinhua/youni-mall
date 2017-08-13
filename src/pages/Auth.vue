<template>
  <div class="page-auth">
    授权页面
  </div>
</template>

<script>
  /* eslint-disable */
  // import $ from 'jquery'
  let vm
  import {Tabbar, TabbarItem} from 'vux'
  // import {mapState, mapMutations} from 'vuex'
  export default {
    name: 'auth',
    data () {
      return {
        webUrl: 'http://www.baidu.com'
      }
    },
    created () {
      // 检测会员有没有登录
      if(!me.locals.get('ynWxUser')){
        if(me.isWeixin){
          // wx授权页面
          window.location.href = this.webUrl + '/Wap/User/getOpenid'
        }else{
          // 外部登录页面
        }
      }else{
        // 如果有token 但是vuex中没有用户登录信息则做登录操作
        this.login()
      }
    },
    components: {Tabbar, TabbarItem},
    beforeMount () {
      // console.log(window.me)
    },
    mounted () {
      // me.attachClick()
      vm = this
    },
    computed: {
    },
    methods: {
      // 从子组件获取数据
      getPageStatus (data) {
        vm.curSelected = data
      },
      login () {
        let url = this.webUrl + '/Wap/User/info'
        // 通过cookie中保存的token 获取用户信息
        this.$http.get(url).then(response => {
          response = response.body
          console.log(response)
          if(response){
            // 保存用户登录状态(Vuex)
            this.$store.commit('getUser', response)
            setTimeout(() => {
              this.goBeforeLoginUrl() // 页面恢复(进入用户一开始请求的页面)
            }, 2000)
          }else{
            this.alert('服务器tm撸猫去了 :(', 'wrong')
            if(me.locals.get('ynWxUser')){
              // 跳转到微信授权页面
              window.location.href = this.webUrl + '/Wap/User/getOpenid'
            }
          }
        })
      },
      goBeforeLoginUrl () {
        let url = me.locals.get('beforeLoginUrl')
        if(!url || url.indexOf('/author') !== -1){
          this.$router.push({path: '/home'})
        }else{
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
