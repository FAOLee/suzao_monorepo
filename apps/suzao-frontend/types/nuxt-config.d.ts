// 扩展 Nuxt 配置类型以支持 Element Plus 配置
declare module '@nuxt/schema' {
  interface NuxtConfig {
    elementPlus?: {
      namespace?: string
      importStyle?: 'css' | 'scss'
      themes?: string[]
      injectionID?: {
        prefix?: number
        current?: number
      }
    }
  }
}

export {}