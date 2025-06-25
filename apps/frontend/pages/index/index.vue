<template>
  <FrontendHeader />
  <div>首页</div>
  <FrontendFooter />
</template>

<script setup lang="ts">

function useSeoMeta(arg0: { title: string; description: string; keywords: string; meta: { name: string; content: string; }[]; }) {
  throw new Error("Function not implemented.");
}

useSeoMeta({
  title: '首页',
  description: '首页描述',
  keywords: '',
  meta: [
    {
      name: 'description',
      content: '首页描述'
    }
  ]
})
</script>

<style lang="scss" scoped></style>