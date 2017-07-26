<template>
  <div class="container">
    <LeftSideBar />
    <router-view class="view"></router-view>
  </div>
</template>

<script>
  import Vue from 'vue'
  import 'vue-awesome/icons'
  import Icon from 'vue-awesome/components/Icon'

  import LeftSideBar from 'components/LeftSideBar'

  Vue.component('icon', Icon)

  export default {
    data() {
      return {

      }
    },
    components: {
      LeftSideBar
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    display: flex;

    min-width: 500px;
  }

  .view {
    flex: 1;
  }
</style>
