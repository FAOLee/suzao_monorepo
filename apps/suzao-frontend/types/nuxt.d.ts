import 'nuxt/schema'
import type { PageMeta } from 'nuxt/schema'

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
  
  // Nuxt 页面元数据函数
  const definePageMeta: (meta: PageMeta) => void
}

export {}
