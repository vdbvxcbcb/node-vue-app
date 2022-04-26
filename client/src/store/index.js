import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

// 设置 type 有利于调试
const types = {
  SET_AUTHENTICATED: "SET_AUTHENTICATED",
  SET_USER: "SET_USER",
}

const state = {
  isAuthenticated: false,
  user: {},
  rememberPwd: '',
  
}

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user
}

const actions = {
  setIsAuthenticated: ({ commit }, isAuthenticated) => {
    commit(types.SET_AUTHENTICATED, isAuthenticated)
  },
  setUser: ({ commit }, user) => {
    commit(types.SET_USER, user)
  },
  clearState: ({commit}) => {
    commit(types.SET_AUTHENTICATED, false);
    commit(types.SET_USER, null);
  }
}

const mutations = {
  [types.SET_AUTHENTICATED](state, isAuthenticated) {
     if (isAuthenticated) {
       state.isAuthenticated = isAuthenticated 
     }
     else {
       state.isAuthenticated = false
     }
  }, 
  [types.SET_USER](state, user) {
    if (user) { 
      state.user = user 
    }
    else {
      state.user = {}
    } 
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  // 缓存 Vuex 数据，保证 F5刷新时 Vuex 数据不被清理
  plugins: [createPersistedState({ storage: window.sessionStorage })],
})
