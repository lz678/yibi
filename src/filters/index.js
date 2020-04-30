import Vue from 'vue'

Vue.filter('filterDate', (timer, format = 'yyyy-MM-dd hh:mm:ss') => {
  return new Date(timer * 1000).format(format)
})
