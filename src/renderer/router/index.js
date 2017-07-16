import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
// import Markdown from '@/components/Markdown'
import Login from '@/components/Login'
import Main from '@/components/main/Main'
import AutoReply from 'components/auto-reply/AutoReply.vue'

Vue.use(Router)

const debug = process.env.NODE_ENV !== 'production'

const router = new Router({
  routes: [{
    // path: '/',
    path: '/chat',
    name: 'Main',
    component: Main,
    meta: {
      auth: true
    }
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }, {
    // path: '/autoreply',
    path: '/',
    name: 'AutoReply',
    component: AutoReply,
    meta: {
      auth: true
    }
  }],
  mode: debug ? 'history' : 'hash'
    // mode: 'hash'
})

router.beforeEach((to, from, next) => {
  // to and from are Route Object,next() must be called to resolve the hook
  if (to.matched.some(record => record.meta.auth)) {
    const token = localStorage.getItem('accessToken')
    const tokenExpiredTimeString = localStorage.getItem('tokenExpiredTime')

    if (!token || !tokenExpiredTimeString || (new Date(tokenExpiredTimeString) <= new Date())) {
      next({
        path: '/login'
          // query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
