import { type Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.{vue,ts}',
    './pages/**/*.{vue,ts}',
    './plugins/**/*.{ts,js}',
    './app.vue',
    './nuxt.config.ts'
  ]
} satisfies Config
