import type { ApiError } from '~/types'

export const useErrorHandler = () => {
  const { $i18n } = useNuxtApp()
  const toast = useToast()

  const handleError = (error: any, showToast = true) => {
    let message = 'Unknown error'
    let statusCode = 500

    if (error?.data?.message) {
      message = error.data.message
      statusCode = error.statusCode || 400
    } else if (error?.statusMessage) {
      message = error.statusMessage
      statusCode = error.statusCode || 500
    } else if (error?.message) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    }

    // 根据状态码返回用户友好的消息
    const getUserFriendlyMessage = (code: number, originalMessage: string) => {
      switch (code) {
        case 400:
          return $i18n.t('error.badRequest')
        case 401:
          return $i18n.t('error.unauthorized')
        case 403:
          return $i18n.t('error.forbidden')
        case 404:
          return $i18n.t('error.notFound')
        case 422:
          return originalMessage // 验证错误显示原始消息
        case 429:
          return $i18n.t('error.tooManyRequests')
        case 500:
          return $i18n.t('error.serverError')
        case 502:
        case 503:
        case 504:
          return $i18n.t('error.serviceUnavailable')
        default:
          return originalMessage || $i18n.t('error.unknown')
      }
    }

    const userMessage = getUserFriendlyMessage(statusCode, message)

    if (showToast) {
      toast.error(userMessage)
    }

    // 在开发环境打印详细错误信息
    if (process.dev) {
      console.error('Error details:', error)
    }

    return {
      message: userMessage,
      originalMessage: message,
      statusCode,
      error
    }
  }

  const createErrorObject = (message: string, statusCode = 400): ApiError => ({
    statusCode,
    statusMessage: message
  })

  return {
    handleError,
    createErrorObject
  }
}