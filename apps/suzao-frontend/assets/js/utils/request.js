// 创建axios实例
window.$axios = axios.create({
  baseURL: '',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// 请求拦截器
$axios.interceptors.request.use(
  function (config) {
    // console.log(config, '请求拦截器')
    return config
  },
  function (error) {
    // console.log(error, '请求拦截器')
    return Promise.reject(error)
  }
)

// 响应拦截器
$axios.interceptors.response.use(
  function (response) {
    var res = response.data
    // console.log(res)
    if ([101, 4010].indexOf(res.code) <= -1 && !(res instanceof Blob)) {
      if (res.code === 103) {
        // 需要登录
        location.href = '/login?refer=' + location.pathname + encodeURIComponent(location.search)
      }
      if (res.code === 102) {
        // 其他错误
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  function (error) {
    // 请求错误时做些事
    var status = ''
    if (error.request) {
      status = error.request
    } else if (error.response) {
      status = error.response
    }
    if (status) {
      switch (status.status) {
        case 400:
          error.message = '请求错误(400)'
          break
        case 401:
          error.message = '未授权，请重新登录(401)'
          break
        case 403:
          error.message = '拒绝访问(403)'
          break
        case 404:
          error.message = '请求出错(404)'
          break
        case 408:
          error.message = '请求超时(408)'
          break
        case 500:
          error.message = '服务器错误(500)'
          break
        case 501:
          error.message = '服务未实现(501)'
          break
        case 502:
          error.message = '网络错误(502)'
          break
        case 503:
          error.message = '服务不可用(503)'
          break
        case 504:
          error.message = '网络超时(504)'
          break
        case 505:
          error.message = 'HTTP版本不受支持(505)'
          break
        default:
          error.message = '连接出错(' + status.status + ')!'
      }
    } else {
      error.message = '连接服务器失败!'
    }
    return Promise.reject(error)
  }
)
