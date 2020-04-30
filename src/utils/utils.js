// 路由懒加载
export const getComponent = (com) => () =>
  import(`@/${com}`)

// 本地存储 默认是sessionStorage
export const setStore = (name, content, type = 'localStorage') => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window[type].setItem(name, content)
}

// 获取本地存储
export const getStore = (name, type = 'localStorage') => {
  if (!name) return
  let content = window[type].getItem(name)
  if (content) {
    content = JSON.parse(content)
  }
  return content || ''
}

// 删除本地存储
export const removeStore = (name, type = 'localStorage') => {
  if (!name) return
  window[type].removeItem(name)
}

// 判断浏览器类型
export const browserVersions = () => {
  var u = navigator.userAgent,
    app = navigator.appVersion

  return {
    // 是否为IE内核
    trident: u.indexOf('Trident') > -1,

    // 是否为opera内核
    presto: u.indexOf('Presto') > -1,

    // 是否为苹果、谷歌内核
    webKit: u.indexOf('AppleWebKit') > -1,

    // 是否为火狐内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,

    // 是否为为移动终端
    mobile: !!u.match(/AppleWebKit.*Mobile.*/),

    // 是否为ios终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),

    // 是否为android终端或uc浏览器
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,

    // 是否为iPhone或者QQHD浏览器
    iPhone: u.indexOf('iPhone') > -1,

    // 是否为iPad
    iPad: u.indexOf('iPad') > -1,

    // 是否为web应该程序，没有头部与底部
    webApp: u.indexOf('Safari') == -1
  }
}

// 排断是否是微信浏览器
export const isWechatrBrowse = () => {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

// rem
export const setHtmlFontSize = () => {
  const html = document.documentElement

  function onWindowResize () {
    html.style.fontSize = html.getBoundingClientRect().width / 30 + 'px'
  }
  window.addEventListener('resize', onWindowResize)
  onWindowResize()
}

// 设置广告标题
export const setPagesTitle = (title = '蜜传') => {
  document.title = title
}

// 格式化时间
export const formatDate = () => {
  Date.prototype.format = function (fmt) {
    var o = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'h+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'q+': Math.floor((this.getMonth() + 3) / 3),
      'S': this.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }
}

export const formatColor = () => {
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  /* RGB颜色转换为16进制 */
  String.prototype.colorHex = function () {
    var that = this
    if (/^(rgb|RGB)/.test(that)) {
      var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',')
      var strHex = '#'
      for (var i = 0; i < aColor.length; i++) {
        var hex = Number(aColor[i]).toString(16)
        if (hex.length === 1) {
          hex = '0' + hex
        }
        strHex += hex
      }
      if (strHex.length !== 7) {
        strHex = that
      }
      return strHex
    } else if (reg.test(that)) {
      var aNum = that.replace(/#/, '').split('')
      if (aNum.length === 6) {
        return that
      } else if (aNum.length === 3) {
        var numHex = '#'
        for (var i = 0; i < aNum.length; i += 1) {
          numHex += (aNum[i] + aNum[i])
        }
        return numHex
      }
    } else {
      return that
    }
  }

  /* 16进制颜色转为RGB格式 */
  String.prototype.colorRgb = function () {
    var sColor = this.toLowerCase()
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        var sColorNew = '#'
        for (var i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
        }
        sColor = sColorNew
      }
      // 处理六位的颜色值
      var sColorChange = []
      for (var i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
      }
      return 'RGB(' + sColorChange.join(',') + ')'
    } else {
      return sColor
    }
  }
}

const colorList = ['#D24D57', '#26A65B', '#EB7347', '#EB7347', '#2C3E50', '#84AF9B', '#FC9D99', '#AEDD81', '#00CCFF', '#D0D0D0', '#D24D57', '#FC9D99', '#26A65B', '#AEDD81', '#84AF9B', '#2C3E50']

export const randomNum = (m, n) => {
  const num = Math.floor(Math.random() * (m - n) + n)
  return num
}

export const randomColor = () => {
  const num = randomNum(1, 16)
  return colorList[num]
}
