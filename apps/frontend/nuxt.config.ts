// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typeCheck: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['@/assets/css/tailwind.css'],
})
