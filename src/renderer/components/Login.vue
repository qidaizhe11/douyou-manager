<template>
  <div class="container">
    <div class="form-container">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type='password' v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-button" @click="onSubmit">登录</el-button>
          <!--<el-button type="primary" class="submit-button">登录</el-button>-->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import { Input, Form, FormItem, Button } from 'element-ui'

import { FETCH_LOGIN } from '@/store'

Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('Login, onSubmit, this.form:', this.form)
      this.$store.dispatch(FETCH_LOGIN, {
        username: this.form.username,
        password: this.form.password
      })
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  width: 50%;
  max-width: 500px;
  min-width: 300px;

  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.el-form {
  width: 100%;
}

.submit-button {
  width: 100%;
}
</style>
