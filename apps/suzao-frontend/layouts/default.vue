<template>
  <div class="flex flex-col min-h-screen">
    <SuzaoHeader />
    <main class="flex-1 bg-white dark:bg-black text-black dark:text-white">
      <NuxtPage />
    </main>
    <SuzaoFooter />
    <SuzaoBar />
  </div>
</template>

<!-- <script setup>
definePageMeta({
  layout: 'special'  // 某些页面不需要 使用 layouts/special.vue
})
</script> -->
<script setup lang="ts"></script>
