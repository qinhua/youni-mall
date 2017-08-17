import $ from 'jquery'
export default {

  state: {
    nickName: '七灵',
    userId: 'vv58585',
    name: '全局',
    address: [
      {
        id: 1,
        name: '七灵',
        phone: 13260610021,
        address: '在武汉光谷软件园十万八千里深的坑里，遥望月球上两个小姐姐',
        isCurrent: true
      },
      {
        id: 3,
        name: '天启2',
        phone: 13260610021,
        address: '爱情对我来说就像龙卷风，像大多数人一样从来没见过',
        isCurrent: false
      }
    ],
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
    updateAddress (state, payload) {
      if (payload.type && payload.type === 'push') {
        state.address.push(payload.data)
      } else {
        state.address = payload.data
      }
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
