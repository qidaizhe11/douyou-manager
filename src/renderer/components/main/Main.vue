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
  </div>
</template>

<script>

import Vue from 'vue'

import 'vue-awesome/icons'

import Icon from 'vue-awesome/components/Icon'

import ChatList from './chat-list/ChatList'

Vue.component('icon', Icon)

export default {
  data() {
    return {
      menu: ''
    }
  },
  components: {
    ChatList
  }
}
</script>

<style scoped lang="scss">
@import './main.scss';
</style>
