# Element Plus SSR 配置指南

## 概述

Element Plus 在 SSR 环境下需要特殊配置来处理：
- **ID injection key** - 确保服务端和客户端生成相同的组件 ID
- **Z-index 管理** - 防止弹出组件层级冲突
- **Teleport 处理** - 确保弹窗、Tooltip 等正确挂载

## 配置文件

### 1. 客户端插件 (`plugins/element-plus.client.ts`)

负责客户端的 Element Plus 配置：

```typescript
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

export default defineNuxtPlugin((nuxtApp) => {
  const elementConfig = {
    locale: zhCn,
    namespace: 'el',
    zIndex: 2000,
    appendTo: () => document.body
  }
  
  // 创建 Teleport 容器
  const ensureTeleportContainer = () => {
    if (!document.getElementById('el-teleport-container')) {
      const container = document.createElement('div')
      container.id = 'el-teleport-container'
      document.body.appendChild(container)
    }
  }
})
```

### 2. 服务端插件 (`plugins/element-plus.server.ts`)

处理 SSR 期间的 ID injection：

```typescript
import { ID_INJECTION_KEY } from 'element-plus'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) {
    const idInjection = {
      prefix: Math.floor(Math.random() * 10000),
      current: 0
    }
    
    nuxtApp.vueApp.provide(ID_INJECTION_KEY, idInjection)
  }
})
```

### 3. 配置提供者组件 (`components/ElementProvider.vue`)

统一的 Element Plus 配置组件：

```vue
<template>
  <el-config-provider 
    :locale="locale"
    :namespace="config.namespace"
    :z-index="config.zIndex"
    :size="config.size"
  >
    <slot />
  </el-config-provider>
</template>
```

### 4. Nuxt 配置 (`nuxt.config.ts`)

```typescript
export default defineNuxtConfig({
  elementPlus: {
    namespace: 'el',
    importStyle: 'scss',
    themes: ['dark'],
    injectionID: {
      prefix: 1024,
      current: 0,
    },
  }
})
```

## 使用方式

### 1. 在布局文件中使用

```vue
<!-- layouts/default.vue -->
<template>
  <ElementProvider :locale="$i18n.locale">
    <div>
      <SuzaoHeader />
      <main>
        <slot />
      </main>
    </div>
  </ElementProvider>
</template>
```

### 2. 在页面中使用 Element Plus 组件

```vue
<!-- pages/example.vue -->
<template>
  <div>
    <el-button type="primary">主要按钮</el-button>
    <el-dialog v-model="visible" title="对话框">
      <p>对话框内容</p>
    </el-dialog>
  </div>
</template>

<script setup>
const visible = ref(false)
</script>
```

## 解决的问题

### 1. ID injection key 问题

**问题**：服务端和客户端生成的组件 ID 不一致，导致 hydration 错误。

**解决方案**：
- 服务端使用 `ID_INJECTION_KEY` 提供统一的 ID 生成器
- 客户端继承相同的 ID 生成逻辑

### 2. Z-index 管理问题

**问题**：多个弹出组件可能出现层级冲突。

**解决方案**：
- 统一设置 `zIndex: 2000` 作为基础层级
- Element Plus 会自动在此基础上递增

### 3. Teleport 挂载问题

**问题**：弹窗、Tooltip 等组件在 SSR 时无法正确挂载到 body。

**解决方案**：
- 服务端不处理 Teleport，设置 `appendTo: undefined`
- 客户端动态创建 Teleport 容器
- 确保 hydration 时容器已存在

## 最佳实践

### 1. 统一配置

所有 Element Plus 相关配置通过 `ElementProvider` 组件统一管理，避免分散配置。

### 2. 响应式支持

配置支持响应式更新，如根据 i18n locale 动态切换 Element Plus 语言包。

### 3. 错误处理

在客户端插件中添加错误处理，确保即使 DOM 操作失败也不影响应用运行。

### 4. 性能优化

- 使用 `.client.ts` 和 `.server.ts` 后缀分离客户端和服务端逻辑
- 避免在服务端执行不必要的 DOM 操作

## 调试技巧

### 1. 检查 ID 一致性

```javascript
// 在浏览器控制台中检查
console.log(document.querySelectorAll('[id^="el-"]'))
```

### 2. 检查 Z-index 层级

```javascript
// 检查当前最高 z-index
Math.max(...Array.from(document.querySelectorAll('*'), el => 
  parseFloat(window.getComputedStyle(el).zIndex) || 0
))
```

### 3. 监控 Teleport 容器

```javascript
// 检查 Teleport 容器是否存在
console.log(document.querySelector('#el-teleport-container'))
```

通过以上配置，Element Plus 在 SSR 环境下将能够正常工作，避免常见的 hydration 错误和层级问题。