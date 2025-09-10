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
        'header-wap': '90px',
        footer: '60px',
        mainTop: '80px'
      },
      // 颜色系统 - 统一迁移自 Less 变量
      colors: {
        // 主色系
        primary: {
          DEFAULT: '#4141eb',
          hover: '#3b3bc5',
          bg: 'rgba(93, 93, 223, 0.1)'
        },
        // 红色系
        red: {
          DEFAULT: '#e6212a',
          rgb: '#e7232c',
          hover: '#af1a20',
          bg: 'rgba(231, 35, 44, 0.1)'
        },
        // 文本色
        text: {
          DEFAULT: '#333333',
          secondary: '#666666',
          tertiary: '#999999',
          placeholder: '#8d9696'
        },
        // 背景色
        bg: {
          DEFAULT: '#f5f5f5',
          secondary: '#f3f3f3',
          footer: '#f3f3f3',
          'footer-dark': '#1f1f1f'
        },
        // 边框色
        border: {
          DEFAULT: '#e5e5e5',
          secondary: '#e9e9e9',
          light: '#efefef'
        },
        // 其他功能色
        wx: '#4fb674',
        white: '#ffffff',
        black: '#000000'
      },
      maxWidth: {
        main: '1240px'
      },
      borderRadius: {
        default: '4px'
      },
      boxShadow: {
        default: '0 2px 4px 2px rgba(229,229,229,0.5)'
      },
      // 字体大小
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px'
      }
    }
  },
  plugins: [
    plugin(({ addUtilities, addComponents, theme }) => {
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
        '.ellipsis-1': { 
          overflow: 'hidden', 
          display: '-webkit-box', 
          '-webkit-line-clamp': '1', 
          '-webkit-box-orient': 'vertical' 
        },
        '.ellipsis-2': { 
          overflow: 'hidden', 
          display: '-webkit-box', 
          '-webkit-line-clamp': '2', 
          '-webkit-box-orient': 'vertical' 
        },
        '.ellipsis-3': { 
          overflow: 'hidden', 
          display: '-webkit-box', 
          '-webkit-line-clamp': '3', 
          '-webkit-box-orient': 'vertical' 
        },
        '.ellipsis': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap'
        }
      })

      /** 自定义滚动条样式 */
      addUtilities({
        '.scrollbar': {
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px'
          },
          '&::-webkit-scrollbar-thumb': {
            'border-radius': '3px',
            'box-shadow': 'inset 0 0 6px rgba(0, 0, 0, 0.1)',
            'background-color': 'rgba(144, 147, 153, 0.3)'
          },
          '&::-webkit-scrollbar-track': {
            'background-color': 'rgba(0, 0, 0, 0)'
          }
        }
      })

      /** 布局组件 */
      addComponents({
        '.main-width': {
          width: '100%',
          'max-width': '1240px',
          'padding-left': '20px',
          'padding-right': '20px',
          margin: '0 auto',
          '@media (max-width: 992px)': {
            'padding-left': 'calc(20 / 750 * 100vw)',
            'padding-right': 'calc(20 / 750 * 100vw)'
          }
        },
        '.suzao': {
          'min-height': '100vh'
        },
        '.suzao-main': {
          'padding-top': '70px',
          display: 'flex',
          'flex-wrap': 'wrap',
          'min-height': 'calc(100vh - 70px)',
          '@media (max-width: 992px)': {
            'padding-top': '90px',
            'min-height': 'calc(100vh - 90px)'
          }
        }
      })

      /** 自定义按钮样式 */
      addComponents({
        '.suzao-btn': {
          'background-color': '#4141eb',
          'border-color': '#4141eb',
          color: '#ffffff',
          'border-radius': '20px',
          '&:hover, &:focus, &:active': {
            color: '#ffffff',
            'background-color': '#3b3bc5',
            'border-color': '#3b3bc5'
          }
        },
        '.suzao-btn-default': {
          'border-color': '#f5f5f5',
          color: '#333333',
          'background-color': '#f5f5f5',
          '&:hover, &:focus': {
            'border-color': '#f5f5f5',
            color: '#8d9696',
            'background-color': '#f5f5f5'
          }
        },
        '.suzao-border-btn': {
          'border-color': '#4141eb',
          color: '#4141eb',
          'background-color': 'transparent',
          '&:hover, &:focus': {
            'background-color': '#ffffff',
            'border-color': '#3b3bc5',
            color: '#3b3bc5'
          }
        },
        '.suzao-link': {
          color: '#4141eb',
          '&:hover, &:focus, &:active': {
            color: '#3b3bc5'
          }
        }
      })
    })
  ]
}
