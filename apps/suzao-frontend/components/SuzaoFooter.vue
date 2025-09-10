<template>
  <footer class="suzao-footer">
    <div class="main-width">
      <span class="wapdn">
        {{ $t('深圳塑造新材料技术有限公司') }}
      </span>
      <span class="wapdn">400-869-1788</span>
      <span class="wapdn">service@17suzao.com</span>
      <NuxtLink 
        class="wapdn" 
        to="/page/about" 
        :title="$t('关于我们')" 
        target="_blank"
      >
        {{ $t('关于我们') }}
      </NuxtLink>
      <NuxtLink 
        class="wapdn" 
        to="/page/privacy-policy" 
        :title="$t('隐私政策')"
        target="_blank"
      >
        {{ $t('隐私政策') }}
      </NuxtLink>
      <NuxtLink 
        class="wapdn" 
        to="/page/disclaimer" 
        :title="$t('免责声明')"
        target="_blank"
      >
        {{ $t('免责声明') }}
      </NuxtLink>
      <span>Copyright © 2014 - {{ currentYear }} 17SUZAO</span>
      <a href="https://beian.miit.gov.cn" target="_blank">
        {{ $t('粤ICP备14067911号') }}
      </a>
      <a 
        class="wapdn" 
        href="https://main.bkt.17suzao.com/static/b220221366.png" 
        target="_blank"
      >
        {{ $t('增值电信业务经营许可证粤B2-20221366') }}
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 获取当前年份
const currentYear = new Date().getFullYear()
</script>

<style scoped>
@import '@/assets/less/vendor/footer.css';

.suzao-footer {
  background-color: #f8f9fa;
  padding: 20px 0;
  border-top: 1px solid #e9ecef;
}

.main-width {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: #666;
}

.main-width > * {
  white-space: nowrap;
}

.main-width a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.main-width a:hover {
  color: #007bff;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .wapdn {
    display: none !important;
  }
  
  .main-width {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}
</style>