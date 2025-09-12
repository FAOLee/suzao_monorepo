<template>
  <header class="suzao-navbar">
    <!-- Logo区域 -->
    <div class="logo-box">
      <NuxtLink class="logo" to="/">
        <picture>
          <source media="(max-width: 1440px)" :srcset="`/static/share-logo.png?v=${cssVersion}`">
          <source media="(min-width: 1441px)" :srcset="`/static/share-logo.svg?v=${cssVersion}`">
          <img :src="`/static/share-logo.svg?v=${cssVersion}`" alt="塑造">
        </picture>
      </NuxtLink>
    </div>

    <!-- 导航菜单区域 -->
    <div class="nav-list">
      <!-- 商城 -->
      <NuxtLink to="/merchant" class="a list" :class="{ active: isActiveRoute('/merchant') }">
        <span>商城</span>
      </NuxtLink>

      <!-- 材料助手 -->
      <NuxtLink to="/plastic/ai" class="a list" :class="{ active: isActiveRoute('/plastic/ai') }">
        <span>材料智能助手</span>
      </NuxtLink>

      <!-- 物性表 -->
      <NuxtLink to="/plastic/search" class="a list" :class="{ active: isActiveRoute('/plastic/search') }">
        <span>物性表</span>
      </NuxtLink>

      <!-- 性能搜索 -->
      <NuxtLink to="/plastic/advance-search" class="a list"
        :class="{ active: isActiveRoute('/plastic/advance-search') }">
        <span>性能搜索</span>
      </NuxtLink>

      <!-- 公式编辑器 -->
      <NuxtLink to="/plastic/sg-calculator" class="a list" :class="{ active: isActiveRoute('/plastic/sg-calculator') }">
        <span>改性配方编辑器</span>
      </NuxtLink>

      <!-- 产品与服务下拉菜单 -->
      <div class="down attracting">
        <NuxtLink class="a list" to="/page/attracting-merchants?tab=settled">
          <span>产品与服务</span>
        </NuxtLink>
        <div class="box">
          <NuxtLink to="/page/attracting-merchants?tab=settled">
            代理商入驻服务
          </NuxtLink>
          <NuxtLink to="/page/attracting-merchants?tab=app">
            材料智能助手APP
          </NuxtLink>
          <NuxtLink to="/page/technology-and-support?tab=rnd">
            改性技术服务
          </NuxtLink>
          <NuxtLink to="/page/technology-and-support?tab=ul">
            企业申请UL技术指导
          </NuxtLink>
        </div>
      </div>

      <!-- APP下载下拉菜单 -->
      <div class="down down-app">
        <NuxtLink class="a list" to="/page/attracting-merchants?tab=app">
          APP下载
        </NuxtLink>
        <div class="box">
          <img src="/static/layouts/app.jpg" alt="扫码下载塑造APP">
          <div class="text">
            <div class="p1">扫码下载塑造APP</div>
            <div class="p2">
              <span>
                <i class="iconfont icon-icon_pingguo"></i>
                <i class="iconfont icon-a-icon_anzhuofuben"></i>
              </span>
              <span>
                <i class="iconfont icon-icon_anzhuo-18"></i>
                <i class="iconfont icon-icon_anzhuo-20"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户信息区域 -->
    <div class="info">
      <!-- 报价按钮 -->
      <div class="quotation">
        <NuxtLink v-if="user" to="/page/merchant-registration" @click="trackEvent('我要报价')">
          <img src="/static/page/pay/quotation-btn.png" alt="">
        </NuxtLink>
        <NuxtLink v-else to="/login?refer=/page/merchant-registration">
          <img src="/static/page/pay/quotation-btn.png" alt="">
        </NuxtLink>
      </div>

      <!-- VIP激活按钮 -->
      <div v-if="user && vipStatus !== 'up'" class="activate-vip" @click="openMemberVipDialog">
        <img src="/static/layouts/icon-activate-vip.png" alt="">
      </div>

      <!-- 已登录用户菜单 -->
      <div v-if="user" class="down member2" :class="{ 'enterprise': isEnterprise }">
        <div class="name list">
          <div class="span">
            <img v-if="vipStatus === 'up'" src="/static/layouts/icon-vip.png" alt="">
            用户中心
          </div>
          <span v-if="unreadTotal" class="tip-num">{{ unreadTotal }}</span>
        </div>

        <div class="box">
          <div class="top">
            <div class="user-name">
              {{ memberInfo.userName }} <span>&gt;</span>
              <span class="blue" v-if="vipStatus === 'up'">至尊会员</span>
              <span v-else>至尊会员</span>
            </div>
            <div v-if="memberInfo.upOrderCount">
              已投：<span class="blue">{{ memberInfo.upOrderCount }}</span>
            </div>
          </div>

          <div class="center" v-if="isEnterprise">
            <div class="left">
              <NuxtLink class="num" to="/member#/info-by-page/list">
                {{ memberInfo.exposure }}
              </NuxtLink>
              <div class="p">商品总曝光量</div>
            </div>
            <NuxtLink class="btn" to="/page/merchant-registration">
              + 发布商品
            </NuxtLink>
          </div>

          <div class="bottom">
            <NuxtLink class="name" to="/member#/personal">
              我的资料
            </NuxtLink>
            <NuxtLink v-if="isEnterprise" class="name" to="/member#/order-list">
              订单中心
            </NuxtLink>
            <NuxtLink v-if="isEnterprise" class="name" to="/member#/info-by-page">
              数据中心
            </NuxtLink>
            <NuxtLink class="name" to="/member#/message">
              消息
              <span v-if="unread.message" class="tip-num">{{ unread.message }}</span>
            </NuxtLink>
            <NuxtLink class="name" to="/member#/member-interest">
              我的会员
            </NuxtLink>
            <NuxtLink class="name" to="/member#/fav">
              收藏
            </NuxtLink>
            <NuxtLink class="name" to="/member#/info">
              账户设置
            </NuxtLink>
            <NuxtLink class="name" to="/member#/suggestion">
              意见反馈
              <span v-if="unread.suggestion" class="tip-num">{{ unread.suggestion }}</span>
            </NuxtLink>
            <a class="name" @click="logout">
              退出登录
            </a>
          </div>
        </div>
      </div>

      <!-- 登录按钮 -->
      <div v-else class="name list" @click="openLoginDialog">
        登录
      </div>
    </div>
  </header>

  <!-- 会员VIP对话框 -->
  <MemberVipDialog v-if="user" v-model="dialogs.memberVip" :vip-status="vipStatus" :user="user"
    @closed="initMemberDialog" />

  <!-- 登录对话框 -->
  <LoginDialog v-if="!user" v-model="dialogs.login" @login-success="handleLoginSuccess" @closed="handleLoginClosed" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 引入i18n - 已移除i18n模块，现在使用硬编码中文
