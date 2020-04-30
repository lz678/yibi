/* 公共接口 */

import axios from '@/utils/request'

export default {
  // 卷轴
  getMallList: data => {
    return axios.get('book/index', { params: data })
  },

  // 我的卷轴
  getMyMallList: data => {
    return axios.get('book/mybook', { params: data })
  },

  // 历史卷轴
  getMalledList: data => {
    return axios.get('book/mybooked', { params: data })
  },

  // 兑换卷轴
  getBuyMall: data => {
    return axios.post('book/buybook', data)
  },
  //获取公告
  getNotice(data){
    return axios.post('index/message',data)
  },

  // 兑换卷轴
  getAfcBuyMall: data => {
    return axios.post('book/useAfcbuybook', data)
  },
}
