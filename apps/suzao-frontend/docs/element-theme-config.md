# Element Plus 主题配置指南

## 配置方式

### 方式一：使用 SCSS 变量（推荐）

将 `assets/css/element-theme.scss` 导入到项目中：

```scss
// 在 nuxt.config.ts 中配置
export default defineNuxtConfig({
  css: [
    '@/assets/css/element-theme.scss', // 导入主题配置
    '@/assets/css/global.css'
  ]
})
```

### 方式二：通过 ElementPlus 插件配置

```typescript
// plugins/element-plus.client.ts
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ElementPlus, {
    locale: zhCn,
    // 使用 CSS 变量配置主题
    namespace: 'el',
    zIndex: 2000,
  })
})
```

### 方式三：通过 CSS 变量动态配置

```css
/* 在全局 CSS 中定义 */
:root {
  --el-color-primary: #4141eb;
  --el-color-primary-light-1: #5d5df0;
  --el-color-primary-light-2: #7070f2;
  --el-color-success: #67c23a;
  --el-color-warning: #e6a23c;
  --el-color-danger: #e6212a;
  --el-color-info: #909399;
  
  --el-text-color-primary: #333333;
  --el-text-color-regular: #666666;
  --el-text-color-secondary: #999999;
  --el-text-color-placeholder: #8d9696;
  
  --el-bg-color: #f5f5f5;
  --el-border-color: #e5e5e5;
  --el-border-radius-base: 4px;
}
```

## 主题色系

### 主色系 - 蓝色
- **主色**: `#4141eb` - 品牌主色，用于按钮、链接等
- **Hover 色**: `#3b3bc5` - 交互状态色
- **背景色**: `rgba(93, 93, 223, 0.1)` - 主色背景，10% 透明度

### 功能色系
- **成功色**: `#67c23a` - 绿色，用于成功状态
- **警告色**: `#e6a23c` - 橙色，用于警告信息  
- **错误色**: `#e6212a` - 红色，与项目红色系保持一致
- **信息色**: `#909399` - 灰色，用于信息提示

### 文本色系
- **主要文本**: `#333333` - 页面主要内容
- **常规文本**: `#666666` - 一般文本内容
- **次要文本**: `#999999` - 辅助信息文本
- **占位符**: `#8d9696` - 表单占位符文本

## 组件定制

### 按钮组件
- 圆角: `20px` - 圆角按钮设计
- 主按钮使用品牌主色
- Hover 状态有明显的视觉反馈

### 对话框组件
- 圆角: `12px` - 现代化的圆角设计
- 阴影: 自定义阴影效果

### 表单组件
- 输入框聚焦时使用主色边框
- 单选框选中时使用主色填充

## 使用建议

1. **保持一致性**: 所有 Element Plus 组件都会自动应用这套主题
2. **响应式适配**: 主题色会自动适配深色模式（如果启用）
3. **自定义扩展**: 可以基于这套配置进一步定制特定组件

## 与 Tailwind CSS 的配合

当前配置与 Tailwind CSS 主题完全同步：

```javascript
// tailwind.config.ts 中的颜色
colors: {
  primary: {
    DEFAULT: '#4141eb',    // 对应 $--color-primary
    hover: '#3b3bc5',      // 对应主色 hover 状态
    bg: 'rgba(93, 93, 223, 0.1)' // 对应主色背景
  }
}
```

这确保了 Element Plus 组件与自定义组件在视觉上的统一性。