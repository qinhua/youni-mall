import $ from 'jquery'
export default {

  state: {
    nickName: '七灵',
    name: '全局',
    direction: 'forward',
    level: '第一周',
    itemNum: 1,
    allTime: 0,
    timer: '',
    itemDetail: [],
    answerid: {},
    userInfo: {
      id: 'xxxxxxx',
      // id: '',
      name: ''
    }
  },

  getters: {
  },

  mutations: {
    getData (state, payload) {
      if (payload.res.httpStatusCode === 200) {
        state.itemDetail = payload.res.topiclist
      }
    },
    getUser (state, payload) {
      state.userInfo = payload
    },
    addTimeNum (state, payload) {
      state.itemNum += payload.num
    },
    rememberAnswer (state, payload) {
      state.answerid[state.itemNum] = payload.id
    },
    rememberTime (state) {
      state.timer = setInterval(() => {
        state.allTime++
      }, 1000)
    },
    /* 更新路由方向 */
    updateDirection (state, payload) {
      state.direction = payload.direction
    },
    updateNickName (state, payload) {
      state.nickName = payload
    },
    initialData (state) {
      state.itemNum = 1
      state.allTime = 0
    }
  },

  actions: {
    addNum ({commit, state}, id) {
      commit('rememberAnswer', { id })
      if (state.itemNum < state.itemDetail.length) {
        commit('addTimeNum', {
          num: 1
        })
      }
    },
    getData ({commit, state}) {
      $.ajax('GET', 'http://operating-activities.putao.com/happyfriday?active_topic_id=4').then(res => {
        commit('getData', {
          res
        })
      })
    },
    initializeData ({commit}) {
      commit('initialData')
    }
  }

}
