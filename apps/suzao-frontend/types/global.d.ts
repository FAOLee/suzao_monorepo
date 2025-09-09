// 全局类型声明文件

import type { Ref, ComputedRef } from 'vue'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'

declare global {
  // Nuxt 3 Runtime Config
  interface RuntimeConfig {
    public: {
      apiBaseUrl: string
      appName: string
      appVersion: string
      appEnv: string
      uploadMaxSize: string
      uploadAllowedTypes: string
      googleAnalyticsId: string
      sentryDsn: string
      debug: string
    }
  }

  // Nuxt 3 Composables
  const useRuntimeConfig: () => RuntimeConfig
  const useRoute: () => RouteLocationNormalizedLoaded
  const useRouter: () => Router
  const useNuxtApp: () => {
    $router: Router
    [key: string]: any
  }
  const navigateTo: (url: string, options?: { replace?: boolean }) => Promise<void>
  
  // I18n Composables
  const useI18n: () => {
    $t: (key: string) => string
    locale: Ref<string>
    availableLocales: string[]
  }

  // Vue 3 Composables (已经有全局定义，但为了确保)
  const ref: <T>(value: T) => Ref<T>
  const computed: <T>(getter: () => T) => ComputedRef<T>
  const onMounted: (callback: () => void) => void
  const watch: any
  const watchEffect: any
  const nextTick: () => Promise<void>

  // Fetch 相关
  const $fetch: any
}

export {}