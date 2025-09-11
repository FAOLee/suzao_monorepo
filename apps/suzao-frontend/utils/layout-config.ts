// 布局配置管理
export const LAYOUT_CONFIG = {
  // 使用 special 布局的路径规则
  SPECIAL_LAYOUT_PATHS: [
    '/h5',
    '/mobile',
    '/error',  // 错误页面使用简洁布局
    '/404'     // 404页面使用简洁布局
  ],
  
  // 使用默认布局的路径规则（可选，因为默认就是 default）
  DEFAULT_LAYOUT_PATHS: [
    '/merchant',
    '/plastic',
    '/member',
    '/page'
  ]
}

// 根据路径判断应该使用的布局
export function getLayoutByPath(path: string): 'default' | 'special' {
  // 检查是否匹配 special 布局的路径
  for (const specialPath of LAYOUT_CONFIG.SPECIAL_LAYOUT_PATHS) {
    if (path.startsWith(specialPath)) {
      return 'special'
    }
  }
  
  // 默认返回 default 布局
  return 'default'
}

// 页面元数据配置助手函数
export function createPageMeta(path: string) {
  const layout = getLayoutByPath(path)
  
  if (layout === 'special') {
    return {
      layout: 'special'  // 某些页面不需要使用 layouts/special.vue
    }
  }
  
  // 默认布局无需显式配置
  return {}
}