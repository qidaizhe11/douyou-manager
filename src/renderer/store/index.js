import Vue from 'vue'
import Vuex from 'vuex'
// import _ from 'lodash'
// import axios from 'axios'
import Qs from 'qs'
import { doubanApi } from '@/utils/config'

Vue.use(Vuex)

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
      isLogined: false
    }
  },
  mutations: {
    [SET_USER_INFO](state, { user }) {
      state.user = user
    },
    [LOGIN_SUCCESS](state, { data }) {
      state.isLogined = true
      state.id = data.id
      state.accessToken = data.token

      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.id)
    }
  },
  actions: {
    fetch_login({ commit, state }, data) {
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
        })
      })
    }
  }
})

// axios.post(
//   doubanApi.loginUrl, postData, {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     }
//   }
// ).then(response => {
//   console.log('fetch_login, response:', response)
// })
