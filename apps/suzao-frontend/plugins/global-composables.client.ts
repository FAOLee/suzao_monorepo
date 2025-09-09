// 确保 Nuxt composables 在客户端可用

export default defineNuxtPlugin(() => {
  // 这个插件确保所有 Nuxt composables 都被正确注册
  // 通常 Nuxt 3 会自动处理，但有时需要显式确保
  
  return {
    provide: {
      // 如果需要的话，可以在这里提供额外的全局方法
    }
  }
})