<template>
  <div class="container">
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
</template>

<script>
  export default {
    data() {
      return {

      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~css/variables.scss';

  $background-color: $toolbar-background-color;

  .container {
    height: 100%;
    width: 55px;
    min-width: 55px;
    background-color: $background-color;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: space-between;
  }

  .top-group,
  .bottom-group {
    width: 100%;
  }

  .menu-item-container {
    height: 55px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: darken($background-color, 10%)
    }
    &:active {
      background-color: lighten($background-color, 10%)
    }
    .fa-icon {
      color: white;
      $icon-size: 20px;
      width: $icon-size;
      height: $icon-size;
    }
  }
</style>
