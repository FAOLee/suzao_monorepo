/**
 * 运行时配置组合函数
 * 用于获取应用的环境配置
 */
export const useAppConfig = () => {
  const config = useRuntimeConfig()
  
  return {
    // API配置
    apiBaseUrl: config.public.apiBaseUrl,
    
    // 应用配置
    appName: config.public.appName,
    appVersion: config.public.appVersion,
    appEnv: config.public.appEnv,
    
    // 上传配置
    uploadMaxSize: Number(config.public.uploadMaxSize),
    uploadAllowedTypes: config.public.uploadAllowedTypes.split(','),
    
    // 调试配置
    isDebug: config.public.debug === 'true',
    
    // 第三方服务
    googleAnalyticsId: config.public.googleAnalyticsId,
    sentryDsn: config.public.sentryDsn,
    
    // 环境判断
    isDevelopment: config.public.appEnv === 'development',
    isProduction: config.public.appEnv === 'production',
  }
}

/**
 * 开发环境配置验证
 */
export const validateEnvironmentConfig = () => {
  const config = useAppConfig()
  
  const issues: string[] = []
  
  // 必需配置检查
  if (!config.apiBaseUrl) {
    issues.push('API_BASE_URL 未配置')
  }
  
  if (!config.appName) {
    issues.push('APP_NAME 未配置')
  }
  
  if (!config.appVersion) {
    issues.push('APP_VERSION 未配置')
  }
  
  // URL 格式检查
  if (config.apiBaseUrl && !config.apiBaseUrl.startsWith('http')) {
    issues.push('API_BASE_URL 格式不正确，应该以 http 或 https 开头')
  }
  
  // 生产环境特殊检查
  if (config.isProduction) {
    if (config.isDebug) {
      issues.push('生产环境不应该开启调试模式')
    }
    
    if (config.apiBaseUrl?.includes('localhost')) {
      issues.push('生产环境不应该使用 localhost API')
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    config
  }
}