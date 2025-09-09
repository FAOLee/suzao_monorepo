import plugin from 'tailwindcss/plugin'
import { type Config } from 'tailwindcss'

export default <Config>{
  darkMode: 'class',
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
      // 屏幕尺寸
      screens: {
        pcL: '1920px',
        pcM: '1600px',
        pcS: '1240px',
        ipadH: '992px',
        ipadV: '750px'
      },
      // 常用间距
      spacing: {
        header: '70px',
        footer: '60px',
        mainTop: '80px'
      },
      // 颜色
      colors: {
        primary: '#4141eb',
        red: '#e7232c',
        hoverRed: 'rgba(231, 35, 44, 0.5)',
        hoverColor: 'rgba(93, 93, 223, 0.5)',
        redBg: 'rgba(93, 93, 223, 0.1)',
        grayText: '#333333',
        grayText2: '#666666',
        placeholder: '#999999',
        disabled: '#e5e5e5',
        borderColor: '#efefef',
        background: '#f3f3f3',
        body: '#f5f5f5',
        wxColor: '#4fb674',
        footerBg: '#f3f3f3',
        darkFooterBg: '#1f1f1f'
      },
      maxWidth: {
        main: '1240px'
      },
      borderRadius: {
        default: '4px'
      },
      boxShadow: {
        default: '0 2px 4px rgba(229,229,229,0.5)'
      }
    }
  },
  plugins: [
    plugin(({ addUtilities, theme }) => {
      const referenceWidth = 1920
      /** pxToVW 工具（宽度、padding、margin） */
      const pxToVWUtils: Record<string, any> = {}
      for (let i = 1; i <= 500; i++) {
        const vw = (i / referenceWidth) * 100
        pxToVWUtils[`.w-${i}`] = { width: `${vw}vw` }
        pxToVWUtils[`.h-${i}`] = { height: `${vw}vw` }
        pxToVWUtils[`.p-${i}`] = { padding: `${vw}vw` }
        pxToVWUtils[`.pt-${i}`] = { paddingTop: `${vw}vw` }
        pxToVWUtils[`.pr-${i}`] = { paddingRight: `${vw}vw` }
        pxToVWUtils[`.pb-${i}`] = { paddingBottom: `${vw}vw` }
        pxToVWUtils[`.pl-${i}`] = { paddingLeft: `${vw}vw` }
        pxToVWUtils[`.m-${i}`] = { margin: `${vw}vw` }
        pxToVWUtils[`.mt-${i}`] = { marginTop: `${vw}vw` }
        pxToVWUtils[`.mr-${i}`] = { marginRight: `${vw}vw` }
        pxToVWUtils[`.mb-${i}`] = { marginBottom: `${vw}vw` }
        pxToVWUtils[`.ml-${i}`] = { marginLeft: `${vw}vw` }
      }
      addUtilities(pxToVWUtils)

      /** ellipsis 多行截断 */
      addUtilities({
        '.ellipsis-1': { overflow: 'hidden', display: '-webkit-box', '-webkit-line-clamp': '1', '-webkit-box-orient': 'vertical' },
        '.ellipsis-2': { overflow: 'hidden', display: '-webkit-box', '-webkit-line-clamp': '2', '-webkit-box-orient': 'vertical' },
        '.ellipsis-3': { overflow: 'hidden', display: '-webkit-box', '-webkit-line-clamp': '3', '-webkit-box-orient': 'vertical' }
      })
    })
  ]
}
