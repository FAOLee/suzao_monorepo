<template>
  <header class="w-full h-16 flex items-center justify-between px-5 bg-white border-b border-gray-200 relative z-50">
    <!-- Logo -->
    <div class="flex-shrink-0">
      <NuxtLink class="block" to="/">
        <picture>
          <source 
            media="(max-width: 1440px)" 
            :srcset="`/static/share-logo.png?v=${cssVersion}`" 
          />
          <source 
            media="(min-width: 1441px)" 
            :srcset="`/static/share-logo.svg?v=${cssVersion}`" 
          />
          <img 
            :src="`/static/share-logo.svg?v=${cssVersion}`" 
            :alt="$t('nav.塑造')"
            class="h-10 w-auto"
          />
        </picture>
      </NuxtLink>
    </div>

    <!-- 导航菜单 -->
    <div class="flex items-center gap-8 flex-1 justify-center">
      <NuxtLink 
        to="/merchant" 
        class="text-gray-700 py-2.5 transition-colors relative hover:text-blue-600"
        :class="{ 'text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-0.5 after:bg-blue-600': isActiveRoute('/merchant') }"
      >
        <span>{{ $t('nav.商城') }}</span>
      </NuxtLink>

      <NuxtLink 
        to="/plastic/ai" 
        class="text-gray-700 py-2.5 transition-colors relative hover:text-blue-600"
        :class="{ 'text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-0.5 after:bg-blue-600': isActiveRoute('/plastic/ai') }"
      >
        <span>{{ $t('header.materialsAssistant') }}</span>
      </NuxtLink>

      <NuxtLink 
        to="/plastic/search" 
        class="text-gray-700 py-2.5 transition-colors relative hover:text-blue-600"
        :class="{ 'text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-0.5 after:bg-blue-600': isActiveRoute('/plastic/search') }"
      >
        <span>{{ $t('header.propertyTable') }}</span>
      </NuxtLink>

      <NuxtLink 
        to="/plastic/advance-search" 
        class="text-gray-700 py-2.5 transition-colors relative hover:text-blue-600"
        :class="{ 'text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-0.5 after:bg-blue-600': isActiveRoute('/plastic/advance-search') }"
      >
        {{ $t('header.performanceSearch') }}
      </NuxtLink>

      <NuxtLink 
        to="/plastic/sg-calculator" 
        class="text-gray-700 py-2.5 transition-colors relative hover:text-blue-600"
        :class="{ 'text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-0.5 after:bg-blue-600': isActiveRoute('/plastic/sg-calculator') }"
      >
        {{ $t('header.formulaEditor') }}
      </NuxtLink>

      <!-- 产品与服务下拉菜单 -->
      <div class="relative group">
        <NuxtLink class="text-gray-700 py-2.5 transition-colors hover:text-blue-600" to="/page/attracting-merchants?tab=settled">
          <span>{{ $t('header.productsAndServices') }}</span>
        </NuxtLink>
        <div class="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-md p-2.5 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1000]">
          <NuxtLink 
            to="/page/attracting-merchants?tab=settled"
            class="block py-1.5 px-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            {{ $t('header.agencyService') }}
          </NuxtLink>
          <NuxtLink 
            to="/page/attracting-merchants?tab=app"
            class="block py-1.5 px-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            {{ $t('nav.材料智能助手APP') }}
          </NuxtLink>
          <NuxtLink 
            to="/page/technology-and-support?tab=rnd"
            class="block py-1.5 px-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            {{ $t('header.rndService') }}
          </NuxtLink>
          <NuxtLink 
            to="/page/technology-and-support?tab=ul"
            class="block py-1.5 px-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            {{ $t('header.ulService') }}
          </NuxtLink>
        </div>
      </div>

      <!-- APP下载 -->
      <div class="relative group">
        <NuxtLink class="text-gray-700 py-2.5 transition-colors hover:text-blue-600" to="/page/attracting-merchants?tab=app">
          APP下载
        </NuxtLink>
        <div class="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-md p-2.5 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1000]">
          <img src="/static/layout/app.jpg" alt="扫码下载塑造APP" class="w-full" />
          <div class="mt-2">
            <p class="text-sm text-gray-500">扫码下载塑造APP</p>
            <p class="text-xs text-gray-400 mt-1">
              <span class="inline-flex items-center gap-1">
                <i class="iconfont icon-icon_pingguo"></i>
                <i class="iconfont icon-a-icon_anzhuofuben"></i>
              </span>
              <span class="inline-flex items-center gap-1 ml-2">
                <i class="iconfont icon-icon_anzhuo-18"></i>
                <i class="iconfont icon-icon_anzhuo-20"></i>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户信息区域 -->
    <div class="flex items-center gap-5 flex-shrink-0">
      <!-- 报价按钮 -->
      <div class="relative group">
        <NuxtLink 
          v-if="user?.domain === 'a'" 
          class="block transition-transform hover:scale-105 active:scale-95" 
          to="/page/merchant-registration"
          @click="trackEvent('我要报价')"
        >
          <img src="/static/page/pay/quotation-btn.png" alt="" class="h-auto" />
        </NuxtLink>
        <NuxtLink 
          v-else 
          class="block transition-transform hover:scale-105 active:scale-95" 
          to="/login?refer=/page/merchant-registration"
        >
          <img src="/static/page/pay/quotation-btn.png" alt="" class="h-auto" />
        </NuxtLink>
      </div>

      <!-- VIP激活按钮 -->
      <div 
        v-if="user && vipStatus !== 'up'" 
        class="cursor-pointer transition-transform hover:scale-105 active:scale-95" 
        @click="openMemberVipDialog"
      >
        <img src="/static/layout/icon-activate-vip.png" alt="" class="h-auto" />
      </div>

      <!-- 用户菜单 -->
      <div v-if="user">
        <div 
          v-if="user.domain === 'a'" 
          class="relative group" 
          :class="{ 'enterprise': isEnterprise }"
        >
          <NuxtLink class="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors py-2.5 px-4" to="/member">
            <span class="flex items-center gap-1">
              <img 
                v-if="vipStatus === 'up'" 
                src="/static/layout/icon-vip.png" 
                alt=""
                class="w-4 h-4"
              />
              {{ $t('header.userCenter') }}
            </span>
            <span v-if="unreadTotal" class="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs min-w-[20px] text-center">{{ unreadTotal }}</span>
          </NuxtLink>
          
          <div class="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-md p-4 min-w-[250px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1000] shadow-lg">
            <div class="border-b border-gray-200 pb-3 mb-3">
              <NuxtLink class="block text-gray-700 hover:text-blue-600 transition-colors text-sm" to="/member#/personal">
                {{ memberInfo.userName }} <span class="text-gray-400">></span>
                <span class="inline-block px-2 py-0.5 text-xs rounded" :class="vipStatus === 'up' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'">至尊会员</span>
              </NuxtLink>
              <NuxtLink 
                v-if="memberInfo.upOrderCount" 
                class="block text-gray-700 hover:text-blue-600 transition-colors text-sm mt-1" 
                to="/member#/order-list"
              >
                已投：<span class="text-blue-600 font-medium">{{ memberInfo.upOrderCount }}</span>
              </NuxtLink>
            </div>
            
            <div class="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
              <div class="text-center">
                <NuxtLink class="block text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors" to="/member#/info-by-page/list">
                  {{ memberInfo.exposure }}
                </NuxtLink>
                <p class="text-xs text-gray-500 mt-1">商品总曝光量</p>
              </div>
              <NuxtLink class="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors" to="/page/merchant-registration">
                + 发布商品
              </NuxtLink>
            </div>
            
            <div class="space-y-1">
              <NuxtLink class="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors rounded text-sm" to="/member#/personal">
                {{ $t('member.myProfile') }}
              </NuxtLink>
              <NuxtLink 
                v-if="isEnterprise" 
                class="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors rounded text-sm" 
                to="/member#/order-list"
              >
                {{ $t('member.orderCenter') }}
              </NuxtLink>
              <NuxtLink 
                v-if="isEnterprise" 
                class="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors rounded text-sm" 
                to="/member#/info-by-page"
              >
                {{ $t('member.dataCenter') }}
              </NuxtLink>
              <NuxtLink class="flex items-center justify-between py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors rounded text-sm" to="/member#/message">
                <span>{{ $t('member.messages') }}</span>
                <span v-if="unread.message" class="bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs min-w-[18px] text-center">
                  {{ unread.message }}
                </span>
              </NuxtLink>
              <NuxtLink class="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors rounded text-sm" to="/member#/member-interest">
                {{ $t('member.myMembers') }}
              </NuxtLink>
              <NuxtLink class="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors rounded text-sm" to="/member#/fav">
                {{ $t('member.favorites') }}
              </NuxtLink>
              <NuxtLink class="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors rounded text-sm" to="/member#/info">
                {{ $t('member.accountSettings') }}
              </NuxtLink>
              <NuxtLink class="flex items-center justify-between py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors rounded text-sm" to="/member#/suggestion">
                <span>{{ $t('member.feedback') }}</span>
                <span v-if="unread.suggestion" class="bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs min-w-[18px] text-center">
                  {{ unread.suggestion }}
                </span>
              </NuxtLink>
              <a class="block py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors rounded text-sm cursor-pointer" @click="logout">
                {{ $t('member.logout') }}
              </a>
            </div>
          </div>
        </div>
        
        <NuxtLink v-else class="text-gray-700 hover:text-blue-600 transition-colors py-2.5 px-4" to="/enterprise">
          {{ $t('nav.商家管理') }}
        </NuxtLink>
      </div>
      
      <!-- 登录按钮 -->
      <div v-else class="text-gray-700 hover:text-blue-600 transition-colors py-2.5 px-4 cursor-pointer" @click="openLoginDialog">
        {{ $t('header.login') }}
      </div>
    </div>
  </header>

  <!-- 会员VIP对话框 -->
  <MemberVipDialog 
    v-if="user"
    v-model="dialogs.memberVip"
    :vip-status="vipStatus"
    :user="user"
    @closed="initMemberDialog"
  />

  <!-- 登录对话框 -->
  <LoginDialog 
    v-if="!user"
    v-model="dialogs.login"
    @login-success="handleLoginSuccess"
    @closed="handleLoginClosed"
  />
