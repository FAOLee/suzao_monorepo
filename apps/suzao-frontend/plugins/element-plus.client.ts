import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

export default defineNuxtPlugin((nuxtApp) => {
  // Element Plus SSR 配置
  const elementConfig = {
    // 国际化配置
    locale: zhCn,
    
    // SSR ID injection 配置 - 防止服务端和客户端 ID 不一致
    namespace: 'el',
    
    // Z-index 配置 - 防止层级冲突
    zIndex: 2000,
    
    // Teleport 容器配置 - 确保在客户端正确挂载
    appendTo: () => {
      if (process.client) {
        return document.body
      }
      return undefined
    },
    
    // 其他 SSR 相关配置
    size: 'default' as const,
    button: {
      autoInsertSpace: false
    }
  }

  // 全局注册 ConfigProvider
  nuxtApp.vueApp.component('ElConfigProvider', ElConfigProvider)
  
  // 为 SSR 提供全局配置
  nuxtApp.provide('elementPlusConfig', elementConfig)
  
  // 仅客户端执行 Teleport 容器检查
  if (process.client) {
    // 确保 Teleport 容器存在
    const ensureTeleportContainer = () => {
      if (!document.getElementById('el-teleport-container')) {
        const container = document.createElement('div')
        container.id = 'el-teleport-container'
        container.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;'
        document.body.appendChild(container)
      }
    }
    
    // DOM 就绪后创建容器
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', ensureTeleportContainer)
    } else {
      ensureTeleportContainer()
    }
  }
})