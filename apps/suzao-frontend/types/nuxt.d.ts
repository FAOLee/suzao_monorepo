import 'nuxt/schema'

declare module 'nuxt/schema' {
  interface NuxtConfig {
    i18n?: Record<string, any>
  }
}

// 全局类型扩展
declare global {
  // 确保 Nuxt composables 被正确识别
  interface Window {
    $nuxt?: any
  }
}

export {}
