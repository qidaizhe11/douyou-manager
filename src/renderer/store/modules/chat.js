import * as types from '@/store/mutation-types'
import Api from '@/api'
import Vue from 'vue'

const chat = {
  state: {
    chatList: [],
    start: 0,
    count: 0,
    total: 0,
    chatDetails: {
      /*
      id: {
        id,
        messages: [],
        lastMessageId,
        earliestMessageId,
        lastEarliestMessageId
      }
      */
    },
    activeChatId: ''
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
    },
    [types.GET_CHAT_MESSAGES_SUCCESS](state, { messages, chatId, isAttached }) {
      // state.chatDetails[chatId] = messages
      // state.chatDetail = messages
      const chatDetail = state.chatDetails[chatId]
      let messagesAfterMerge = []
      if (isAttached && chatDetail) {
        messagesAfterMerge = messages.concat(chatDetail.messages)
      } else {
        messagesAfterMerge = messages
      }

      if (chatDetail) {
        if (chatDetail.messages.length > 0) {
          chatDetail.lastEarliestMessageId = chatDetail.messages[0].id
        }
        chatDetail.messages = messagesAfterMerge
      } else {
        Vue.set(state.chatDetails, chatId, {
          id: chatId,
          messages: messagesAfterMerge
        })
      }
    },
    [types.SET_ACTIVE_CHAT_ID](state, chatId) {
      state.activeChatId = chatId
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
    [types.FETCH_GET_CHAT_MESSAGES]({ commit, state }, options) {
      const token = localStorage.getItem('accessToken')
      const isAttached = !!options.earliestMessageId
      Api.fetchGetChatMessages({
        chatId: options.chatId,
        earliestMessageId: options.earliestMessageId,
        count: options.count,
        token
      }).then(data => {
        console.log('fetchGetChatMessages, got data:', data)
        commit(types.GET_CHAT_MESSAGES_SUCCESS, {
          messages: data.messages,
          chatId: options.chatId,
          isAttached
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
  },
  getters: {
    activeChat(state, getters) {
      const chatId = state.activeChatId
      if (!chatId) {
        return
      }

      return state.chatList.find(item => {
        return item.conversation_id === chatId
      })
    },
    activeChatDetail(state, getters) {
      const chatId = state.activeChatId

      if (!chatId || !state.chatDetails[chatId]) {
        return
      }

      return state.chatDetails[chatId]
    }
  }
}

export default chat
