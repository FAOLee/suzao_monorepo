import type { ApiResponse, ApiError } from '~/types'

export interface ApiOptions {
  baseURL?: string
  headers?: Record<string, string>
  timeout?: number
}

export const useApi = (options: ApiOptions = {}) => {
  const { $i18n } = useNuxtApp()
  
  const defaultHeaders = computed(() => ({
    'Content-Type': 'application/json',
    'Accept-Language': $i18n.locale.value,
    ...options.headers
  }))

  const request = async <T = any>(
    url: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
      body?: any
      headers?: Record<string, string>
      query?: Record<string, any>
    } = {}
  ): Promise<T> => {
    try {
      const response = await $fetch<ApiResponse<T>>(url, {
        method: options.method || 'GET',
        headers: {
          ...defaultHeaders.value,
          ...options.headers
        },
        body: options.body,
        query: options.query,
        timeout: options.timeout || 10000,
        onResponseError({ response }) {
          if (response.status === 401) {
            throw createError({
              statusCode: 401,
              statusMessage: 'Unauthorized'
            })
          }
        }
      })

      if (response.code !== 0) {
        throw createError({
          statusCode: 400,
          statusMessage: response.message,
          data: response
        })
      }

      return response.data
    } catch (error: any) {
      if (error.data?.code) {
        throw error
      }
      
      throw createError({
        statusCode: error.statusCode || 500,
        statusMessage: error.statusMessage || 'Request failed',
        data: error.data
      })
    }
  }

  const get = <T = any>(url: string, query?: Record<string, any>) =>
    request<T>(url, { method: 'GET', query })

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
      const response = await $fetch<ApiResponse<any>>(url, {
        method: 'POST',
        headers: defaultHeaders.value,
        body: formData,
        onUploadProgress: onProgress ? (progress) => {
          onProgress(Math.round((progress.loaded / progress.total) * 100))
        } : undefined
      })

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
    upload
  }
}