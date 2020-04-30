import Api from '@/api'
import router from '@/router'

import Compress from '@/assets/js/compress'

import { setStore, getStore, removeStore } from '@/utils/utils'

import { Toast } from 'vant'

const actions = {
  // 获取接口域名
  // getApiHost ({ commit }) {
  //   return Api.getApiHost()
  //     .then(data => {
  //       console.log(data, '获取接口域名')
  //       if (data.code === 1) {
  //         host = data.data.host
  //         return true
  //       } else {
  //         return false
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       return false
  //     })
  // },


  // 获取验证码
  gitVerifyCode ({
    commit,
    state
  }, data) {
    const res = validate({
      tel: {
        val: data.phone,
        isMsg: true
      }
    })

    if (res) {
      return new Promise((resolve, reject) => {
        Api.gitVerifyCode(data)
          .then(data => {
            if (data.status) {
              const date = new Date().getTime()
              setStore('verifyTime', date)
              commit('setTimer')
              Toast('验证码已发送')
            } else {
              if (data.response_code === 300) {
                Toast('您输入的电话号码格式不正确！')
                return false
              }
              Toast(data.msg)
            }
            return data.status
          })
      })
    }
  },

  // 获取用户信息
  getUserInfo () {
    return Api.getUserInfo()
      .then(data => {
        console.log('获取用户信息 ==>', data)
        if (data.code === 1) {
          const userInfo = getStore('userInfo')
          // console.log(userInfo, 'userInfouserInfo')
          const obj = Object.assign(userInfo, data.data.info)
          setStore('userInfo', obj)
          return obj
        } else {
          return false
        }
      })
      .catch(err => {
        console.log(err)
        return false
      })
  },

  // 验证登录 token
  // async checktLoginToken ({ commit, dispatch }) {
  //   const res = await dispatch('getApiHost')
  //   console.log(res, 'resres')
  //   return Api.checktLoginToken()
  //     .then(data => {
  //       if (data.code === 401) {
  //         return false
  //       } else {
  //         commit('changeValue', { type: 'token', value: data.data.token })
  //         setStore('token', { token: data.data.token })
  //         dispatch('getUserInfo')
  //         return true
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       return false
  //     })
  // },

  // 获取公共的 Token
  getCommonToken ({ commit, state }) {
    return Api.getCommonToken()
      .then(data => {
        console.log(data, '_token_')
        if (data.code === 1) {
          return data.data.__token__
        }
      })
  },

  // 上传文件
  uploadFile ({ commit, state }, fileList) {
    console.log(fileList);
    
    Toast.loading({
      mask: true,
      duration: 0,
      message: '上传中...'
    })
    if (!fileList.length) return []
    const arr = fileList.map(async it => {
      console.log(it)
      const comFile = await new Compress().compress(it.file, 0.4, false)
      const params = new FormData()
      params.append('file', comFile)
      // params.file=fileList[0].file.name
      return Api.uploadFilesurl(params)
    })

    return Promise.all(arr)
      .then(data => {
        const resulte = data[0]
        // resulte.file=1
        if (resulte.code === 1) {
          const res = data.map(it => it.data.url)
          Toast.success('上传成功')
          
          return res
        } else {
          // Toast.fail(resulte.msg)
          return false
        }
      })
      .catch(err => {
        console.log(err)
        Toast.fail('上传失败，请重试')
      })
  },


  getAppDownloadAddress () {
    Api.getAppDownloadAddress()
      .then(data => {
        console.log(data, 'getAppDownloadAddress')
        if (data.code === 1) {

        }
      })
  }

}

export default actions
