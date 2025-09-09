<template>
  <NuxtLink 
    v-if="item?.link" 
    :class="`by-share ${className}`" 
    :to="item.link" 
    target="_blank"
    @click="clickToLink(item)"
  >
    <div class="title">{{ item.title }}</div>
    <div class="img">
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
        />
      </template>
    </div>
  </NuxtLink>
  
  <div 
    v-else 
    :class="`by-share ${className}`" 
    @click="clickToLink(item)"
  >
    <div class="title">{{ item?.title }}</div>
    <div class="img">
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
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
/// <reference path="../types/global.d.ts" />

import { onMounted } from 'vue'

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
  className?: string
  item: ShareItem
}

const props = withDefaults(defineProps<Props>(), {
  className: 'pc'
})

// 组件挂载时的操作
onMounted(() => {
  insertCSS('/frontend/css/components/byShare.css?ver=20231225')
  countHighlight('view')
})

// 点击链接处理
const clickToLink = (item: ShareItem) => {
  if (item.link && item.link.indexOf('/page/technologyAndSupport?tab=advertise') > -1) {
    uploadClick({
      buttonName: '广告招商'
    })
  }
  countHighlight('click')
}

// 统计点击
const uploadClick = async (data: { buttonName: string }) => {
  try {
    await $fetch('/core/Click/upload', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Upload click error:', error)
  }
}

// 统计浏览/点击
const countHighlight = (type: 'view' | 'click') => {
  if (props.item?.hash && typeof window !== 'undefined' && (window as any).suzao) {
    ;(window as any).suzao.countHighlight(props.item.hash, type)
  }
}

// 动态插入CSS
const insertCSS = (cssHref: string) => {
  if (typeof document === 'undefined') return
  if (document.getElementById('insertCSS')) return
  
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.id = 'insertCSS'
  link.href = cssHref
  document.head.appendChild(link)
}
</script>

<style scoped>
.by-share {
  display: block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
}

.by-share:hover {
  opacity: 0.8;
}

.by-share .title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
  line-height: 1.4;
}

.by-share .img {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

.by-share .img img,
.by-share .img video {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.by-share:hover .img img,
.by-share:hover .img video {
  transform: scale(1.05);
}

/* PC 端样式 */
.by-share.pc {
  /* PC 端特定样式 */
}

/* 移动端样式 */
.by-share.mobile {
  /* 移动端特定样式 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .by-share .title {
    font-size: 14px;
  }
}
</style>