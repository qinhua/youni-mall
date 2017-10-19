export default {

  state: {
    name: '全局',
    geoData: null,
    expired: true,
    wxInfo: null,
    userInfo: null,
    dict: null,
    tmpConfirm: null,
    direction: 'forward'
  },

  getters: {
    /*getSth: ()=> {
      return state.name
    }*/
  },

  mutations: {
    getFromDict(state, type) {
      setTimeout(function () {
        for (var i = 0; i < state.dict.length; i++) {
          var cur = state.dict[i]
          if (cur.dictType === type) {
            console.log(cur.items)
            return cur.items
          }
        }
      }, 2000)
    },
    getData(state, payload) {
      if (payload.res.httpStatusCode === 200) {
        state.itemDetail = payload.res.topiclist
      }
    },
    storeData(state, response) {
      state[response['key']] = response.data
    },
    clearData(state, key) {
      state[key] = null
    },
    logout(state) {
      state.wxInfo = null
      state.tmpConfirm = false
      me.locals.remove('ynWxUser')
      me.locals.remove('isFirstConfirm')
    },
    /* 更新路由方向 */
    updateDirection(state, payload) {
      state.direction = payload.direction
    }
  },

  actions: {
    /*checkData ({commit, state}, id) {
      commit('getData', { id })
      if (!state.wxInfo) {
        commit('storeData', {
          key:'wxInfo'
          data: {}
        })
      }
    }*/
  }

}
