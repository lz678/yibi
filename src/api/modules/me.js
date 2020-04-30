/* 公共接口 */

import axios from '@/utils/request'

export default {
  // 获取用户信息
  getUserInfo: () => {
    return axios.post('user/user_center')
  },
  //获取idcard
  getauth(){
    return axios.post('user/get_auth')
  },
  //更改支付密码
  changeTransPassword(data){
    return axios.post('user/changeTransPassword',data)
  }
}
