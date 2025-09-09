export const useEnv = () => {
  const config = useRuntimeConfig()

  return {
    // API配置
    apiBaseUrl: config.public.apiBaseUrl as string,
    appName: config.public.appName as string,
    appVersion: config.public.appVersion as string,
    appEnv: config.public.appEnv as string,

    // 上传配置
    uploadMaxSize: Number(config.public.uploadMaxSize) || 10485760, // 10MB
    uploadAllowedTypes: (config.public.uploadAllowedTypes as string)?.split(',') || [],

    // 第三方服务
    googleAnalyticsId: config.public.googleAnalyticsId as string,
    sentryDsn: config.public.sentryDsn as string,

    // 调试配置
    debug: config.public.debug === 'true',

    // 环境判断
    isDev: config.public.appEnv === 'development',
    isProd: config.public.appEnv === 'production',
    isTest: config.public.appEnv === 'test',
  }
}