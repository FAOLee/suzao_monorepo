export type ThemeMode = 'light' | 'dark' | 'system'

export const useTheme = () => {
  const theme = useState<ThemeMode>('theme', () => 'system')

  const getSystemTheme = (): 'light' | 'dark' => {
    if (import.meta.client && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  const getActualTheme = (): 'light' | 'dark' => {
    return theme.value === 'system' ? getSystemTheme() : theme.value
  }

  const applyTheme = (actualTheme: 'light' | 'dark') => {
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', actualTheme === 'dark')
      document.documentElement.setAttribute('data-theme', actualTheme)
    }
  }

  const setTheme = (value: ThemeMode) => {
    theme.value = value
    const actualTheme = getActualTheme()
    applyTheme(actualTheme)
    
    if (import.meta.client) {
      localStorage.setItem('theme', value)
    }
  }

  const toggleTheme = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(theme.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setTheme(modes[nextIndex]!)
  }

  // 监听系统主题变化
  onMounted(() => {
    if (import.meta.client) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        if (theme.value === 'system') {
          applyTheme(getActualTheme())
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      
      // 初始化
      const saved = localStorage.getItem('theme') as ThemeMode | null
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        setTheme(saved)
      } else {
        // 首次访问，应用当前主题但不保存到localStorage
        applyTheme(getActualTheme())
      }

      // 清理函数
      onUnmounted(() => {
        mediaQuery.removeEventListener('change', handleChange)
      })
    }
  })

  return { 
    theme: readonly(theme), 
    setTheme, 
    toggleTheme, 
    getActualTheme 
  }
}
