<template>
  <div class="container">
    <LeftSideBar />
    <router-view class="view"></router-view>
  </div>
</template>

<script>
  import LeftSideBar from 'components/LeftSideBar'

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
  }

  .view {
    flex: 1;
  }
</style>
