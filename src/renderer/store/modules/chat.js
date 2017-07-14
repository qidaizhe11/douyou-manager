import * as types from 'store/mutation-types'
import Api from 'api'
import Vue from 'vue'
import _ from 'lodash'

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
  attachCount: 0,
  isLoadAll: false
}

const initialCachedMessages = {
  chatId: null,
  isFetching: false,
  error: null,
  cachedMessage: '',
  failedMessages: [],
  count: 0
}

const chat = {
  state: {
    chatList: [],
    currentPage: 0,
    currentCount: 0,
    totalCount: 0,
    isLoadAll: false,
    activeChatId: '',
    syncId: 0,
    syncTime: null,
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
        attachCount: 0,
        isLoadAll: false
      }
      */
    },
    cachedMessagesInChat: {
      /*
      chatId: {
       chatId: null,
       isFetching: false,
       error: null,
       cachedMessage: '',
       failedMessages: [],
       count: 0
      }
      */
    }
  },
  mutations: {
    [types.GET_CHAT_LIST_SUCCESS](state, { chatList, requestCount, totalCount }) {
      // if (start === 0) {
      //   state.chatList = chatList
      // } else {
      //   state.chatList.concat(chatList)
      // }

      Object.assign(state, {
        chatList: chatList,
        currentCount: chatList.length,
        currentPage: 0,
        totalCount: totalCount,
        isLoadAll: chatList.length >= totalCount
      })
      // state.start += count
      // state.count += count
      // state.total = total
    },
    [types.GET_CHAT_LIST_MORE_SUCCESS](state, { chatList, requestCount, totalCount }) {
      const newChatList = state.chatList.concat(chatList)

      Object.assign(state, {
        chatList: newChatList,
        currentCount: newChatList.length,
        currentPage: ++state.currentPage,
        totalCount: totalCount,
        isLoadAll: newChatList.length >= totalCount
      })
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
    [types.POST_CHAT_MESSAGE_SUCCESS](state, { chatId, message }) {
      const messages = state.messagesInChat[chatId]

      messages.messageList.push(message)
      Object.assign(messages, {
        currentCount: ++messages.currentCount,
        attachCount: ++messages.attachCount
      })

      const cachedMessages = state.cachedMessagesInChat[chatId]
      if (cachedMessages) {
        cachedMessages.cachedMessage = ''
      }
    },
    [types.SYNC_CHAT_MESSAGE_SUCCESS](state, { syncData, messages }) {
      if (syncData && syncData.id && syncData.id !== state.syncId) {
        state.syncId = syncData.id
        state.syncTime = new Date(syncData.time)
      }

      messages.map((message, i) => {
        const chatId = message.conversation_id
        const chatMessages = state.messagesInChat[chatId]

        if (!chatMessages) {
          return
        }

        if (chatMessages.attachCount > 0) {
          const indexStart = chatMessages.messageList.length - chatMessages.attachCount
          chatMessages.messageList.splice(indexStart, chatMessages.attachCount)
          chatMessages.messageList.push(message)
          Object.assign(chatMessages, {
            currentCount: chatMessages.currentCount - chatMessages.attachCount + 1,
            attachCount: 0,
            latestMessageId: message.id
          })

          return
        }

        chatMessages.messageList.push(message)
        Object.assign(chatMessages, {
          currentCount: ++chatMessages.currentCount,
          latestMessageId: message.id
        })
      })
    },
    [types.READ_CHAT_MESSAGE_SUCCESS](state, { chatId }) {
      const chatListItem = state.chatList.find(item => {
        return item.conversation_id === chatId
      })

      if (chatListItem) {
        chatListItem.unread_count = 0
      }
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
    },
    [types.CACHE_CHAT_MESSAGE](state, { chatId, message }) {
      const messageInfoForAssign = {
        cachedMessage: message
      }
      Vue.set(state.cachedMessagesInChat, chatId, {
        ...initialCachedMessages,
        ...messageInfoForAssign
      })
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
          requestCount: data.count,
          totalCount: data.total
        }, {root: true})
      }).catch(error => {
        commit(types.GET_CHAT_LIST_FAILURE, {error}, {root: true})
      })
    },
    [types.FETCH_GET_CHAT_LIST_MORE]({ commit, state, dispatch }, options) {
      const token = localStorage.getItem('accessToken')

      commit(types.GET_CHAT_LIST_MORE_REQUEST, null, {root: true})

      Api.fetchGetChatList({
        start: state.currentCount,
        count: options.count,
        token
      }).then(data => {
        console.log('fetch_get_chat_list_more, got data:', data)
        commit(types.GET_CHAT_LIST_MORE_SUCCESS, {
          chatList: data.results,
          requestCount: data.count,
          totalCount: data.total
        }, {root: true})
      }).catch(error => {
        commit(types.GET_CHAT_LIST_MORE_FAILURE, {error}, {root: true})
      })
    },
    [types.FETCH_GET_CHAT_MESSAGES_IF_NEEDED]({ dispatch, state, commit }, options) {
      const messages = state.messagesInChat[options.chatId]
      if (messages && messages.messageList.length > 0) {
        commit(types.LOAD_CHAT_MESSAGES, options)

        const latestMessageId = messages.messageList[messages.messageList.length - 1].id
        dispatch(types.FETCH_READ_CHAT_MESSAGE, {
          chatId: options.chatId,
          latestMessageId
        })

        return
      }

      dispatch(types.FETCH_GET_CHAT_MESSAGES, options)
    },
    [types.FETCH_GET_CHAT_MESSAGES]({ commit, state, dispatch }, options) {
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

        if (data.messages && data.messages.length > 0) {
          const latestMessageId = data.messages[data.messages.length - 1].id
          dispatch(types.FETCH_READ_CHAT_MESSAGE, {
            chatId: options.chatId,
            latestMessageId
          })
        }
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
    [types.FETCH_POST_CHAT_MESSAGE]({ commit, state }, { chatId, message }) {
      if (!chatId || !message) {
        return
      }

      const token = localStorage.getItem('accessToken')

      Api.fetchPostChatMessage({
        userId: chatId,
        message,
        token
      }).then(data => {
        console.log('fetchPostChatMessage, got data:', data)
        commit(types.POST_CHAT_MESSAGE_SUCCESS, {
          chatId,
          message: data
        })
      })
    },
    [types.FETCH_SYNC_CHAT_MESSAGE]({ commit, state, dispatch }, options) {
      const token = localStorage.getItem('accessToken')

      Api.fetchSyncChatMessage({
        syncId: state.syncId,
        token
      }).then(data => {
        console.log('fetchSyncChatMessage, got data:', data)

        if (data.total > 0 && data.sync.start_id > 0) {
          dispatch(types.FETCH_GET_CHAT_LIST, {
            start: 0,
            count: 30
          })
        }

        commit(types.SYNC_CHAT_MESSAGE_SUCCESS, {
          syncData: data.sync,
          messages: data.messages
        })

        const activeChatId = state.activeChatId
        if (data.messages) {
          const lastMessageOfActiveChatId = _.findLast(data.messages, item => {
            return item.conversation_id === activeChatId
          })

          if (lastMessageOfActiveChatId) {
            dispatch(types.FETCH_READ_CHAT_MESSAGE, {
              chatId: lastMessageOfActiveChatId.conversation_id,
              lastMessageId: lastMessageOfActiveChatId.id
            })
          }
        }
      })
    },
    [types.FETCH_READ_CHAT_MESSAGE]({ commit, state }, { chatId, lastMessageId }) {
      const messages = state.messagesInChat[chatId]
      if (!lastMessageId) {
        lastMessageId = messages.latestMessageId
      }

      const token = localStorage.getItem('accessToken')

      Api.fetchReadChatMessages({
        userId: chatId,
        lastMessageId,
        token
      }).then(data => {
        commit(types.READ_CHAT_MESSAGE_SUCCESS, {
          chatId
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
    },
    activeCachedChatMessages(state, getters) {
      const chatId = state.activeChatId

      if (!chatId || !state.cachedMessagesInChat[chatId]) {
        return
      }

      return state.cachedMessagesInChat[chatId]
    }
  }
}

export default chat
