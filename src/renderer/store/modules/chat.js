import * as types from 'store/mutation-types'
import Api from 'api'
import Vue from 'vue'

const initialMessages = {
  chatId: null,
  isFetching: false,
  isFetchingMore: false,
  error: null,
  messageList: [],
  currentPage: 0,
  currentCount: 0,
  latestMessageId: null,
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
        chatId: null,
        isFetching: false,
        isFetchingMore: false,
        error: null,
        messageList: [],
        currentPage: 0,
        currentCount: 0,
        latestMessageId: null,
        earliestMessageId: null,
        scrollToMessageId: null,
        unreadCount: 0,
        isLoadAll: false
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
    [types.GET_CHAT_MESSAGES_SUCCESS](state, { messageList, chatId, requestCount }) {
      const messages = state.messagesInChat[chatId]

      const messagesInfoForAssign = {
        isFetching: false,
        messageList,
        currentCount: messageList.length
      }

      if (messageList.length > 0) {
        messagesInfoForAssign.earliestMessageId = messageList[0].id
        messagesInfoForAssign.latestMessageId = messageList[messageList.length - 1].id
      }

      if (messageList.length < requestCount) {
        messagesInfoForAssign.isLoadAll = true
      }

      if (messages) {
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
    [types.GET_CHAT_MESSAGES_MORE_SUCCESS](state, { messageList, chatId, requestCount }) {
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
        currentPage: ++messages.currentPage,
        currentCount: messageListNew.length
      })

      if (messageList.length < requestCount) {
        messages.isLoadAll = true
      }
    },
    [types.LOAD_CHAT_MESSAGES](state, { chatId, count }) {
      const messages = state.messagesInChat[chatId]
      const messageLength = messages.messageList.length

      if (messageLength <= 0) {
        return
      }

      const currentCountNew = messageLength > count ? count : messageLength
      const earliestMessageIdNew = messages.messageList[messageLength - currentCountNew].id

      Object.assign(messages, {
        currentPage: 0,
        currentCount: currentCountNew,
        earliestMessageId: earliestMessageIdNew,
        latestMessageId: messages.messageList[messageLength - 1].id,
        scrollToMessageId: '',
        isLoadAll: false
      })
    },
    [types.LOAD_CHAT_MESSAGES_MORE](state, { chatId, count }) {
      const messages = state.messagesInChat[chatId]
      const messageLength = messages.messageList.length

      const remainCount = messages.messageList.length - messages.currentCount

      const currentCountNew = messages.currentCount + (remainCount > count ? count : remainCount)

      const earliestMessageIdNew = messages.messageList[messageLength - currentCountNew].id

      Object.assign(messages, {
        currentPage: ++messages.currentPage,
        currentCount: currentCountNew,
        earliestMessageId: earliestMessageIdNew,
        scrollToMessageId: messages.earliestMessageId
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
          currentPage: 0,
          currentCount: 0,
          earliestMessageId: '',
          latestMessageId: ''
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
    [types.FETCH_GET_CHAT_MESSAGES_IF_NEEDED]({ dispatch, state, commit }, options) {
      const messages = state.messagesInChat[options.chatId]
      if (messages && messages.messageList.length > 0) {
        commit(types.LOAD_CHAT_MESSAGES, options)

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
          chatId: options.chatId,
          requestCount: options.count
        })
      })
    },
    [types.FETCH_GET_CHAT_MESSAGES_MORE]({ commit, state }, options) {
      const chatId = options.chatId || ''
      const messages = state.messagesInChat[chatId]

      if (messages.currentCount < messages.messageList.length) {
        commit(types.LOAD_CHAT_MESSAGES_MORE, { chatId, count: options.count })

        return
      }

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
          chatId: options.chatId,
          requestCount: options.count
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
