import { type Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.{vue,ts}',
    './pages/**/*.{vue,ts}',
    './plugins/**/*.{ts,js}',
    './app.vue',
    './nuxt.config.ts'
  ],
  theme: {
    extend: {
      colors: {
        // 基于 _variables.scss 的颜色映射
        'text': '#333',           // $text-color
        'text-secondary': '#666', // $text-color2  
        'text-tertiary': '#999',  // $text-color3
        'border': '#e5e5e5',      // $border-color
        'bg': '#f5f5f5',          // $background-color
        'red': '#e6212a',         // $red
        'white': '#fff',          // $white
        'black': '#000'           // $black
      }
    }
  }
} satisfies Config
