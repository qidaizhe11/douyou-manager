<template>
  <div :class="{'chat-edit-container': true, 'active': isActive}"
       @click="onEditContainerClick">
    <!--<div class="top-container"></div>-->
    <div class="edit-container">
        <textarea class="edit-textarea" ref="editTextarea" rows="3"
                  :value="cachedMessage" @blur="onTextareaBlur"
                  @focus="onTextareaFocus" @input="onValueInput">
        </textarea>
    </div>
    <div class="bottom-container">
      <el-button class="send-button" :plain="true" type="success" @click="onSendButtonClick">
        发送
      </el-button>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import Vue from 'vue'
  import { Button } from 'element-ui'

  import { FETCH_POST_CHAT_MESSAGE, CACHE_CHAT_MESSAGE } from 'store/mutation-types'

  Vue.use(Button)

  export default {
    data() {
      return {
        isActive: false,
        value: ''
      }
    },
    computed: {
      cachedMessage() {
        if (!this.activeCachedChatMessages) {
          return ''
        }

        return this.activeCachedChatMessages.cachedMessage || ''
      },
      ...mapState({
        chatId: state => state.chat.activeChatId
      }),
      ...mapGetters([
        'activeCachedChatMessages'
      ])
    },
    methods: {
      onEditContainerClick() {
        this.focusInputTextarea()
      },
      onValueInput(e) {
        console.log('ChatInput, onValueInput, e:', e, 'value:', e.target.value)

//        this.value = e.target.value
        const inputValue = e.target.value
        if (this.chatId) {
          this.$store.commit(CACHE_CHAT_MESSAGE, {
            chatId: this.chatId,
            message: inputValue
          })
        }
      },
      onSendButtonClick() {
        console.log('ChatInput, onSendButtonClick, value:', this.cachedMessage)

        if (this.cachedMessage && this.chatId) {
          this.$store.dispatch(FETCH_POST_CHAT_MESSAGE, {
            chatId: this.chatId,
            message: this.cachedMessage
          })
        }
      },
      onTextareaBlur() {
        this.isActive = false
      },
      onTextareaFocus() {
        this.isActive = true
      },
      focusInputTextarea() {
        this.$refs.editTextarea.focus()
        this.isActive = true
      }
    },
    watch: {
      chatId: function(chatId) {
        if (chatId) {
          this.focusInputTextarea()
        }
      }
    }
  }

</script>

<style lang="scss">
  @import '~css/variables';

  $scrollbar-color: $chat-scrollbar-color;

  .chat-edit-container {
    width: 100%;
    /*height: 150px;*/
    border-top: 1px solid lightgray;
    padding: 20px 30px 10px;

    /*background-color: #fff;*/

    display: flex;
    flex-direction: column;

    &.active {
      background-color: #fff;
    }

    .top-container {
      width: 100%;
      height: 30px;
    }

    .edit-container {
      /*flex: 1;*/

      textarea {
        width: 100%;
        /*height: 100%;*/
        resize: none;

        &::-webkit-scrollbar {
          width: 7px;
        }
        &::-webkit-scrollbar-thumb {
          background-color: $scrollbar-color;
        }
      }
    }

    .bottom-container {
      width: 100%;
      height: 30px;

      display: flex;
      justify-content: flex-end;

      .send-button {
        min-width: 70px;
      }
    }
  }
</style>
