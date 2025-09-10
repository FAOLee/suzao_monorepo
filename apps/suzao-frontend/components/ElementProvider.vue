<template>
  <el-config-provider 
    :locale="locale"
    :namespace="config.namespace"
    :z-index="config.zIndex"
    :size="config.size"
    :button="config.button"
  >
    <slot />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import enUs from 'element-plus/dist/locale/en.mjs'

interface Props {
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'zh'
})

// 根据 i18n locale 动态选择 Element Plus locale
const locale = computed(() => {
  return props.locale === 'en' ? enUs : zhCn
})

// Element Plus 统一配置
const config = {
  namespace: 'el',
  zIndex: 2000,
  size: 'default' as const,
  button: {
    autoInsertSpace: false
  }
}

// 仅客户端处理 Teleport 相关逻辑
if (process.client) {
  onMounted(() => {
    // 确保 body 上的 Teleport 容器存在
    const ensureTeleportContainer = () => {
      if (!document.querySelector('#el-popper-container-2000')) {
        const container = document.createElement('div')
        container.id = 'el-popper-container-2000'
        container.style.cssText = 'position: absolute; top: 0; left: 0; width: 0; height: 0; pointer-events: none;'
        document.body.appendChild(container)
      }
    }
    
    ensureTeleportContainer()
  })
}
</script>

<style scoped>
/* Element Plus Provider 样式 */
</style>