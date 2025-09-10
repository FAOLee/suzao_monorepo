import type { ApiResponse } from '~/types'

export interface ApiOptions {
  baseURL?: string
  headers?: Record<string, string>
  timeout?: number
  enableAuth?: boolean
}

export interface AuthTokens {
  PHPSESSID?: string
  JSESSIONID?: string
}

// HTTP 状态码错误映射
const HTTP_ERROR_MAP: Record<number, string> = {
  400: '请求错误(400)',
  401: '未授权，请重新登录(401)',
  403: '拒绝访问(403)',
  404: '请求出错(404)',
  408: '请求超时(408)',
  500: '服务器错误(500)',
  501: '服务未实现(501)',
  502: '网络错误(502)',
  503: '服务不可用(503)',
  504: '网络超时(504)',
  505: 'HTTP版本不受支持(505)'
}

export const useApi = (options: ApiOptions = {}) => {
  const nuxtApp = useNuxtApp()
  const { $i18n } = nuxtApp
  const router = useRouter()

  // Token 管理
  const getAuthTokens = (): AuthTokens => {
    if (import.meta.client) {
      const result: AuthTokens = {}
      const phpsessid = localStorage.getItem('PHPSESSID')
      const jsessionid = localStorage.getItem('JSESSIONID')
      
      if (phpsessid) result.PHPSESSID = phpsessid
      if (jsessionid) result.JSESSIONID = jsessionid
      
      return result
    }
    return {}
  }

  const setAuthTokens = (tokens: AuthTokens) => {
    if (import.meta.client) {
      if (tokens.PHPSESSID) {
        localStorage.setItem('PHPSESSID', tokens.PHPSESSID)
      }
      if (tokens.JSESSIONID) {
        localStorage.setItem('JSESSIONID', tokens.JSESSIONID)
      }
    }
  }

  const clearAuthTokens = () => {
    if (import.meta.client) {
      localStorage.removeItem('PHPSESSID')
      localStorage.removeItem('JSESSIONID')
    }
  }

  // 构建请求头
  const buildHeaders = (customHeaders?: Record<string, string>) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept-Language': $i18n?.locale?.value || 'zh-CN',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
      ...customHeaders
    }

    // 添加认证信息
    if (options.enableAuth !== false) {
      const tokens = getAuthTokens()
      const cookieTokens = [tokens.PHPSESSID, tokens.JSESSIONID].filter(Boolean)
      if (cookieTokens.length > 0) {
        headers.Cookie = cookieTokens.join(';')
      }
    }

    return headers
  }

  // 处理登录相关错误
  const handleAuthError = () => {
    clearAuthTokens()
    const currentPath = router.currentRoute.value.fullPath
    router.push(`/login?refer=${encodeURIComponent(currentPath)}`)
  }

  // 处理 HTTP 错误
  const getErrorMessage = (statusCode: number): string => {
    return HTTP_ERROR_MAP[statusCode] || `连接出错(${statusCode})!`
  }

  // 处理响应 Cookie
  const handleResponseCookies = (response: any) => {
    if (response.headers && response.headers['set-cookie']) {
      const cookies = Array.isArray(response.headers['set-cookie']) 
        ? response.headers['set-cookie'] 
        : [response.headers['set-cookie']]
      
      const tokens: AuthTokens = {}
      cookies.forEach(cookie => {
        const cookieParts = cookie.split(';')[0]
        if (cookieParts.includes('PHPSESSID')) {
          tokens.PHPSESSID = cookieParts
        } else if (cookieParts.includes('JSESSIONID')) {
          tokens.JSESSIONID = cookieParts
        }
      })
      
      if (Object.keys(tokens).length > 0) {
        setAuthTokens(tokens)
      }
    }
  }

  const request = async <T = any>(
    url: string,
    requestOptions: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      body?: any
      headers?: Record<string, string>
      query?: Record<string, any>
      timeout?: number
    } = {}
  ): Promise<T> => {
    try {
      const fetchOptions: any = {
        method: requestOptions.method || 'GET',
        headers: buildHeaders(requestOptions.headers),
        timeout: requestOptions.timeout || options.timeout || 10000,
        onResponse({ response }: any) {
          // 处理响应 Cookie
          handleResponseCookies(response)
        },
        onResponseError({ response }: any) {
          // 处理 HTTP 错误
          if (response.status === 401) {
            handleAuthError()
            throw createError({
              statusCode: 401,
              statusMessage: getErrorMessage(401)
            })
          }
          
          if (response.status === 502) {
            throw createError({
              statusCode: 502,
              statusMessage: '服务器重启中，请稍后再试'
            })
          }

          throw createError({
            statusCode: response.status,
            statusMessage: getErrorMessage(response.status)
          })
        }
      }

      if (requestOptions.body) {
        fetchOptions.body = requestOptions.body
      }

      if (requestOptions.query) {
        fetchOptions.query = requestOptions.query
      }

      const response = await $fetch<ApiResponse<T>>(url, fetchOptions)

      // 处理业务逻辑错误
      if (response.code === 103 || (response as any).need_login === 1) {
        handleAuthError()
        throw createError({
          statusCode: 401,
          statusMessage: '请先登录'
        })
      }

      if (response.code === 102) {
        throw createError({
          statusCode: 400,
          statusMessage: response.message || '请求失败'
        })
      }

      if (response.code !== 0 && ![101, 4010].includes(response.code)) {
        throw createError({
          statusCode: 400,
          statusMessage: response.message || '请求失败',
          data: response
        })
      }

      return response.data
    } catch (error: any) {
      // 如果已经是业务错误，直接抛出
      if (error.data?.code || error.statusCode) {
        throw error
      }

      // 网络连接错误
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.statusMessage || '连接服务器失败!',
        data: error.data
      })
    }
  }

  const get = <T = any>(url: string, query?: Record<string, any>) => {
    const options: any = { method: 'GET' }
    if (query) {
      options.query = query
    }
    return request<T>(url, options)
  }

  const post = <T = any>(url: string, body?: any) =>
    request<T>(url, { method: 'POST', body })

  const put = <T = any>(url: string, body?: any) =>
    request<T>(url, { method: 'PUT', body })

  const del = <T = any>(url: string) =>
    request<T>(url, { method: 'DELETE' })

  const upload = async (url: string, file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const fetchOptions: any = {
        method: 'POST',
        body: formData
      }

      if (onProgress) {
        // Note: $fetch doesn't support onUploadProgress, you may need to use a different approach
        console.warn('Upload progress callback is not supported with $fetch')
      }

      const response = await $fetch<ApiResponse<any>>(url, fetchOptions)

      if (response.code !== 0) {
        throw createError({
          statusCode: 400,
          statusMessage: response.message
        })
      }

      return response.data
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.statusMessage || 'Upload failed'
      })
    }
  }

  return {
    request,
    get,
    post,
    put,
    delete: del,
    upload,
    // Token 管理方法
    getAuthTokens,
    setAuthTokens,
    clearAuthTokens,
    // 构建请求头方法
    buildHeaders
  }
}