import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import chat from './chat'

Vue.use(Vuex)

const modules = {
  user,
  chat
}

const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

export default store
