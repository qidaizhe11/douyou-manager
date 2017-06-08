<template>
  <div class="chat-list">
    <div class="chat-list-item">
      <div class="left-group">
        <div class="avatar-container"></div>
      </div>
      <div class="right-group">
        <div class="header-container">
          <div class="username">盘风</div>
          <div class="datetime">昨天</div>
        </div>
        <div class="content-container">
          巴拉巴拉小魔仙知来日之可追
        </div>
      </div>
    </div>
  
    <div class="chat-list-item">
      <div class="left-group">
        <div class="avatar-container"></div>
      </div>
      <div class="right-group">
        <div class="header-container">
          <div class="username">盘风</div>
          <div class="datetime">昨天</div>
        </div>
        <div class="content-container">
          巴拉巴拉小魔仙
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: ''
    }
  }
}
</script>

<style lang="scss">
$background-color: lightgray;

.chat-list {
  width: 100%;
  height: 100%;
  padding: 20px 0;

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
  }
  .right-group {
    width: 80%;
    height: 100%;
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
