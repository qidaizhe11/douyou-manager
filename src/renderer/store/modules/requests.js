
import * as types from 'store/mutation-types'

const requests = {
  state: {
    chat: {
      getChatList: {
        status: 'idle',
        isFetching: false,
        error: null
      },
      getChatListMore: {
        status: 'idle',
        isFetching: false,
        error: null
      },
      getChatMessages: {
        status: 'idle',
        isFetching: false,
        error: null
      },
      getChatMessagesMore: {
        status: 'idle',
        isFetching: false,
        error: null
      }
    }
  },
  mutations: {
    [types.GET_CHAT_LIST_REQUEST] (state) {
      state.chat.getChatList.isFetching = true
    },
    [types.GET_CHAT_LIST_FAILURE] (state, {error}) {
      Object.assign(state.chat.getChatList, {
        isFetching: false,
        error
      })
    },
    [types.GET_CHAT_LIST_SUCCESS] (state) {
      Object.assign(state.chat.getChatList, {
        isFetching: false,
        error: null
      })
    },
    [types.GET_CHAT_LIST_MORE_REQUEST] (state) {
      Object.assign(state.chat.getChatListMore, {
        isFetching: true
      })
    },
    [types.GET_CHAT_LIST_MORE_FAILURE] (state, {error}) {
      Object.assign(state.chat.getChatListMore, {
        isFetching: false,
        error
      })
    },
    [types.GET_CHAT_LIST_MORE_SUCCESS] (state) {
      Object.assign(state.chat.getChatListMore, {
        isFetching: false,
        error: null
      })
    }
  }
}

export default requests