</template>

<script setup lang="ts">
/// <reference path="../types/global.d.ts" />

// Vue 导入
import { ref, computed, onMounted } from 'vue'

// 组件导入
import MemberVipDialog from './MemberVipDialog.vue'
import LoginDialog from './LoginDialog.vue'

// Composables
import { useDialogs } from '~/composables/useDialogs'

// 类型定义
interface User {
  id?: string
  domain?: string
  type?: string
  userName?: string
}

interface MemberInfo {
  userName: string
  upOrderCount: number
  exposure: number
}

interface Unread {
  message: number
  suggestion: number
}

// Nuxt 3 Composables - 现在 ESLint 应该能正确识别
const config = useRuntimeConfig()
const route = useRoute()

// 使用官方推荐的 Nuxt 3 + @nuxtjs/i18n 方式
const { t: $t } = useI18n()

// 响应式数据
const user = ref<User | null>(null) // 用户信息，需要从认证系统获取
const vipStatus = ref<string>('')
const unreadTotal = ref(0)
const memberInfo = ref<MemberInfo>({
  userName: '',
  upOrderCount: 0,
  exposure: 0
})
const unread = ref<Unread>({
  message: 0,
  suggestion: 0
})

// 对话框状态管理
const { dialogs, openMemberVipDialog, closeMemberVipDialog, openLoginDialog, closeLoginDialog } = useDialogs()

// 计算属性
const cssVersion = computed(() => config.public.appVersion || '2024050801')
const isEnterprise = computed(() => user.value?.type === 'enterprise')

// 工具函数
const isActiveRoute = (path: string): boolean => {
  return route.path.startsWith(path)
}

const trackEvent = (event: string) => {
  // 埋点事件跟踪
  console.log('Track event:', event)
}


const initMemberDialog = () => {
  // 初始化会员对话框
}

const handleLoginSuccess = (userData: User) => {
  user.value = userData
  closeLoginDialog()
  // 刷新用户相关数据
  // loadUserData()
}

const handleLoginClosed = () => {
  closeLoginDialog()
}

const logout = async () => {
  // 登出逻辑
  user.value = null
  await navigateTo('/login')
}

// Props
interface Props {
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
})

// 生命周期
onMounted(() => {
  // 初始化用户状态、未读消息等
})
</script>

