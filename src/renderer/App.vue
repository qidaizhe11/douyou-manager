<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { INIT_USRE_INFO_FROM_STORAGE } from '@/store/mutation-types'

export default {
  name: 'douban-manager',
  mounted() {
    this.$store.dispatch(INIT_USRE_INFO_FROM_STORAGE)
  }
}
</script>

<style lang="scss">
@import './css/base.scss';

#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
  height: 100%;
}


html,
body {
  height: 100%;
  /*color: #333;*/
}
</style>
