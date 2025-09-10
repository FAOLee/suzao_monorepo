/**
 * 统计相关 API
 */
import { parseFormData, getUserAgent } from '@suzao/utils'

export interface CountHighlightParams {
  hash: string
  type: 'view' | 'click' | 'phone'
}

export interface UploadClickParams {
  buttonName: string
}

export interface CellphoneClickParams {
  [key: string]: string | number | boolean
}

export interface StatisticsLogParams {
  [key: string]: string | number
}

// 统一的客户端类型判断
const getClientType = (): '1' | '2' => {
  return ['PC'].includes(getUserAgent()) ? '1' : '2'
}

// 统一的请求头生成
const getCommonHeaders = () => ({
  'Client-Type': getClientType()
})

// 统一的表单数据请求头
const getFormHeaders = () => getCommonHeaders()

// 统一的JSON请求头
const getJsonHeaders = () => ({
  ...getCommonHeaders(),
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json'
})

// 统一的错误处理函数
const handleApiError = (operation: string, error: any, shouldThrow = false) => {
  console.error(`${operation} failed:`, error)
  if (shouldThrow) {
    throw error
  }
}

export const useStats = () => {
  const api = useApi()

  /**
   * 统计浏览/点击
   * @param hash 内容哈希
   * @param type 统计类型
   */
  const countHighlight = async (hash: string, type: 'view' | 'click' | 'phone' = 'view') => {
    if (!hash) return

    try {
      const data = { type, hash }
      
      await $fetch('/vendor/countHighlightV2', {
        method: 'POST',
        body: parseFormData(data),
        headers: getFormHeaders()
      })
    } catch (error) {
      handleApiError('Count highlight', error)
    }
  }

  /**
   * 上传点击统计
   * @param data 点击数据
   */
  const uploadClick = async (data: UploadClickParams) => {
    try {
      await api.post('/core/Click/upload', data)
    } catch (error) {
      handleApiError('Upload click', error, true)
    }
  }

  /**
   * 点击手机号统计
   * @param data 点击数据
   */
  const clickCellphone = async (data: CellphoneClickParams) => {
    try {
      await $fetch('/core/logEnterprise/clickCellphone', {
        method: 'POST',
        body: data,
        headers: getJsonHeaders()
      })
    } catch (error) {
      handleApiError('Click cellphone', error, true)
    }
  }

  /**
   * 统计日志
   * @param data 日志数据
   */
  const statisticsLog = async (data: StatisticsLogParams) => {
    try {
      await $fetch('/vendor/log', {
        method: 'POST',
        body: parseFormData(data),
        headers: getFormHeaders()
      })
    } catch (error) {
      handleApiError('Statistics log', error, true)
    }
  }

  return {
    countHighlight,
    uploadClick,
    statisticsLog,
    clickCellphone
  }
}