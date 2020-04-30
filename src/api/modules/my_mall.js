/* 商城 */

import axios from '@/utils/request'

export default {
  checkMyMall: () => {
    return axios.get('sellers/checkShop')
  },

  // 开通我的商城
  openMyMall: data => {
    return axios.post('sellers/applyShop', data)
  },

  // 获取商品列表
  getMyProList: data => {
    return axios.get('sellers/getProducts', { params: data })
  },

  // 上下架
  putMyMallShelf: data => {
    return axios.post('book/buybook', data)
  },

  // 下架
  putMyMallDown: data => {
    return axios.post('sellers/applyDown', data)
  },


  // 删除商城商品
  delMyMallPro: data => {
    return axios.post('sellers/applyDel', data)
  },


  // 发布产品
  postPubPro: data => {
    return axios.post('sellers/saveProduct', data)
  },

  // 获取我的商城订单
  getMyMallOrder: data => {
    return axios.get('sellers/getOrders', { params: data })
  },

  // 发货
  postMyMallShip: data => {
    return axios.post('sellers/applyShipped', data)
  },

  // 退款
  postMyMallRefund: data => {
    return axios.post('sellers/applyBack', data)
  },

  // 同意退款
  myMallApplyAgreeBack: data => {
    return axios.post('sellers/applyAgreeBack', data)
  },

  // 同意退款
  myMallApplyCancelBack: data => {
    return axios.post('sellers/applyCancelBack', data)
  },
}
