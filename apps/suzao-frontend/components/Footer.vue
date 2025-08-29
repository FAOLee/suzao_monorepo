<template>
  <footer class="suzao-footer">
    <div class="main-width">
      <span>深圳塑造新材料技术有限公司</span>
      <span>400-869-1788</span>
      <span>service@17suzao.com</span>
      <nuxt-link to="/page/about" title="关于我们" target="_blank">关于我们</nuxt-link>
      <nuxt-link to="/page/privacyPolicy" title="隐私政策" target="_blank">隐私政策</nuxt-link>
      <nuxt-link to="/page/disclaimer" title="免责声明" target="_blank">免责声明</nuxt-link>
      <span>Copyright © 2014 - {{ year }} 17SUZAO</span>
      <a href="https://beian.miit.gov.cn" target="_blank">粤ICP备14067911号</a>
      <a href="https://main.bkt.17suzao.com/static/b220221366.png" target="_blank">
        增值电信业务经营许可证粤B2-20221366
      </a>
    </div>
  </footer>
</template>
<script setup lang="ts">
defineOptions({
  name: 'Footer',
});
const year: number = new Date().getFullYear();
</script>
