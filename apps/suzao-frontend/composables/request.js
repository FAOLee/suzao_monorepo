import {
  BASEURL
} from '@/config/index.js'
import {
  goLogin,
  loginFn
} from '@/utils/login'
/*
 * 全局请求封装
 * @param path 请求路径
 * @param method 请求类型(GET/POST等)
 * @oaram data 请求体数据
 * @param loading 请求未完成是是否显示加载中，默认为true
 */
export default (path, method, data = {}, _object = {}, head = {}) => {
  // 获取存储token
  const token = []
  const php = uni.getStorageSync('PHPSESSID')
  const java = uni.getStorageSync('JSESSIONID')
  if (php) {
    token.push(php)
  }
  if (java) {
    token.push(java)
  }
  return request(path, method, data, token, _object, head)
}

// 有token时发送请求函数
function request(path, method, data, token, _object, head) {
  const header = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Client-Type': 2,
    ...head
  }
  if (token.join(';').length) {
    header.Cookie = token.join(';')
  }
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASEURL + path,
      enableCookie: true,
      method,
      data,
      header,
      ..._object,
      success(response) {
        if (response.cookies) {
          setCookie(response.cookies)
        }
        if (response.data.code === 103 || response.data.need_login === 1) {
          loginFn()
          goLogin()
          return reject('请先登录')
        }
        if (response.statusCode === 102) {
          uni.showToast({
            icon: 'none',
            title: response.msg
          })
          return reject(response.msg)
        }
        if (response.statusCode === 502) {
          uni.showToast({
            icon: 'none',
            title: '服务器重启中，请稍后再试'
          })
          return reject('服务器重启中，请稍后再试')
        }

        return resolve(response.data)
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '服务响应失败'
        })
        // console.error(err)
        return reject(err)
      }
    })
  })
}

function setCookie(cookie) {
  if (cookie && cookie.length > 0) {
    cookie.map(item => {
      const cook = item.split(';')
      if (cook.length) {
        if (cook[0].indexOf('PHPSESSID') > -1) {
          uni.setStorageSync('PHPSESSID', cook[0])
        } else if (cook[0].indexOf('JSESSIONID') > -1) {
          uni.setStorageSync('JSESSIONID', cook[0])
        }
      }
    })
  }
}