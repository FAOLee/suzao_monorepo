export * from './auth'

export interface ApiError {
  statusCode: number
  statusMessage: string
  data?: any
}

export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimetype: string
}