import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  token: '',
  // isup:false,
  // isok:false,
  isLoding: true,

  isShowOverlay: false,

  // 获取验证码
  timer: null,
  showReminderTime: false,
  reminderTime: 60
}

// const modulesFiles = require.context('./modules', true, /\.js$/)

// const modules = modulesFiles.keys().reduce((modules, modulePath) => {
//   const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
//   const value = modulesFiles(modulePath)
//   modules[moduleName] = value.default
//   return modules
// }, {})

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  // modules
})
