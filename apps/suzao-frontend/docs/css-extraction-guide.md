# Vue文件CSS提取标准操作规范

## 目标
将Vue单文件组件中的内联CSS样式提取到独立的SCSS文件中，提高代码的可维护性和可复用性。

## 操作步骤

### 1. 创建SCSS文件
根据页面/组件类型，在对应目录下创建SCSS文件：

- **页面样式**: `assets/scss/pages/{页面名}.scss`
- **组件样式**: `assets/scss/components/{组件名}.scss`

### 2. 移动CSS内容
将Vue文件中 `<style>` 标签内的所有样式代码复制到新创建的SCSS文件中。

### 3. 更新Vue文件
将原来的内联样式替换为SCSS文件的导入：

```vue
<style scoped lang="scss">
@import '相对路径到SCSS文件';
</style>
```

### 4. 路径规则
使用Nuxt的别名系统，统一使用绝对路径：

- **页面文件**: `@import '@/assets/scss/pages/{页面名}.scss';`
- **组件文件**: `@import '@/assets/scss/components/{组件名}.scss';`

其中 `@` 是Nuxt预配置的别名，指向项目根目录。

## 示例

### 登录页面示例
```
文件结构:
├── pages/login/index.vue
├── assets/scss/pages/login.scss

Vue文件引用:
<style scoped lang="scss">
@import '@/assets/scss/pages/login.scss';
</style>
```

### 组件示例
```
文件结构:
├── components/SuzaoHeader.vue
├── assets/scss/components/suzao-header.scss

Vue文件引用:
<style scoped lang="scss">
@import '@/assets/scss/components/suzao-header.scss';
</style>
```

## 注意事项

1. **保持scoped**: 始终保持 `scoped` 属性以避免样式污染
2. **使用lang="scss"**: 明确指定使用SCSS预处理器  
3. **使用绝对路径**: 统一使用 `@/` 别名，避免相对路径的复杂性
4. **文件命名**: 使用kebab-case命名SCSS文件
5. **目录结构**: 按页面和组件分类存放SCSS文件
6. **路径一致性**: 所有项目文件都使用相同的路径规则

## 验证
完成提取后，验证页面/组件是否正常显示，确保样式没有丢失。

## 优势
- ✅ 代码组织更清晰
- ✅ 样式可复用
- ✅ 便于维护和修改
- ✅ 支持SCSS高级特性
- ✅ 减少Vue文件体积