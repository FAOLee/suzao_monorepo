<template>
  <div class="min-h-screen flex flex-col">
    <main class="main-fullscreen">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@import '@/assets/scss/variables';

.main-fullscreen {
  min-height: 100vh;
  // 如果将来需要考虑 header/footer 的高度，可以使用以下变量：
  // min-height: calc(100vh - #{$header-height + $footer-height}px);
  // 
  // @media (max-width: $ipadH) {
  //   min-height: calc(100vh - #{$header-wap-height + $footer-height}px);
  // }
}
</style>
