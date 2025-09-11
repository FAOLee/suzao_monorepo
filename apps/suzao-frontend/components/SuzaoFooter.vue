<template>
  <footer class="bg-white min-h-[40px] flex items-center">
    <div class="main-width flex flex-nowrap justify-between items-center box-border gap-[3px] lg:flex-wrap lg:gap-2 lg:justify-center">
      <span class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] lg:hidden">
        {{ $t('footer.company') }}
      </span>
      <a 
        class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] no-underline hover:text-[#333333] hover:underline lg:hidden"
        href="tel:400-869-1788"
        :title="$t('footer.phone', '联系电话')"
      >
        400-869-1788
      </a>
      <a 
        class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] no-underline hover:text-[#333333] hover:underline lg:hidden"
        href="mailto:service@17suzao.com"
        :title="$t('footer.email', '联系邮箱')"
      >
        service@17suzao.com
      </a>
      <NuxtLink 
        class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] no-underline hover:text-[#333333] hover:underline lg:hidden"
        to="/page/about" 
        :title="$t('footer.about')" 
        target="_blank"
      >
        {{ $t('footer.about') }}
      </NuxtLink>
      <NuxtLink 
        class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] no-underline hover:text-[#333333] hover:underline lg:hidden"
        to="/page/privacy-policy" 
        :title="$t('footer.privacyPolicy')"
        target="_blank"
      >
        {{ $t('footer.privacyPolicy') }}
      </NuxtLink>
      <NuxtLink 
        class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] no-underline hover:text-[#333333] hover:underline lg:hidden"
        to="/page/disclaimer" 
        :title="$t('footer.disclaimer')"
        target="_blank"
      >
        {{ $t('footer.disclaimer') }}
      </NuxtLink>
      <span class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px]">Copyright © 2014 - {{ currentYear }} 17SUZAO</span>
      <a 
        class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] no-underline hover:text-[#333333] hover:underline"
        href="https://beian.miit.gov.cn" 
        target="_blank"
      >
        {{ $t('footer.beian') }}
      </a>
      <a 
        class="whitespace-nowrap flex-shrink-0 transition-colors duration-400 text-[12px] leading-[1.2] text-[#8d9696] mx-[3px] no-underline hover:text-[#333333] hover:underline lg:hidden"
        href="https://main.bkt.17suzao.com/static/b220221366.png" 
        target="_blank"
      >
        {{ $t('footer.license') }}
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">

// 获取当前年份
const currentYear = new Date().getFullYear()
</script>