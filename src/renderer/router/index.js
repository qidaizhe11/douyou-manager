import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
// import Markdown from '@/components/Markdown'
import Login from '@/components/Login'
// import Main from '@/components/main/Main'

Vue.use(Router)

const debug = process.env.NODE_ENV !== 'production'

export default new Router({
  routes: [{
    path: '/',
    name: 'Main',
    component: Login
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }],
  mode: debug ? 'history' : 'hash'
})
