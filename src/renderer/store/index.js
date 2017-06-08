import Vue from 'vue'
import Vuex from 'vuex'
// import _ from 'lodash'
// import axios from 'axios'
import Qs from 'qs'
import { doubanApi } from '@/utils/config'
// import router from '@/router'
import router from '../router'

Vue.use(Vuex)

export const FETCH_LOGIN = 'FETCH_LOGIN'

export const SET_USER_INFO = 'SET_USER_INFO'
  // export const USER_LOGIN_SUCCESS
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'

export default new Vuex.Store({
  state: {
    user: {
      id: '',
      name: '',
      accessToken: '',
      refreshToken: '',
      tokenExpiredTime: null,
      isLogined: false
    }
  },
  mutations: {
    [SET_USER_INFO](state, { user }) {
      state.user = user
    },
    [LOGIN_SUCCESS](state, data) {
      state.user.isLogined = true
      state.user.id = data.douban_user_id
      state.user.name = data.douban_user_name
      state.user.accessToken = data.access_token
      state.user.refreshToken = data.refresh_token

      const dateNow = new Date()
      dateNow.setSeconds(dateNow.getSeconds() + data.expires_in)
      state.user.tokenExpiredTime = dateNow

      localStorage.setItem('userId', state.user.id)
      localStorage.setItem('accessToken', state.user.accessToken)
      localStorage.setItem('tokenExpiredTime', state.user.tokenExpiredTime.toISOString())
      localStorage.setItem('refreshToken', state.user.refreshToken)

      router.push('/')
    }
  },
  actions: {
    [FETCH_LOGIN]({ commit, state }, data) {
      const postData = Qs.stringify({
        client_id: '0dad551ec0f84ed02907ff5c42e8ec70',
        client_secret: '9e8bb54dc3288cdf',
        grant_type: 'password',
        username: data.username,
        password: data.password
      })
      fetch(doubanApi.loginUrl, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: postData
      }).then(response => {
        console.log('fetch_login, response:', response)

        if (!response.ok) {
          console.log('!!!fetch_login, response error! response:', response)
        }

        response.json().then(data => {
          console.log('fetch_login, got data:', data)
          commit(LOGIN_SUCCESS, data)
        })
      })
    }
  }
})
