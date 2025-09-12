<template>
  <div class="min-h-screen flex flex-col m-0 p-0">
    <SuzaoHeader />
    <main class="flex-1 main-with-header m-0 p-0">
      <NuxtPage />
    </main>
    <SuzaoFooter />
    <SuzaoBar />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
@import '@/assets/scss/variables';

.main-with-header {
  padding-top: #{$header-height}px;
  
  @media (max-width: $ipadH) {
    padding-top: #{$header-wap-height}px;
  }
}
</style>
