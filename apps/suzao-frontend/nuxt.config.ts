import { defineNuxtConfig } from 'nuxt/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2025-09-09',
  devtools: { enabled: false },
  // 配置路由重定向
  nitro: {
    routeRules: {
      '/': { redirect: '/merchant' }
    }
  },
  // 路由级别的页面元数据配置
  router: {
    options: {
      // 这里可以配置全局路由选项
    }
  },
  typescript: {
    strict: true
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Suzao',
      appVersion: process.env.NUXT_PUBLIC_APP_VERSION || '1.0.0',
      appEnv: process.env.NUXT_PUBLIC_APP_ENV || 'development',
      uploadMaxSize: process.env.NUXT_PUBLIC_UPLOAD_MAX_SIZE || '10485760',
      uploadAllowedTypes: process.env.NUXT_PUBLIC_UPLOAD_ALLOWED_TYPES || 'image/jpeg,image/png,image/gif,image/webp',
      googleAnalyticsId: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
      sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN || '',
      debug: process.env.NUXT_PUBLIC_DEBUG || 'false'
    }
  },
  modules: [
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@element-plus/nuxt'
  ],
  i18n: {
    locales: [
      { code: 'zh', file: 'zh.json', name: '中文' },
      { code: 'en', file: 'en.json', name: 'English' }
    ],
    defaultLocale: 'zh',
    langDir: 'locales/',
    lazy: true,
    strategy: 'prefix_except_default',
    bundle: {
      optimizeTranslationDirective: false
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      fallbackLocale: 'zh'
    }
  },
  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/element-theme.scss',
    '@/assets/css/global.css',
    '@/assets/css/iconfont.css'
  ],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    }
  },
  vite: {
    plugins: [tsconfigPaths()]
  }
})
