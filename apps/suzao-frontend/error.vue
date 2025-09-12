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
          重试
        </el-button>
        
        <el-button 
          @click="navigateToHome"
          size="default"
        >
          返回首页
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
  switch (props.error.statusCode) {
    case 404:
      return '页面未找到'
    case 500:
      return '服务器内部错误'
    case 403:
      return '禁止访问'
    default:
      return '出现了一些问题'
  }
}

// 根据错误状态码获取消息
const getErrorMessage = () => {
  switch (props.error.statusCode) {
    case 404:
      return '抱歉，您访问的页面不存在。可能是页面已被删除、移动或您输入了错误的地址。'
    case 500:
      return '服务器遇到了一个错误，无法完成您的请求。我们正在努力修复这个问题。'
    case 403:
      return '您没有权限访问此页面。请联系管理员或确认您的登录状态。'
    default:
      return '发生了意外错误。请稍后重试，如果问题持续存在请联系技术支持。'
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

</script>