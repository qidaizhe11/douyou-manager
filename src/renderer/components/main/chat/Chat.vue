<template>
  <div class="chat">
    <div class="chat-header-container">
      <div class="header-text">
        {{activeChat && activeChat.target_user.name}}
      </div>
    </div>
    <div class="chat-history-container" ref="messageListContainer">
      <template v-if="messages">
        <template v-for="message in messages" v-if="message.type === 0">
          <div :class="['message-container', {'message-container-me': message.isMe}]" :ref="'message-' + message.id">
            <div class="avatar-container">
              <img :src="message.author.avatar" />
            </div>
            <div class="content-container">
              {{message.text}}
            </div>
          </div>
        </template>
      </template>
    </div>
    <div class="chat-edit-container">
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import _ from 'lodash'
import { FETCH_GET_CHAT_MESSAGES } from '@/store/mutation-types'

export default {
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    messages() {
      if (!this.activeChatDetail) {
        return
      }

      const userId = this.userId

      return this.activeChatDetail.messages.map(message => {
        if (message.author.id && message.author.id === userId) {
          message.isMe = true
        }
        return message
      })
    },
    ...mapGetters([
      'activeChat',
      'activeChatDetail'
    ]),
    ...mapState({
      userId: state => state.user.id,
      chatId: state => state.chat.activeChatId
    })
  },
  mounted() {
    this.scrollHandler = function () {
      // if (!this.isLoading) {
      this.attemptLoad()
      // }
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

    if (!this.activeChatDetail) {
      return
    }

    const lastEarliestMessageId = this.activeChatDetail.lastEarliestMessageId
    const messageElm = this.$refs['message-' + lastEarliestMessageId]
    if (lastEarliestMessageId && messageElm && messageElm.length > 0) {
      elm.scrollTop = messageElm[0].offsetTop - messageElm[0].offsetHeight
      console.log('Chat, updated, messageElm:', messageElm)

      console.log('Chat, updated, scrollTop here:', elm.scrollTop)
    }
  },
  methods: {
    attemptLoad: _.debounce(function () {
      const elm = this.$refs.messageListContainer
      const currentDistance = isNaN(elm.scrollTop) ? elm.pageYOffset : elm.scrollTop
      // const currentDistance = elm.scrollHeight - elm.scrollTop - elm.offsetHeight
      if (currentDistance <= 50) {
        this.isLoading = true
        console.log('reach top, need load more.')
        // this.onLoadMore()
        this.onLoadMoreRequest()
      } else {
        this.isLoading = false
      }
    }, 500),
    onLoadMoreRequest() {
      const messages = this.messages
      if (!messages || !messages.length) {
        return
      }

      const earliestMessageId = messages[0].id
      this.$store.dispatch(FETCH_GET_CHAT_MESSAGES, {
        chatId: this.chatId,
        earliestMessageId,
        count: 20
      })
    }
  },
  watch: {
    chatId() {
      this.$nextTick(() => {
        // this.lastEarliestMessageId = ''
        const container = this.$refs.messageListContainer
        container.scrollTop = container.scrollHeight
      })
    }
  }
}
</script>

<style lang="scss">
.chat {
  width: 100%;
  height: 100%;
  background-color: azure;

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

.chat-history-container {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding: 10px 20px;

  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;

  .message-container {
    width: 100%;
    padding: 6px 0;

    display: flex;
    align-items: flex-start;

    &-me {
      flex-direction: row-reverse;
    }

    .avatar-container {
      width: 60px;
      padding-top: 3px;

      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 36px;
        height: 36px;
        object-fit: cover;
      }
    }

    .content-container {
      max-width: 60%;
      background-color: lighten(#09bb07, 10%);
      padding: 10px 6px;
    }
  }
}

.chat-edit-container {
  width: 100%;
  height: 150px;
  border-top: 1px solid lightgray;
}
</style>
