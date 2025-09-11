export default defineNuxtPlugin(() => {
  // 在客户端动态设置布局
  const route = useRoute()
  
  // 监听路由变化，为特定路径设置布局
  watch(() => route.path, (path) => {
    // h5 和 mobile 路径使用 special 布局
    if (path.startsWith('/h5') || path.startsWith('/mobile')) {
      // 这里可以动态设置布局，但 Nuxt 3 中主要通过 definePageMeta 设置
      console.log('使用 special 布局:', path)
    }
  }, { immediate: true })
})