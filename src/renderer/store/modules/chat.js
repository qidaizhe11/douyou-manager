import * as types from 'store/mutation-types'
import Api from 'api'
import Vue from 'vue'

const initialMessages = {
  chatId: null,
  isFetching: false,
  isFetchingMore: false,
  messageList: [],
  currentPage: 0,
  totalCount: 0,
  lastestMessageId: null,
  earliestMessageId: null,
  scrollToMessageId: null,
  unreadCount: 0,
  isLoadAll: false
}

const chat = {
  state: {
    isFetching: false,
    chatList: [],
    currentPage: 0,
    currentCount: 0,
    totalCount: 0,
    messagesInChat: {
      /*
      chatId: {
        chatId,
        isFetching: false,
        isFetchingMore: false,
        messageList: [],
        currentPage: 0,
        totalCount: 0,
        latestMessageId,
        earliestMessageId,
        scrollToMessageId,
        unreadCount: 0,
        isLoadALl: false
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
      // state.start += count
      // state.count += count
      // state.total = total
    },
    [types.GET_CHAT_MESSAGES_SUCCESS](state, { messageList, chatId }) {
      const messages = state.messagesInChat[chatId]

      const messagesInfoForAssign = {
        isFetching: false,
        messageList
      }

      if (messageList.length > 0) {
        messagesInfoForAssign.earliestMessageId = messageList[0].id
        messagesInfoForAssign.lastestMessageId = messageList[messageList.length - 1].id
      }

      if (messages) {
        // state.messages = {...state.messages, ...messagesInfoForAssign}
        Object.assign(messages, messagesInfoForAssign)
      } else {
        Vue.set(state.messagesInChat, chatId, {
          ...initialMessages,
          ...messagesInfoForAssign
        })
      }
    },
    [types.GET_CHAT_MESSAGES_REQUEST](state, { chatId }) {
      Vue.set(state.messagesInChat, chatId,
        Object.assign({}, initialMessages, { chatId, isFetching: true }))
    },
    [types.GET_CHAT_MESSAGES_MORE_REQUEST](state, { chatId }) {
      const messages = state.messagesInChat[chatId]
      messages.isFetchingMore = true
    },
    [types.GET_CHAT_MESSAGES_MORE_SUCCESS](state, { messageList, chatId }) {
      const messages = state.messagesInChat[chatId]

      if (messageList && messageList.length === 0) {
        Object.assign(messages, {
          isFetchingMore: false,
          isLoadAll: true,
          currentPage: ++messages.currentPage
        })

        return
      }

      const messageListNew = messageList.concat(messages.messageList)
      const earliestMessageIdNew = messageList.length > 0
        ? messageList[0].id : messages.earliestMessageId

      Object.assign(messages, {
        isFetchingMore: false,
        messageList: messageListNew,
        scrollToMessageId: messages.earliestMessageId,
        earliestMessageId: earliestMessageIdNew,
        currentPage: ++messages.currentPage
      })
    },
    [types.SET_ACTIVE_CHAT_ID](state, { chatId }) {
      state.activeChatId = chatId
    },
    [types.SET_DISACTIVE_CHAT_ID](state, { chatId }) {
      const messages = state.messagesInChat[chatId]
      if (messages) {
        Object.assign(messages, {
          scrollToMessageId: '',
          currentPage: 0
        })
      }
    }
  },
  actions: {
    [types.FETCH_GET_CHAT_LIST]({ commit, state, dispatch }, options) {
      const token = localStorage.getItem('accessToken')

      commit(types.GET_CHAT_LIST_REQUEST, null, {root: true})

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
        }, {root: true})
      }).catch(error => {
        commit(types.GET_CHAT_LIST_FAILURE, {error}, {root: true})
      })
    },
    [types.FETCH_GET_CHAT_MESSAGES_IF_NEEDED]({ dispatch, state }, options) {
      const messages = state.messagesInChat[options.chatId]
      if (messages && messages.lastestMessageId) {
        return
      }

      dispatch(types.FETCH_GET_CHAT_MESSAGES, options)
    },
    [types.FETCH_GET_CHAT_MESSAGES]({ commit, state }, options) {
      const token = localStorage.getItem('accessToken')
      commit(types.GET_CHAT_MESSAGES_REQUEST, {
        chatId: options.chatId
      })
      Api.fetchGetChatMessages({
        chatId: options.chatId,
        // earliestMessageId: options.earliestMessageId,
        count: options.count,
        token
      }).then(data => {
        console.log('fetchGetChatMessages, got data:', data)
        commit(types.GET_CHAT_MESSAGES_SUCCESS, {
          messageList: data.messages,
          chatId: options.chatId
        })
      })
    },
    [types.FETCH_GET_CHAT_MESSAGES_MORE]({ commit, state }, options) {
      const token = localStorage.getItem('accessToken')
      commit(types.GET_CHAT_MESSAGES_MORE_REQUEST, {
        chatId: options.chatId
      })

      Api.fetchGetChatMessages({
        chatId: options.chatId,
        earliestMessageId: options.earliestMessageId,
        count: options.count,
        token
      }).then(data => {
        console.log('fetchGetChatMessages, got data:', data)
        commit(types.GET_CHAT_MESSAGES_MORE_SUCCESS, {
          messageList: data.messages,
          chatId: options.chatId
        })
      })
    },
    [types.CHANGE_ACTIVE_CHAT_ID]({ commit, state }, { chatId }) {
      const lastActiveChatId = state.activeChatId
      if (lastActiveChatId) {
        commit(types.SET_DISACTIVE_CHAT_ID, { chatId: lastActiveChatId })
      }
      commit(types.SET_ACTIVE_CHAT_ID, { chatId })
    }
    // [types.FETCH_GET_FOLLOWING]({ commit, state }, options) {
    //   const token = localStorage.getItem('accessToken')
    //   Api.fetchGetFollowing({
    //     userId: '78709139',
    //     count: 1000,
    //     token
    //   }).then(data => {
    //     console.log('fetch_get_following, got data:', data)
    //   })
    // },
    // [types.FETCH_GET_HOME_TIMELINE]({ commit, state }, options) {
    //   const token = localStorage.getItem('accessToken')
    //   Api.fetchGetHomeTimeline({
    //     token
    //   }).then(data => {
    //     console.log('fetch_get_home_timeline, got data:', data)
    //   })
    // },
    // [types.FETCH_GET_HAS_NEW_RECS]({ commit, state }, options) {
    //   const token = localStorage.getItem('accessToken')
    //   Api.fetchGetHasNewRecs({
    //     token
    //   }).then(data => {
    //     console.log('fetch_get_new_recs, got data:', data)
    //   })
    // }
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
    activeChatMessages(state, getters) {
      const chatId = state.activeChatId

      if (!chatId || !state.messagesInChat[chatId]) {
        return
      }

      return state.messagesInChat[chatId]
    }
  }
}

export default chat
