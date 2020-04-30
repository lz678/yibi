

import axios from '@/utils/request'

export default {
  // 待匹配列表
  // tranMatchList: (data) => {
  //   return axios.get('info/buylist', { params: data })
  // },
  //是否卖家已申诉
  issellappeal(data){
    return axios.post('/trade/getBuyer',data)
  },
  //是否上传凭证
  isuppickture(data){
    return axios.post('/trade/getExistImg',data)
  },
  tranMatchList: (data) => {
    return axios.post('trade/order_list',data )
  },
  // 交易中列表
  tranTradeingList: data => {
    return axios.get('info/tradeing', { params: data })
  },

  // 完成列表
  tranFinishList: (data) => {
    return axios.get('info/finish', { params: data })
  },

  // 取消列表
  tranCancelList: (data) => {
    return axios.get('info/cancellist', { params: data })
  },


  // 获取交易对方资料
  getTransactUserInfo: (data) => {
    return axios.get('info/showinfo', { params: data })
  },

  // 获取转账图片
  getShowImg: (data) => {
    return axios.get('info/showimg', { params: data })
  },

  // 上传转账图片
  uploadTransactImg: (data) => {
    return axios.post('addons/alioss/index/upload', data )
  },

  // 确认订单完成
  confirmYesOrder: (data) => {
    return axios.post('trade/pay', data)
  },

  // 投诉订单
  complaintOrder: (data) => {
    return axios.post('trade/post_appeal', data)
  },
  //放币
  givecoin(data){
    return axios.post('trade/deal',data)
  },
  //订单详情
  getorderlist(data){
    return axios.post('trade/order_detail',data)
  },

  // 取消出售
  cancelSale: (data) => {
    return axios.post('info/unsale', data)
  },

  // 取消买入
  cancelBuy: (data) => {
    return axios.post('trade/cancelOrder', data)
  },
  //买入卖出取消
  cancelorder(data){
    return axios.post('trade/cal',data)
  },

  // 主动检查
  checkTime: (data) => {
    return axios.post('info/checkTime', data)
  },
}
