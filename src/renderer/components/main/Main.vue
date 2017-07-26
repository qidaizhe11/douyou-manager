<template>
  <div class="container">
    <div class="chat-list-container">
      <ChatList/>
    </div>
    <div class="chat-container">
      <Chat/>
    </div>
  </div>
</template>

<script>

import ChatList from './chat-list/ChatList'
import Chat from './chat/Chat'

// import { FETCH_GET_FOLLOWING, FETCH_GET_HOME_TIMELINE, FETCH_GET_HAS_NEW_RECS }
// from '@/store/mutation-types'

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

<style lang="scss">
@import './main.scss';
</style>
