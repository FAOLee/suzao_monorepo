<template>
  <aside class="fixed right-0 bottom-1/2 z-[1000] text-[0] leading-[0]">
    <ul class="flex flex-wrap items-center flex-col rounded-[22px] shadow-[0_2px_4px_0_rgba(0,0,0,0.1)] border border-bg">
      <!-- APP下载 -->
      <li class="relative group">
        <div class="w-11 h-11 z-10 relative transition-transform duration-300 overflow-hidden first:rounded-t-[50%] last:rounded-b-[50%]">
          <div class="box-border absolute top-0 left-0 w-full h-full bg-white text-text-tertiary flex flex-wrap items-center justify-center text-xs">
            <i class="iconfont icon-erweima-cebianlan text-2xl"></i>
          </div>
        </div>
        <!-- 悬浮弹出框 -->
        <div class="pointer-events-none absolute top-0 right-0 transition-all duration-300 transform translate-x-full opacity-0 rounded bg-white shadow-[0px_2px_4px_2px_rgba(214,214,214,0.5)] flex items-center py-2.5 px-5 group-hover:opacity-100 group-hover:right-full group-hover:translate-x-[-15px]">
          <!-- 三角形箭头 -->
          <div class="absolute w-0 h-0 border-l-[5px] border-l-white border-b-[5px] border-b-transparent border-t-[5px] border-t-transparent right-0 top-[20%] translate-x-full -translate-y-1/2"></div>
          <div class="block pr-5">
            <p class="text-base text-text font-bold whitespace-nowrap leading-[1.375] mb-1">
              {{ $t('app.downloadPropertyApp') }}
            </p>
            <p class="text-xs text-text-tertiary whitespace-nowrap leading-[1.375]">
              {{ $t('app.propertyQueryPlatform') }}
            </p>
          </div>
          <img 
            :src="`/static/layouts/app.jpg?ver=${cssVersion}`"
            :alt="$t('app.downloadPropertyApp')"
            class="h-[76px]"
          />
        </div>
        <!-- 分隔线 -->
        <div class="absolute left-2.5 right-2.5 top-0 h-px bg-border z-10"></div>
      </li>

      <!-- 客服电话 -->
      <li class="relative group">
        <div class="w-11 h-11 z-10 relative transition-transform duration-300 overflow-hidden">
          <div class="box-border absolute top-0 left-0 w-full h-full bg-white text-text-tertiary flex flex-wrap items-center justify-center text-xs">
            <i class="iconfont icon-dianhua-cebianlan text-2xl"></i>
          </div>
        </div>
        <!-- 悬浮弹出框 -->
        <div class="pointer-events-none absolute top-0 right-0 transition-all duration-300 transform translate-x-full opacity-0 rounded bg-white shadow-[0px_2px_4px_2px_rgba(214,214,214,0.5)] flex items-center py-2.5 px-5 group-hover:opacity-100 group-hover:right-full group-hover:translate-x-[-15px]">
          <!-- 三角形箭头 -->
          <div class="absolute w-0 h-0 border-l-[5px] border-l-white border-b-[5px] border-b-transparent border-t-[5px] border-t-transparent right-0 top-1/2 translate-x-full -translate-y-1/2"></div>
          <div class="block pr-5">
            <p class="text-base text-text font-bold whitespace-nowrap leading-[1.375] mb-1">400 869 1788</p>
            <p class="text-xs text-text-tertiary whitespace-nowrap leading-[1.375]">
              {{ $t('app.customerServiceHotline') }}
            </p>
          </div>
        </div>
        <!-- 分隔线 -->
        <div class="absolute left-2.5 right-2.5 top-0 h-px bg-border z-10"></div>
      </li>

      <!-- 微信客服 -->
      <li class="relative group">
        <div class="w-11 h-11 z-10 relative transition-transform duration-300 overflow-hidden">
          <div class="box-border absolute top-0 left-0 w-full h-full bg-white text-text-tertiary flex flex-wrap items-center justify-center text-xs">
            <i class="iconfont icon-weixin-cebianlan text-2xl"></i>
          </div>
        </div>
        <!-- 悬浮弹出框 -->
        <div class="pointer-events-none absolute top-0 right-0 transition-all duration-300 transform translate-x-full opacity-0 rounded bg-white shadow-[0px_2px_4px_2px_rgba(214,214,214,0.5)] flex items-center py-2.5 px-5 group-hover:opacity-100 group-hover:right-full group-hover:translate-x-[-15px]">
          <!-- 三角形箭头 -->
          <div class="absolute w-0 h-0 border-l-[5px] border-l-white border-b-[5px] border-b-transparent border-t-[5px] border-t-transparent right-0 top-[20%] translate-x-full -translate-y-1/2"></div>
          <div class="block pr-5">
            <p class="text-base text-text font-bold whitespace-nowrap leading-[1.375] mb-1">
              {{ $t('app.onlineCustomerService') }}
            </p>
            <p class="text-xs text-text-tertiary whitespace-nowrap leading-[1.375]">
              {{ $t('app.workdays') }}
            </p>
            <p class="text-xs text-text-tertiary whitespace-nowrap leading-[1.375]">
              {{ $t('app.workingHours') }}
            </p>
          </div>
          <img 
            :src="`/static/layouts/kefu.png?ver=${cssVersion}`"
            :alt="$t('app.followOfficialAccount')"
            class="h-[76px]"
          />
        </div>
        <!-- 分隔线 -->
        <div class="absolute left-2.5 right-2.5 top-0 h-px bg-border z-10"></div>
      </li>

      <!-- 帮助 -->
      <li class="relative group">
        <div class="w-11 h-11 z-10 relative transition-transform duration-300 overflow-hidden rounded-b-[50%]">
          <NuxtLink 
            class="no-underline box-border absolute top-0 left-0 w-full h-full bg-white text-text-tertiary flex flex-wrap items-center justify-center text-xs group-hover:text-red group-hover:underline" 
            to="/page/help" 
            target="_blank" 
            :title="$t('app.faq')"
          >
            {{ $t('app.help') }}
          </NuxtLink>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">

// 获取配置
const { public: config } = useRuntimeConfig()

// CSS 版本号，用于缓存控制
const cssVersion = computed(() => {
  return config.appVersion || '2025061101'
})
</script>