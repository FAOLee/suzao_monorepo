<template>
  <footer class="bg-white min-h-[40px] flex items-center m-0 p-0">
    <div class="main-width flex flex-nowrap justify-between items-center box-border gap-[3px] lg:flex-wrap lg:gap-2 lg:justify-center">
      <span class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] lg:hidden">
        深圳塑造新材料技术有限公司
      </span>
      <a 
        class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] no-underline hover:text-[#333333] hover:underline lg:hidden"
        href="tel:400-869-1788"
        title="联系电话"
      >
        400-869-1788
      </a>
      <a 
        class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] no-underline hover:text-[#333333] hover:underline lg:hidden"
        href="mailto:service@17suzao.com"
        title="联系邮箱"
      >
        service@17suzao.com
      </a>
      <NuxtLink 
        class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] no-underline hover:text-[#333333] hover:underline lg:hidden"
        to="/page/about" 
        title="关于我们" 
        target="_blank"
      >
        关于我们
      </NuxtLink>
      <NuxtLink 
        class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] no-underline hover:text-[#333333] hover:underline lg:hidden"
        to="/page/privacy-policy" 
        title="隐私政策"
        target="_blank"
      >
        隐私政策
      </NuxtLink>
      <NuxtLink 
        class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] no-underline hover:text-[#333333] hover:underline lg:hidden"
        to="/page/disclaimer" 
        title="免责声明"
        target="_blank"
      >
        免责声明
      </NuxtLink>
      <span class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px]">Copyright © 2014 - {{ currentYear }} 17SUZAO</span>
      <a 
        class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] no-underline hover:text-[#333333] hover:underline"
        href="https://beian.miit.gov.cn" 
        target="_blank"
      >
        粤ICP备14067911号
      </a>
      <a 
        class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] no-underline hover:text-[#333333] hover:underline lg:hidden"
        href="https://main.bkt.17suzao.com/static/b220221366.png" 
        target="_blank"
      >
        增值电信业务经营许可证粤B2-20221366
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">

// 获取当前年份
const currentYear = new Date().getFullYear()
</script>