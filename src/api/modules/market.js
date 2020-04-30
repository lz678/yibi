/* 公共接口 */

import axios from '@/utils/request'

export default {
  //发布订单
  addorder(data){
    return axios.post('trade/addOtc',data)
  },

  //获取买卖家个人信息
  getother(data){
    return axios.post('trade/getUserInfo',data)
  },
  //获取走势图
  getmap: (data) => {
    return axios.post('trade/trade_map',data)
  },
  // 获取数量区间
  getNumRang: () => {
    return axios.get('index/getlimit')
  },
  //获取价格区间
  getprice(data){
    return axios.post('trade/getPriceRange',data)
  },
  //获取余额
  getsum(data){
    return axios.post('trade/getCoinBalance',data)
  },
  //获取最大卖出个数
  getmaxnum(data){
    return axios.post('trade/getAccount',data)
  },
  //获取币种
  gettype: () => {
    return axios.post('trade/get_otc_coin')
  },
  // 获取普通求购
  getCommonMarket: (data) => {
    return axios.post('trade/pay_trade',data)
  },

  // 获取服务商求购
  getServiceMarket: () => {
    return axios.get('common/hallshowbox')
  },

  // 统计
  getMarketTotal: data => {
    return axios.get('hall/tongji', { params: data })
  },

  // 首页买单列表
  getMarketBuyList: data => {
    return axios.post('index/index', data)
  },
  //交易中心列表
  gethomeList: data => {
    return axios.post('trade/index', data)
  },

  // 发布买单
  getMarketDoBuy: data => {
    return axios.post('hall/dobuy', data)
  },

  // 匹配出售
  getMarketMatchSale: data => {
    return axios.post('info/dosale', data)
  },
  // 获取交易提示
  getMarketTip: () => {
    return axios.get('common/hallshowbox')
  },
}
