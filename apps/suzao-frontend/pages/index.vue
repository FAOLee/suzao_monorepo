<template>
  <div>
    <!-- 这个页面不会被显示，因为已在 nuxt.config.ts 中配置了服务器级重定向 -->
    正在跳转...
  </div>
</template>

<script setup lang="ts">
// 服务器级重定向已在 nuxt.config.ts 中配置
// nitro.routeRules: { '/': { redirect: '/plastic/ai' } }
</script>