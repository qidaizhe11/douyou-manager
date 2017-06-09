<template>
  <div class="chat">
    <div class="chat-header-container">
      <div class="header-text">
        {{activeChat && activeChat.target_user.name}}
      </div>
    </div>
    <div class="chat-history-container">
  
    </div>
    <div class="chat-edit-container">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'activeChat'
    ])
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
}

.chat-edit-container {
  width: 100%;
  height: 150px;
  border-top: 1px solid lightgray;
}
</style>
