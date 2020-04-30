import 'babel-polyfill'
 
import Vue from 'vue'
import router from './router'
import echarts from 'echarts';
// 重置样式/
import 'normalize.css/normalize.css'

// vant
import Vant from 'vant'
import 'vant/lib/index.css'

// 全局样式
// import './styles/index.scss'

// 项目入口
import App from './App'

// store
import store from '@/store'
// api
import api from '@/api'

// 全局过滤器
import filter from './filters/index'

// 权限控制
import auth from '@/utils/auth'

// 全局过滤器
// import filter from './filters/index'

import VueCropper from 'vue-cropper'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

// 移动端日志
// import VConsole from 'vconsole'

Vue.use(Vant)
Vue.use(VueCropper)
Vue.use(VueAwesomeSwiper)
// new VConsole()


Vue.prototype.$api = api
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
