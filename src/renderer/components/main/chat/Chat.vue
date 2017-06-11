<template>
  <div class="chat">
    <div class="chat-header-container">
      <div class="header-text">
        {{activeChat && activeChat.target_user.name}}
      </div>
    </div>
    <div class="chat-history-container" ref="historyContainer">
      <template v-if="chatDetail">
        <template v-for="message in chatDetail" v-if="message.type === 0">
          <div :class="['message-container', {'message-container-me': message.isMe}]">
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

export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'activeChat',
      'activeChatDetail'
    ]),
    ...mapState({
      userId: state => state.user.id,
      chatId: state => state.chat.activeChatId,
      // chatDetail: state => state.chat.chatDetail
      chatDetail: state => {
        const chatDetail = state.chat.chatDetail
        if (!chatDetail) {
          return
        }

        return chatDetail.map(item => {
          if (item.author.id && item.author.id === state.user.id) {
            item.isMe = true
          }
          return item
        })
      }
    })
  },
  watch: {
    chatDetail() {
      this.$nextTick(() => {
        const container = this.$refs.historyContainer
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
