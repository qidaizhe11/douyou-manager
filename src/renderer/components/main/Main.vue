<template>
  <div class="container">
    <div class="left-side-container">
      <div class="top-group">
        <div class="menu-item-container">
          <!--<i class="el-icon-edit"></i>-->
          <icon name="commenting-o"></icon>
        </div>
        <div class="menu-item-container">
          <icon name="address-book"></icon>
        </div>
      </div>
      <div class="bottom-group">
        <div class="menu-item-container">
          <icon name="bars"></icon>
        </div>
      </div>
    </div>
    <div class="chat-list-container">
      <ChatList />
    </div>
    <div class="chat-container">
      <Chat />
    </div>
  </div>
</template>

<script>

import Vue from 'vue'

import 'vue-awesome/icons'

import Icon from 'vue-awesome/components/Icon'

import ChatList from './chat-list/ChatList'
import Chat from './chat/Chat'

// import { FETCH_GET_FOLLOWING, FETCH_GET_HOME_TIMELINE, FETCH_GET_HAS_NEW_RECS }
// from '@/store/mutation-types'

Vue.component('icon', Icon)

export default {
  data() {
    return {
      menu: ''
    }
  },
  mounted() {
    // this.$store.dispatch(INIT_USRE_INFO_FROM_STORAGE)
    // this.getFollowing()
    // this.getNewRecs()
    // this.getHomeTimeline()
  },
  methods: {
    // getFollowing() {
    //   this.$store.dispatch(FETCH_GET_FOLLOWING)
    // },
    // getHomeTimeline() {
    //   this.$store.dispatch(FETCH_GET_HOME_TIMELINE)
    // },
    // getNewRecs() {
    //   this.$store.dispatch(FETCH_GET_HAS_NEW_RECS)
    // }
  },
  components: {
    ChatList,
    Chat
  }
}
</script>

<style scoped lang="scss">
@import './main.scss';
</style>
