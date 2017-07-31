<template>
  <div class="container">
    <group>
      <calendar v-model="demo1" :title="demo1" disable-past></calendar>
    </group>
    <group>
      <calendar v-model="demo2" :title="demo2" disable-past></calendar>
    </group>
    <group>
      <calendar v-model="demo3" :title="demo3" disable-future></calendar>
    </group>
    <group title="auto countdown">
      <cell :title="time+'s'" v-model="value">
        <countdown slot="value" v-model="time" @on-finish="finish" v-show="show"></countdown>
      </cell>
    </group>

    <!-- 这里是被缓存的视图组件，比如 Home！ -->
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
    <keep-alive v-if="!$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  // import $ from 'jquery'
  // import myMixin from 'myMixin'
  import Home from './pages/Home'
  import {Group, Calendar, Cell, Countdown} from 'vux'
  export default {
    name: 'app',
    data () {
      return {
        selected: 1,
        show: true,
        value: 0,
        time: 20,
        demo1: 'TODAY',
        demo2: 'TODAY',
        demo3: 'TODAY'
      }
    },
    components: {Home, Group, Calendar, Cell, Countdown},
    beforeMount () {
      console.log(window.me)
    },
    mounted () {
      // me.attachClick()
    },
    methods: {
      finish (index) {
        this.show = false
        this.value = 'completed'
        console.log('current index', index)
      }
    }
  }
</script>

<style lang='less'>
  @import '../static/css/tools.less';

  .container {
    height: 100%;
    overflow: auto;
  }
</style>
