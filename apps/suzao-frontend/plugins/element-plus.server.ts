import { ID_INJECTION_KEY } from 'element-plus'

export default defineNuxtPlugin((nuxtApp) => {
  // SSR 期间的 ID injection 配置
  if (process.server) {
    // 为每个 SSR 请求创建唯一的 ID 生成器
    const idInjection = {
      prefix: Math.floor(Math.random() * 10000),
      current: 0
    }
    
    // 提供 ID injection key
    nuxtApp.vueApp.provide(ID_INJECTION_KEY, idInjection)
    
    // Element Plus SSR 配置
    const elementPlusSSRConfig = {
      // 服务端 ID 生成策略
      namespace: 'el',
      zIndex: 2000,
      
      // 服务端不需要 Teleport 容器
      appendTo: undefined,
      
      // SSR 优化配置
      size: 'default' as const,
      button: {
        autoInsertSpace: false
      }
    }
    
    // 提供服务端配置
    nuxtApp.provide('elementPlusSSRConfig', elementPlusSSRConfig)
  }
})