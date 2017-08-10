import Vue from 'vue'
import Vuex from 'vuex'
import globalStore from './modules/global'
import cartStore from './modules/cart'
Vue.use(Vuex)
/* const state = {
}
const getters = {
}
const mutations = {
}
const actions = {
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
}) */

export default new Vuex.Store({
  // 区分不同页面的数据
  modules: {
    global: globalStore,
    cart: cartStore
  }
})