// const { t: $t } = useI18n()
// const nuxtApp = useNuxtApp()


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

interface Dialogs {
  memberVip: boolean
  login: boolean
}

// Nuxt 3 Composables
const config = useRuntimeConfig()
const route = useRoute()

// 响应式数据
const user = ref<User | null>(null)
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
const dialogs = ref<Dialogs>({
  memberVip: false,
  login: false
})

// 计算属性
const cssVersion = computed(() => config.public.appVersion || '2024050801')
const isEnterprise = computed(() => user.value?.type === 'enterprise')

// 工具函数
const isActiveRoute = (path: string): boolean => {
  return route.path.startsWith(path)
}

const trackEvent = (event: string) => {
  console.log('Track event:', event)
}

const openMemberVipDialog = () => {
  dialogs.value.memberVip = true
}

const openLoginDialog = () => {
  dialogs.value.login = true
}

const closeLoginDialog = () => {
  dialogs.value.login = false
}

const initMemberDialog = () => {
  // 初始化会员对话框
}

const handleLoginSuccess = (userData: User) => {
  user.value = userData
  closeLoginDialog()
}

const handleLoginClosed = () => {
  closeLoginDialog()
}

const logout = async () => {
  user.value = null
  await navigateTo('/login')
}

// 生命周期
onMounted(() => {
  // 初始化用户状态、未读消息等
})
</script>

<style scoped lang="scss">
@import '../assets/scss/components/suzao-header.scss';
</style>