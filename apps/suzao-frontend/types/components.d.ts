// Vue 组件类型定义

declare global {
  // 用户相关类型
  interface User {
    id?: string
    domain?: string
    type?: string
    userName?: string
    company_type?: string
    company_id?: string
  }

  // 会员信息类型
  interface MemberInfo {
    userName: string
    upOrderCount: number
    exposure: number
  }

  // 未读消息类型
  interface UnreadMessages {
    message: number
    suggestion: number
  }

  // VIP 状态类型
  type VipStatus = 'up' | 'down' | ''

  // 设备类型
  type DeviceType = 'PC' | 'mobile'

  // 全局方法扩展
  interface Window {
    openMemberInterest?: () => void
    openLoginDialog?: () => void
    openSettledDialog?: () => void
  }
}

export {}