import { createI18n } from 'vue-i18n'

export default defineNuxtPlugin(async (nuxtApp) => {
  // 动态导入语言包
  const messages = {
    en: await import('~/locales/en.json').then(m => m.default),
    zh: await import('~/locales/zh.json').then(m => m.default)
  }

  const i18n = createI18n({
    legacy: false,
    locale: 'zh',          // 默认中文
    fallbackLocale: 'zh',  // 回退也为中文
    messages,
    messageContext: null // 关键选项，禁用 linked messages
  })

  nuxtApp.vueApp.use(i18n)
})
