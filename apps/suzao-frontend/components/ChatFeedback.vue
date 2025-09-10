<template>
  <div :class="contentClassName" :ref="`more${item.ansId}`">
    <div class="operate-btn retry" @click="eventRetry(item)">
      <i class="iconfont icon-icon_zhongshi" /> 重试
    </div>
    <div v-if="item.ansId" class="operate-btn copy" @click="eventCopy(item)">
      <el-icon><DocumentCopy /></el-icon> 复制
    </div>
    <div 
      v-if="item.ansId" 
      :class="{ 'operate-btn': true, active: lickActive, like: true }" 
      @click="eventLike(item.ansId)"
    >
      <el-icon><Check /></el-icon> 对
    </div>
    <div 
      v-if="item.ansId" 
      :class="{ 'operate-btn': true, active: dissActive, dislikes: true }" 
      @click="eventDislikes(item.ansId)"
    >
      <el-icon><Close /></el-icon> 错
    </div>
    <div class="right-flex-end">
      <div 
        v-if="item.ansResultType === 'ENTERPRISE'" 
        class="operate-btn become" 
        @click="openBecomeDialog(item)"
      >
        <el-icon><Edit /></el-icon> 申请成为商家
      </div>
      <NuxtLink 
        v-if="!['ENTERPRISE', 'REPLACE01'].includes(item.ansResultType) && item.total > item.length" 
        class="operate-btn" 
        target="_blank"
        :to="toLink(item)"
      >
        查看更多<span class="color">{{ item.total }}条</span>相关内容
        <el-icon><ArrowRight /></el-icon>
      </NuxtLink>
      <div 
        v-if="['REPLACE01'].includes(item.ansResultType) && item.total > 6" 
        class="operate-btn text" 
        :class="{ foldingState }" 
        @click="changeList(item)"
      >
        <div class="open">查看更多 <el-icon><ArrowDown /></el-icon></div>
        <div class="close">收起 <el-icon><ArrowUp /></el-icon></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/// <reference path="../types/global.d.ts" />

import { ref, computed, onMounted, inject } from 'vue'
import { useToast } from '~/composables/useToast'
import { 
  DocumentCopy, 
  Check, 
  Close, 
  Edit, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp 
} from '@element-plus/icons-vue'

// 类型定义
interface ChatItem {
  ansId?: string
  conId?: string
  convId?: string
  className: string
  ansResultType: string
  isLike?: boolean
  isDiss?: boolean
  total: number
  length: number
  queryContent?: string
  uuid?: string
}

interface ApiResponse {
  code: number
  msg: string
}

interface Props {
  item: ChatItem
}

// Props 定义
const props = defineProps<Props>()

// 使用 toast
const { success: showSuccessToast, error: showErrorToast } = useToast()

// 数据
const foldingState = ref(false)

// Provide/Inject 函数类型定义（需要从父组件注入）
const backBottom = inject<() => void>('backBottom', () => {})
const renderStart = inject<() => void>('renderStart', () => {})
const renderEnd = inject<() => void>('renderEnd', () => {})
const openShowCorrect = inject<(ansId: string) => void>('openShowCorrect', () => {})
const handleSearch = inject<(params: any) => void>('handleSearch', () => {})
const openBecomeDialog = inject<(item: ChatItem) => void>('openBecomeDialog', () => {})
const questionAgain = inject<(ansId: string, conId: string) => void>('questionAgain', () => {})
const copyText = inject<(text: string) => void>('copyText', () => {})
const openList = inject<(ansId: string, conId: string) => void>('openList', () => {})

// 计算属性
const lickActive = computed(() => props.item.isLike)
const dissActive = computed(() => props.item.isDiss)
const contentClassName = computed(() => `${props.item.className} ${props.item.ansResultType}`)

// 生命周期
onMounted(() => {
  init()
})

const init = () => {
  renderStart()
  backBottom()
  renderEnd()
}

// 方法
const eventRetry = (item: ChatItem) => {
  if (item.ansId && item.conId) {
    questionAgain(item.ansId, item.conId)
  }
}

const eventCopy = async (item: ChatItem) => {
  const refElement = document.querySelector(`[ref="more${item.ansId}"]`)
  const divElement = refElement?.nextSibling as HTMLElement
  
  if (!divElement || !window.getSelection) return

  try {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(divElement)
    selection?.removeAllRanges()
    selection?.addRange(range)
    
    // 使用现代的 Clipboard API
    await navigator.clipboard.writeText(divElement.textContent || '')
    
    // 取消选中区域
    selection?.empty()

    // 显示成功消息
    showSuccessToast('复制成功')
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

const eventLike = async (ansId: string) => {
  try {
    const response = await $fetch<ApiResponse>('/core/dm/botAPI/likeOrDis', {
      method: 'POST',
      body: { ansId: props.item.ansId, operateType: 1 }
    })

    if (response.code === 101) {
      if (lickActive.value) {
        props.item.isLike = false
      } else {
        props.item.isLike = true
        props.item.isDiss = false
      }
    } else {
      showErrorToast(response.msg)
    }
  } catch (error) {
    console.error('Like error:', error)
  }
}

const eventDislikes = async (ansId: string) => {
  if (dissActive.value) {
    try {
      const response = await $fetch<ApiResponse>('/core/dm/botAPI/likeOrDis', {
        method: 'POST',
        body: { ansId: props.item.ansId, operateType: 2 }
      })

      if (response.code === 101) {
        if (dissActive.value) {
          props.item.isDiss = false
        } else {
          props.item.isDiss = true
          props.item.isLike = false
        }
      } else {
        showErrorToast(response.msg)
      }
    } catch (error) {
      console.error('Dislike error:', error)
    }
  } else {
    openShowCorrect(ansId)
  }
}

const changeList = (item: ChatItem) => {
  foldingState.value = !foldingState.value
  if (item.ansId && item.conId) {
    openList(item.ansId, item.conId)
  }
}

const toLink = (item: ChatItem) => {
  const url = '/plastic/search?view=4'
  const params = {
    ansId: item.ansId || '',
    convId: item.convId || '',
    queryContent: item.queryContent || '',
    ansResultType: item.ansResultType || '',
    uuid: item.uuid || ''
  }
  return url + '&' + new URLSearchParams(params).toString()
}
</script>

<style scoped>
.operate-btn {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  margin-right: 8px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
}

.operate-btn:hover {
  background: #e8f4fd;
  border-color: #409eff;
  color: #409eff;
}

.operate-btn.active {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}

.operate-btn.retry {
  background: #fef0f0;
  border-color: #fbc4c4;
  color: #f56c6c;
}

.operate-btn.copy {
  background: #f0f9ff;
  border-color: #b3d8ff;
  color: #409eff;
}

.right-flex-end {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.color {
  color: #409eff;
  font-weight: bold;
}

.text.foldingState .open {
  display: none;
}

.text .close {
  display: none;
}

.text.foldingState .close {
  display: block;
}
</style>