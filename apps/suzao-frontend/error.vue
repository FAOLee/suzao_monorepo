<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <!-- SEO Head 配置 -->
    <Head>
      <Title>{{ error.statusCode }} - {{ getErrorTitle() }}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <Meta name="description" :content="getErrorMessage()" />
      <Meta property="og:title" :content="`${error.statusCode} - ${getErrorTitle()}`" />
      <Meta property="og:type" content="website" />
    </Head>
    <div class="max-w-md mx-auto text-center px-6">
      <!-- 状态码 -->
      <div class="mb-8">
        <h1 class="text-8xl font-light text-gray-300 mb-4 tracking-tight">
          {{ error.statusCode }}
        </h1>
        <div class="w-16 h-0.5 bg-gray-300 mx-auto"></div>
      </div>
      
      <!-- 错误信息 -->
      <div class="mb-10">
        <h2 class="text-2xl font-medium text-gray-800 mb-3 tracking-wide">
          {{ getErrorTitle() }}
        </h2>
        <p class="text-gray-600 leading-relaxed text-sm">
          {{ getErrorMessage() }}
        </p>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex gap-3 justify-center">
        <el-button 
          type="primary"
          @click="handleError" 
          size="default"
        >
          {{ safeTranslate('error.retry', 'Retry') }}
        </el-button>
        
        <el-button 
          @click="navigateToHome"
          size="default"
        >
          {{ safeTranslate('error.backHome', 'Back to Home') }}
        </el-button>
      </div>
      
      <!-- 错误详情 -->
      <!-- <div class="mt-12 text-xs text-gray-400 font-mono">
        {{ error.statusCode }}
        <span v-if="error.statusMessage"> · {{ error.statusMessage }}</span>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// 简化导入

// 定义props接收错误信息
interface Props {
  error: {
    statusCode: number
    statusMessage?: string
  }
}

const props = defineProps<Props>()

// 根据错误状态码获取标题
const getErrorTitle = () => {
  const titleKey = (() => {
    switch (props.error.statusCode) {
      case 404:
        return 'error.pageNotFound'
      case 500:
        return 'error.serverError'
      case 403:
        return 'error.forbidden'
      default:
        return 'error.somethingWrong'
    }
  })()
  
  return safeTranslate(titleKey, getDefaultTitle(props.error.statusCode))
}

// 根据错误状态码获取消息
const getErrorMessage = () => {
  const messageKey = (() => {
    switch (props.error.statusCode) {
      case 404:
        return 'error.pageNotFoundMessage'
      case 500:
        return 'error.serverErrorMessage'
      case 403:
        return 'error.forbiddenMessage'
      default:
        return 'error.unknownMessage'
    }
  })()
  
  return safeTranslate(messageKey, getDefaultMessage(props.error.statusCode))
}

// 默认标题（fallback）
const getDefaultTitle = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return 'Page Not Found'
    case 500:
      return 'Internal Server Error'
    case 403:
      return 'Access Denied'
    default:
      return 'Something Went Wrong'
  }
}

// 默认消息（fallback）
const getDefaultMessage = (statusCode: number) => {
  switch (statusCode) {
    case 404:
      return 'Sorry, the page you are looking for does not exist.'
    case 500:
      return 'The server encountered an error and could not complete your request.'
    case 403:
      return 'You do not have permission to access this page.'
    default:
      return 'An unexpected error occurred. Please try again later.'
  }
}

// 错误处理函数
const handleError = () => {
  // 简单刷新页面
  window.location.reload()
}

// 导航到首页
const navigateToHome = () => {
  navigateTo('/')
}

// 国际化函数
const { $t } = useNuxtApp()

// 安全的翻译函数
const safeTranslate = (key: string, fallback: string): string => {
  try {
    return $t(key) || fallback
  } catch (e) {
    return fallback
  }
}
</script>