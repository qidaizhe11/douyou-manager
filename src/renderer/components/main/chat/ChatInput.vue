<template>
  <div :class="{'chat-edit-container': true, 'active': isTextareaActive}"
       @click="onEditContainerClick">
    <!--<div class="top-container"></div>-->
    <div class="edit-container">
        <textarea class="edit-textarea" ref="editTextarea" rows="3" @blur="onTextareaBlur"
                  @focus="onTextareaFocus">
        </textarea>
    </div>
    <div class="bottom-container">
      <el-button class="send-button" :plain="true" type="success">发送</el-button>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Vue from 'vue'
  import { Button } from 'element-ui'

  Vue.use(Button)

  export default {
    data() {
      return {
        isTextareaActive: false
      }
    },
    computed: {
      ...mapState({
        chatId: state => state.chat.activeChatId
      })
    },
    methods: {
      onEditContainerClick() {
        this.focusInputTextarea()
      },
      onTextareaBlur() {
        this.isTextareaActive = false
      },
      onTextareaFocus() {
        this.isTextareaActive = true
      },
      focusInputTextarea() {
        this.$refs.editTextarea.focus()
        this.isTextareaActive = true
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
