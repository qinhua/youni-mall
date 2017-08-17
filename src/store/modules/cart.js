export default {
  // state
  state: {
    name: '购物车',
    show: false,
    count: 0
  },
  // 相当于vue中的computed
  getters: {
    notShow (state) {
      // 这里的state对应着上面的state
      return !state.show
    }
  },
  // 一些方法
  mutations: {
    updateCart (state, data) {
      // 这里的state对应着上面的state
      state.count = data
    }
  },
  // 一次可执行多个方法
  actions: {
    switchDialog (context) {
      // 这里的context和我们使用的$store拥有相同的对象和方法
      context.commit('switchDialog')
      // 你还可以在这里触发其他的mutations方法
    }
  }
}
