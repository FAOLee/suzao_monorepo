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
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://wn3r59eejh.17suzao.com',
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
    // '@nuxtjs/i18n', // 暂时移除i18n模块
    '@vueuse/nuxt',
    '@element-plus/nuxt'
  ],
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
    plugins: [tsconfigPaths()],
    server: {
      proxy: {
        '/core': {
          target: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://wn3r59eejh.17suzao.com',
          changeOrigin: true,
          secure: true
        },
        '/api': {
          target: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://wn3r59eejh.17suzao.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
