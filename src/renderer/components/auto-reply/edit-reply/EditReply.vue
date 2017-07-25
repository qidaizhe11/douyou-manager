<template>
  <div class="container">
    <LeftSideBar />
    <div class="main-container">
    </div>
  </div>
</template>

<script>
//  import Vue from 'vue'
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

  .main-container {
    flex: 1;

    padding: 20px 20px;
  }
</style>
