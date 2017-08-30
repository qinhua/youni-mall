import {cartApi} from '../../service/main.js'
export default {
  // state
  state: {
    name: '购物车',
    show: false,
    count: 0,
    cartData: [],
    total: 0
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
    checkCart (state, data) {
      console.log(data)
      var tmp = {goodsId: data.id, goodsNum: data.value}
      if (state.cartData.length) {
        for (var i = 0; i < state.cartData.length; i++) {
          if (data.id === state.cartData[i].goodsId) {
            console.log('有同款商品')
            /*数量为零时移除商品*/
            if (data.value <= 0) {
              state.cartData.splice(i, 1)
              state.cartData[i].count = 0
            }
            /*数量不为零时更新购物车*/
            delete state.cartData[i].goodsNum
            state.cartData[i].count = data.value

            window.loadData(cartApi.update, state.cartData[i], 'POST', function (res) {
            }, function () {
            })
          } else {
            state.cartData.push({id: data.id, number: data.value})
            /*添加购物车*/
            window.loadData(cartApi.add, state.cartData[i], 'POST', function (res) {
            }, function () {
            })
          }
        }
      } else {
        state.cartData.push(tmp)
        /*添加购物车*/
        window.loadData(cartApi.add, tmp, 'POST', function (res) {
        }, function () {
        })
      }
      console.log(JSON.stringify(state.cartData, null, 2), 774744)
    },
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
