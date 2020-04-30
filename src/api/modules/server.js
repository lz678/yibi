/* 服务商 */

import axios from '@/utils/request'

export default {

  // 获取服务商状态
  getServiceProviderStatus: () => {
    return axios.get('fuwu/getHome')
  },

  // 开通服务商
  openServiceProvider: data => {
    return axios.post('fuwu/applyopen', data)
  },

  // 提取服务商
  stopServiceProvider: data => {
    return axios.post('fuwu/applyStop', data)
  },
  // 提取服务商
  extensionServiceProvider: data => {
    return axios.post('fuwu/applyopenAgen', data)
  }

}
