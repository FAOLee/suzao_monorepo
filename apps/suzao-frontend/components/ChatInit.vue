<template>
  <div :class="item.className">
    <div class="tip-content" :style="item.colorString">
      <div v-if="item.titleTip" class="new">{{ titleTip }}</div>
      <div v-if="item.title">{{ item.title }}</div>
      <NuxtLink 
        v-if="item.btn && item.btn.url && item.btn.content" 
        :to="item.btn.url" 
        target="_blank" 
        class="learn-more"
      >
        {{ item.btn.content }}
      </NuxtLink>
    </div>
    <div class="recommend-content">
      <div class="tip">
        <div>{{ item.tip }}</div>
        <div class="operate-btn" @click="toggle">
          <i class="iconfont icon-icon_zhongshi" /> 换一换
        </div>
      </div>
      <div class="box">
        <p v-for="text in displayText" :key="text" class="text">
          <span @click="search(text)">{{ text }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/// <reference path="../types/global.d.ts" />

import { ref, computed, onMounted } from 'vue'

// 类型定义
interface ChatButton {
  url: string
  content: string
}

interface ChatItem {
  className: string
  text: string[]
  titleTip?: string
  title?: string
  tip: string
  colorString?: string
  btn?: ChatButton
  ansId?: string
}

interface Props {
  item: ChatItem
}

// Props 定义
const props = defineProps<Props>()

// Provide/Inject 函数
const backBottom = inject<() => void>('backBottom', () => {})
const backBottom2 = inject<() => void>('backBottom2', () => {})
const renderStart = inject<() => void>('renderStart', () => {})
const renderEnd = inject<() => void>('renderEnd', () => {})
const handleSearch = inject<(params: any) => void>('handleSearch', () => {})
const myRandom = inject<(arr: any[], count: number) => any[]>('myRandom', (arr, count) => arr.slice(0, count))

// 响应式数据
const displayText = ref<string[]>([])
const titleTip = ref('')

// 计算属性
const textList = computed(() => props.item.text)

// 生命周期
onMounted(() => {
  init()
})

const init = () => {
  renderStart()
  toggle()
  updated()
  backBottom()
  renderEnd()
}

const toggle = () => {
  displayText.value = myRandom(textList.value, 4)
}

const updated = () => {
  if (!props.item.titleTip) return
  
  let i = 0
  let startTime: number | null = null
  const time = 128
  const titleText = props.item.titleTip

  const frame = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const progress = timestamp - startTime

    if (progress > time && i <= titleText.length) {
      titleTip.value += titleText.slice(i - 1, i)
      i++
      startTime = timestamp
    }
    
    if (i <= titleText.length) {
      requestAnimationFrame(frame)
    }
  }
  
  requestAnimationFrame(frame)
}

const search = (text: string) => {
  backBottom2()
  setTimeout(() => {
    handleSearch({
      key: text,
      queryType: props.item.ansId ? 4 : 2
    })
  }, 300)
}
</script>

<style scoped>
.tip-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  position: relative;
}

.new {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.learn-more {
  display: inline-block;
  margin-top: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.learn-more:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.recommend-content {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.tip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-weight: 500;
  color: #333;
}

.operate-btn {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: #409eff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.operate-btn:hover {
  background: #337ecc;
  transform: translateY(-1px);
}

.box {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.text {
  margin: 0;
  background: white;
  border-radius: 6px;
  border: 1px solid #e1e5e9;
  transition: all 0.3s ease;
}

.text span {
  display: block;
  padding: 12px 16px;
  cursor: pointer;
  color: #333;
  transition: all 0.3s ease;
}

.text:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.text span:hover {
  color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tip {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .box {
    grid-template-columns: 1fr;
  }
  
  .tip-content {
    padding: 16px;
  }
}
</style>