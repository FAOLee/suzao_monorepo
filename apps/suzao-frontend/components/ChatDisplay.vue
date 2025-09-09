<template>
  <div 
    :class="loading ? `cursor ${item.className}` : item.className" 
    v-html="htmlString"
  />
</template>

<script setup lang="ts">
/// <reference path="../types/global.d.ts" />

import { computed, onMounted, inject } from 'vue'

// 类型定义
interface ChatItem {
  htmlString: string
  transitionLoading: boolean
  className: string
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

// 计算属性
const htmlString = computed(() => props.item.htmlString)
const loading = computed(() => props.item.transitionLoading)

// 生命周期
onMounted(() => {
  init()
})

const init = () => {
  renderStart()
  backBottom()
  renderEnd()
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

// 暴露 search 方法给模板中可能的点击事件使用
defineExpose({
  search
})
</script>

<style scoped>
.cursor {
  position: relative;
}

.cursor::after {
  content: '|';
  animation: blink 1s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

/* 聊天内容样式 */
:deep(.chat-content) {
  line-height: 1.6;
  color: #333;
}

:deep(.chat-content p) {
  margin: 8px 0;
}

:deep(.chat-content code) {
  background: #f5f5f5;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

:deep(.chat-content pre) {
  background: #f8f8f8;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 12px 0;
}

:deep(.chat-content blockquote) {
  border-left: 4px solid #409eff;
  padding-left: 16px;
  margin: 12px 0;
  color: #666;
  font-style: italic;
}

:deep(.chat-content ul),
:deep(.chat-content ol) {
  padding-left: 20px;
  margin: 8px 0;
}

:deep(.chat-content li) {
  margin: 4px 0;
}

:deep(.chat-content table) {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
}

:deep(.chat-content th),
:deep(.chat-content td) {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

:deep(.chat-content th) {
  background: #f5f5f5;
  font-weight: bold;
}

:deep(.chat-content a) {
  color: #409eff;
  text-decoration: none;
}

:deep(.chat-content a:hover) {
  text-decoration: underline;
}
</style>