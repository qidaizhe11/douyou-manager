import Vue from 'vue'
import Router from 'vue-router'
import Root from 'components/Root'
import Login from 'components/Login'
import Main from 'components/main/Main'
import AutoReply from 'components/auto-reply/AutoReply.vue'
import EditReply from 'components/auto-reply/edit-reply/EditReply.vue'

Vue.use(Router)

const debug = process.env.NODE_ENV !== 'production'

const router = new Router({
  routes: [
    {
      path: '/',
      component: Root,
      children: [
        {
          path: '',
          redirect: 'reply-edit'
        },
        {
          path: 'chat',
          name: 'Main',
          component: Main,
          meta: {
            auth: true
          }
        },
        {
          path: 'reply',
          name: 'AutoReply',
          component: AutoReply,
          meta: {
            auth: true
          }
        },
        {
          path: 'reply-edit',
          component: EditReply,
          meta: {
            auth: true
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ],
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
