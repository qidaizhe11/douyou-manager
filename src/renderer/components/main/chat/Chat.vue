<template>
  <div class="chat">
    <div class="chat-header-container">
      <div class="header-text">
        {{activeChat && activeChat.target_user.name}}
      </div>
    </div>
    <div class="chat-messages-container" ref="messageListContainer" v-loading.body="isLoading">
      <div class="loading-container" v-show="isLoadingMore">
        <slot name="spinner">
          <i class="loading-default"></i>
        </slot>
      </div>
      <template v-if="messages">
        <template v-for="message in messages">
          <template v-if="message.type === 0">
            <div :class="['message-container', {'message-container-me': message.isMe}]"
                 :ref="'message-' + message.id">
              <div class="avatar-container">
                <img :src="message.author.avatar"/>
              </div>
              <div class="content-container">
                {{message.text}}
              </div>
            </div>
          </template>
          <template v-else-if="message.isTime">
            <div class="time-container">
              {{message.timeStr}}
            </div>
          </template>
        </template>
      </template>
    </div>
    <ChatInput />
  </div>
</template>

<script>
  import {mapGetters, mapState} from 'vuex'
  import Vue from 'vue'
  import _ from 'lodash'
  import { Loading } from 'element-ui'
  import {FETCH_GET_CHAT_MESSAGES_MORE} from 'store/mutation-types'
  import {formatMessageTime} from 'utils/util'

  import ChatInput from './ChatInput'

  Vue.use(Loading.directive)

  export default {
    data() {
      return {
        // isLoading: false
      }
    },
    components: {
      ChatInput
    },
    computed: {
      messages() {
        if (!this.activeChatMessages) {
          return
        }

        const userId = this.userId

//        const messageList = this.activeChatMessages.messageList.slice(
//          this.activeChatMessages.messageList.length - this.activeChatMessages.currentCount)
        const messageList = _.takeRight(this.activeChatMessages.messageList,
          this.activeChatMessages.currentCount)
        let messages = []

        let lastMessageDateTime = null
        let currentGroupedCount = 0
        messageList
          .filter(message => {
            return message.type === 0
          })
          .map(message => {
            if (message.author.id && message.author.id === userId) {
              message.isMe = true
            }

            const timeOfMessage = new Date(message.create_time)

            const timeInterval = timeOfMessage - lastMessageDateTime
            // 间隔超过30秒或者连续条数超过20条，插入时间
            const isInsertTime = !lastMessageDateTime || timeInterval > 40 * 1000 ||
              currentGroupedCount > 18
            if (isInsertTime) {
              messages.push({
                type: 100,
                isTime: true,
                time: timeOfMessage,
                timeStr: formatMessageTime(timeOfMessage)
              })

              currentGroupedCount = 0
            } else {
              ++currentGroupedCount
            }

            messages.push(message)
            lastMessageDateTime = timeOfMessage
          })

        return messages
      },
      isLoading() {
        if (!this.activeChatMessages) {
          return false
        }

        return this.activeChatMessages.isFetching
      },
      isLoadingMore() {
        if (!this.activeChatMessages) {
          return false
        }

        return this.activeChatMessages.isFetchingMore
      },
      isLoadAll() {
        if (!this.activeChatMessages) {
          return false
        }

        return this.activeChatMessages.isLoadAll
      },
      ...mapGetters([
        'activeChat',
        'activeChatMessages'
      ]),
      ...mapState({
        userId: state => state.user.id,
        chatId: state => state.chat.activeChatId
      })
    },
    mounted() {
      this.scrollHandler = function () {
        if (!this.isLoading && !this.isLoadAll) {
          this.attemptLoad()
        }
      }.bind(this)

      const elm = this.$refs.messageListContainer
      elm.addEventListener('scroll', this.scrollHandler)
    },
    activated() {
      const elm = this.$refs.messageListContainer
      elm.addEventListener('scroll', this.scrollHandler)
    },
    deactivated() {
      this.isLoading = false
      const elm = this.$refs.messageListContainer
      elm.removeEventListener('scroll', this.scrollHandler)
    },
    updated() {
      const elm = this.$refs.messageListContainer

      if (!this.activeChatMessages || this.isLoadingMore || this.isLoading) {
        return
      }

      if (this.activeChatMessages.currentPage === 0) {
        elm.scrollTop = elm.scrollHeight
      } else {
        const scrollToMessageId = this.activeChatMessages.scrollToMessageId
        const messageElm = this.$refs['message-' + scrollToMessageId]
        if (scrollToMessageId && messageElm && messageElm.length > 0) {
          elm.scrollTop = messageElm[0].offsetTop - messageElm[0].offsetHeight - 36
          console.log('Chat, updated, messageElm:', messageElm)
        }
      }
    },
    methods: {
      attemptLoad: _.debounce(function () {
        const elm = this.$refs.messageListContainer
        const currentDistance = isNaN(elm.scrollTop) ? elm.pageYOffset : elm.scrollTop
        // const currentDistance = elm.scrollHeight - elm.scrollTop - elm.offsetHeight
        if (currentDistance <= 50) {
          console.log('reach top, need load more.')
          this.onLoadMoreRequest()
        }
      }, 500),
      onLoadMoreRequest() {
        const messages = this.messages
        if (!messages || !messages.length) {
          return
        }

        const earliestMessageId = this.activeChatMessages.earliestMessageId
        this.$store.dispatch(FETCH_GET_CHAT_MESSAGES_MORE, {
          chatId: this.chatId,
          earliestMessageId,
          count: 20
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '~css/variables';

  $background-color: $chat-background-color;
  $message-background-color: $message-background-color;
  $scrollbar-color: $chat-scrollbar-color;

  .chat {
    width: 100%;
    height: 100%;
    background-color: $background-color;

    display: flex;
    flex-direction: column;
  }

  .chat-header-container {
    width: 100%;
    height: 60px;
    border-bottom: 1px solid lightgray;

    padding-left: 15px;

    display: flex;
    align-items: center;

    .header-text {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .chat-messages-container {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    padding: 10px 20px;

    &::-webkit-scrollbar {
      width: 9px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $scrollbar-color;
    }

    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;

    .time-container {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .message-container {
      width: 100%;
      padding: 6px 0;

      display: flex;
      align-items: flex-start;

      &-me {
        flex-direction: row-reverse;
      }

      .avatar-container {
        width: 54px;
        padding-top: 3px;

        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 36px;
          height: 36px;
          object-fit: cover; // border-radius: 100%;
        }
      }

      .content-container {
        max-width: 60%;
        background-color: #fff;
        border-radius: 4px;
        padding: 10px 6px;
        font-size: 14px;
      }

      &-me .content-container {
        background-color: $message-background-color;
      }
    }

    .loading-container {
      width: 100%;
      text-align: center;
    }
  }
</style>
