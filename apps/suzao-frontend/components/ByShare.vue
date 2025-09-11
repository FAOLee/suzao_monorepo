<template>
  <!-- 内部页面链接使用 NuxtLink -->
  <NuxtLink
    v-if="item?.link && !isExternalLink(item.link)"
    class="block no-underline text-inherit cursor-pointer transition-all duration-300 hover:opacity-80"
    :to="item.link"
    @click="clickToLink(item)"
  >
    <div class="text-base text-gray-800 pb-2.5">{{ item.title }}</div>
    <div class="relative">
      <template v-if="item.video && item.video.length > 0">
        <video 
          v-for="(video, index) in item.video"
          :key="`video-${index}`"
          :src="video.url"
          v-bind="item.image?.[index]?.url ? { poster: item.image[index].url } : {}"
          x5-playsinline="true"
          playsinline
          webkit-playsinline="true"
          x-webkit-airplay="true"
          x5-video-orientation="portraint"
          style="object-fit: contain;"
          class="w-full block"
          muted
          autoplay
          loop
        />
      </template>
      
      <template v-if="item.image && item.image.length > 0">
        <img 
          v-for="(image, index) in item.image"
          :key="`image-${index}`"
          :src="image.url" 
          :alt="item.name || item.title"
          class="w-full block"
        />
      </template>
      
      <!-- 广告标签，显示链接类型 -->
      <div class="ad-label">
        广告
      </div>
    </div>
  </NuxtLink>

  <!-- 外部链接使用 a 标签 -->
  <a 
    v-else-if="item?.link && isExternalLink(item.link)" 
    class="block no-underline text-inherit cursor-pointer transition-all duration-300 hover:opacity-80" 
    :href="item.link" 
    target="_blank"
    rel="noopener noreferrer"
    @click="clickToLink(item)"
  >
    <div class="text-base text-gray-800 pb-2.5">{{ item.title }}</div>
    <div class="relative">
      <template v-if="item.video && item.video.length > 0">
        <video 
          v-for="(video, index) in item.video"
          :key="`video-${index}`"
          :src="video.url"
          v-bind="item.image?.[index]?.url ? { poster: item.image[index].url } : {}"
          x5-playsinline="true"
          playsinline
          webkit-playsinline="true"
          x-webkit-airplay="true"
          x5-video-orientation="portraint"
          style="object-fit: contain;"
          class="w-full block"
          muted
          autoplay
          loop
        />
      </template>
      
      <template v-if="item.image && item.image.length > 0">
        <img 
          v-for="(image, index) in item.image"
          :key="`image-${index}`"
          :src="image.url" 
          :alt="item.name || item.title"
          class="w-full block"
        />
      </template>
      
      <!-- 广告标签，显示链接类型 -->
      <div class="ad-label">
        {{ isH5Link(item.link) ? '广告(H5)' : '广告' }}
      </div>
    </div>
  </a>
  
  <div 
    v-else 
    class="block no-underline text-inherit cursor-pointer transition-all duration-300 hover:opacity-80" 
    @click="clickToLink(item)"
  >
    <div class="text-base text-gray-800 pb-2.5">{{ item?.title }}</div>
    <div class="relative">
      <template v-if="item?.video && item.video.length > 0">
        <video 
          v-for="(video, index) in item.video"
          :key="`video-${index}`"
          :src="video.url"
          v-bind="item.image?.[index]?.url ? { poster: item.image[index].url } : {}"
          x5-playsinline="true"
          playsinline
          webkit-playsinline="true"
          x-webkit-airplay="true"
          x5-video-orientation="portraint"
          style="object-fit: contain;"
          class="w-full block"
          muted
          autoplay
          loop
        />
      </template>
      
      <template v-if="item?.image && item.image.length > 0">
        <img 
          v-for="(image, index) in item.image"
          :key="`image-${index}`"
          :src="image.url" 
          :alt="item.title"
          class="w-full block"
        />
      </template>
      
      <!-- 广告标签 -->
      <div class="ad-label">
        广告
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/// <reference path="../types/global.d.ts" />

import { onMounted } from 'vue'

// 使用统计 API
const { countHighlight, uploadClick } = useStats()

// 类型定义
interface MediaItem {
  url: string
}

interface ShareItem {
  hash?: string
  title: string
  name?: string
  link?: string
  video?: MediaItem[]
  image?: MediaItem[]
}

// Props 定义
interface Props {
  item: ShareItem
}

const props = defineProps<Props>()

// 组件挂载时的操作
onMounted(() => {
  if (props.item?.hash) {
    countHighlight(props.item.hash, 'view')
  }
})

// 点击链接处理
const clickToLink = (item: ShareItem) => {
  if (item.hash) {
    countHighlight(item.hash, 'click')
  }
  
  if (item.link && item.link.indexOf('/page/technologyAndSupport?tab=advertise') > -1) {
    uploadClick({
      buttonName: '广告招商'
    })
  }
}

// 判断链接类型
const isExternalLink = (url: string): boolean => {
  if (!url) return false
  
  // 以 http:// 或 https:// 开头的为外部链接
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return true
  }
  
  // 以 / 开头的为内部路由
  if (url.startsWith('/')) {
    return false
  }
  
  // 包含域名的为外部链接
  if (url.includes('.com') || url.includes('.cn') || url.includes('.net') || url.includes('.org')) {
    return true
  }
  
  return false
}

// 判断是否为 H5 链接
const isH5Link = (url: string): boolean => {
  if (!url) return false
  
  // 常见的 H5 标识
  const h5Indicators = [
    '/h5/',
    '/mobile/',
    'mobile=1',
    'from=h5',
    '.m.',
    'wap.',
    'm.'
  ]
  
  return h5Indicators.some(indicator => url.includes(indicator))
}
</script>

<style scoped>
.ad-label {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 12px;
  color: white;
  line-height: 1;
  z-index: 2;
  padding-top: 2px;
  padding-bottom: 4px;
  padding-left: 6px;
  padding-right: 4px;
  border-radius: 0 0 0 6px;
  background-color: rgba(0, 0, 0, 0.15);
  transform: scale(0.75);
  transform-origin: top right;
}
</style>
