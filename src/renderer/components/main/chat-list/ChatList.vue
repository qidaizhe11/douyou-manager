<template>
  <div class="chat-list" ref="chatListContainer" v-loading.body="getChatListRequest.isFetching">
    <template v-for='item in chatList'>
      <div class="chat-list-item" @click='onItemClick(item)'>
        <div class="left-group">
          <div class="avatar-container">
            <img :src="item.target_user.avatar"/>
          </div>
        </div>
        <div class="right-group">
          <div class="header-container">
            <div class="username">{{item.target_user.name}}</div>
            <!--<div class="datetime">{{item.last_message.create_time}}</div>-->
            <div class="datetime">昨天</div>
          </div>
          <div class="content-container">
            {{item.last_message.text}}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import Vue from 'vue'
  //  import _ from 'lodash'
  import {Loading} from 'element-ui'
  import {mapState} from 'vuex'
  import {
    FETCH_GET_CHAT_LIST, FETCH_GET_CHAT_MESSAGES_IF_NEEDED, CHANGE_ACTIVE_CHAT_ID
  } from 'store/mutation-types'

  Vue.use(Loading.directive)

  export default {
    data() {
      return {
        userList: ''
      }
    },
    mounted() {
      this.getChatList()
    },
    methods: {
      getChatList() {
        this.$store.dispatch(FETCH_GET_CHAT_LIST, {
          start: 0,
          count: 20
        })
      },
      onItemClick(item) {
        console.log('ChatList, onItemClick, item:', item)
        const chatId = item.conversation_id
        this.$store.dispatch(CHANGE_ACTIVE_CHAT_ID, {chatId})
        this.$store.dispatch(FETCH_GET_CHAT_MESSAGES_IF_NEEDED, {
          chatId,
          count: 20
        })
      }
    },
    computed: {
      ...mapState({
        chatList: state => state.chat.chatList,
        getChatListRequest: state => state.requests.chat.getChatList,
        getChatListMoreRequest: state => state.requests.chat.getChatListMore
      })
    }
  }
</script>

<style lang="scss">
  @import '~css/variables';

  $background-color: $chatlist-background-color;
  $scrollbar-color: $chatlist-scrollbar-color;

  .chat-list {
    width: 100%;
    height: 100%;
    padding: 20px 0;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $scrollbar-color;
    }
    background-color: $background-color;

    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
  }

  .chat-list-item {
    width: 100%;
    height: 60px;
    padding: 6px 10px;

    display: flex;

    &:hover {
      background-color: darken($background-color, 10%);
      cursor: default;
    }

    .left-group {
      width: 20%;
      height: 100%;

      .avatar-container {
        width: 100%;
        height: 100%;

        img {
          width: 48px;
          height: 48px;
          border-radius: 100%;
          object-fit: cover;
        }
      }
    }
    .right-group {
      width: 80%;
      height: 100%;
      padding-left: 10px;
      display: flex;
      flex-wrap: wrap;
      .header-container {
        width: 100%;
        display: inline-flex;
        justify-content: space-between;
        .username {
          font-size: 14px;
          font-weight: 600;
        }
        .datetime {
          font-size: 12px;
        }
      }
      .content-container {
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
