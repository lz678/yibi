/* 公共接口 */

import axios from '@/utils/request'
import { getStore } from '@/utils/utils'

export default {
  // getApiHost: () => {
  //   return axios.get('http://www.xvjd.cn/apis.php')
  // },

  // 登录
  login: data => {
    return axios.get('user/login', { params: data })
  },

  // 退出登录
  logout: () => {
    return axios.get('user/logout')
  },

  // 获取手机验证码
  getSmsCode: (data) => {
    return axios.get('sms/send', { params: data })
  },

  // 检测登录token 是否过期
  checktLoginToken: () => {
    return axios.get('token/check')
  },

  // 获取公共的 token
  getCommonToken: () => {
    return axios.get('common/gettoken')
  },

  // 上传文件
  uploadFiles: (data) => {
    let token = getStore('token')
    return axios.post('http://yanbiwang.fulishijie.top/api/trade/upload_pay_img', data, {
      // headers['token']: token.token
      // http://www.faagy.cn/n
      headers: { 'token': token.token },
    })
  },
   // 上传文件获取url
  uploadFilesurl: (data) => {
    let token = getStore('token')
    return axios.post('http://yanbiwang.fulishijie.top/addons/alioss/index/upload', data, {
      // headers['token']: token.token
      // http://www.faagy.cn/n
      headers: { 'token': token.token },
    })
  },

  // 获取下载地址
  getAppDownloadAddress: () => {
    return axios.get('index/version')
  },

  // 获取分享链接
  getShareLink: () => {
    return axios.get('common/init')
  },

  getShareInfo: (data) => {
    return axios.get('team/share', { params: data })
  },

  getGoldDetails: (data) => {
    return axios.get('coin/index', { params: data })
  },

  getRawDetails: (data) => {
    return axios.get('coin/Stonelist', { params: data })
  },

  getAfcDetails: (data) => {
    return axios.get('coin/Afclist', { params: data })
  },
  postAuth: data => {
    return axios.post('trade/user_real_do', data)
  }
}
