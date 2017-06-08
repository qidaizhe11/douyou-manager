import * as types from '@/store/mutation-types'
import Api from '@/api'

const chat = {
  state: {
    chatList: [],
    start: 0,
    count: 0,
    total: 0
  },
  mutations: {
    [types.GET_CHAT_LIST_SUCCESS](state, { chatList, start, count, total }) {
      if (start === 0) {
        state.chatList = chatList
      } else {
        state.chatList.concat(chatList)
      }
      state.start += count
      state.count += count
      state.total = total
    }
  },
  actions: {
    [types.FETCH_GET_CHAT_LIST]({ commit, state }, options) {
      const token = localStorage.getItem('accessToken')
      Api.fetchGetChatList({
        start: options.start,
        count: options.count,
        token
      }).then(data => {
        console.log('fetch_get_chat_list, got data:', data)
        commit(types.GET_CHAT_LIST_SUCCESS, {
          chatList: data.results,
          start: data.start,
          count: data.count,
          total: data.total
        })
      })
    },
    [types.FETCH_GET_FOLLOWING]({ commit, state }, options) {
      const token = localStorage.getItem('accessToken')
      Api.fetchGetFollowing({
        userId: '78709139',
        count: 1000,
        token
      }).then(data => {
        console.log('fetch_get_following, got data:', data)
      })
    },
    [types.FETCH_GET_HOME_TIMELINE]({ commit, state }, options) {
      const token = localStorage.getItem('accessToken')
      Api.fetchGetHomeTimeline({
        token
      }).then(data => {
        console.log('fetch_get_home_timeline, got data:', data)
      })
    },
    [types.FETCH_GET_HAS_NEW_RECS]({ commit, state }, options) {
      const token = localStorage.getItem('accessToken')
      Api.fetchGetHasNewRecs({
        token
      }).then(data => {
        console.log('fetch_get_new_recs, got data:', data)
      })
    }
  }
}

export default chat
