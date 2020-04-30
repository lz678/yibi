import { Toast } from 'vant'

let timer = null

const mutations = {
  /**
   **统一改变值
   * @param {String} data.type state中的类型
   * @param {String} data.stype type类型中的类型
   * @param {any} data.value 修改的值
   */
  changeValue (state, {
    type,
    value,
    stype
  }) {
    console.log('统一改变值 ==>', type, value)
    if (stype) {
      state[type][stype] = value
    } else {
      state[type] = value
    }
  },
//是否上传了打印凭证
// isUP(state,a){
//   state.isup=a
// },
// isOK(state,a){
//   state.isok=a
// },
  // 获取验证码定时器
  setTimer (state) {
    state.showReminderTime = true
    state.timer = setInterval(() => {
      if (state.reminderTime > 0) {
        state.reminderTime--
      } else {
        clearInterval(state.timer)
        state.showReminderTime = false
        state.reminderTime = 60
      }
    }, 1000)
  },


  // 加载进度条
  loadProgress (state) {
    clearInterval(bar);
    const lodingDom = document.getElementById('loding');
    const tip = document.getElementById('tip');

    const timer = setInterval(() => {
      const width = parseInt(lodingDom.style.width);
      if (width >= 100) {
        clearInterval(timer);
        lodingDom.style.width = '100%'
        tip.innerHTML = '100%'

        setTimeout(() => {
          document.querySelector('.loding').style.display = 'none'
          state.isLoding = false
        }, 100);

      } else {
        lodingDom.style.width = width + 1 + "%";
        tip.innerHTML = lodingDom.style.width;
      }

    }, 10);
  },


}

export default mutations
