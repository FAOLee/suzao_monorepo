export default defineNuxtPlugin(async () => {
  // 设置全局错误处理
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
  })
})