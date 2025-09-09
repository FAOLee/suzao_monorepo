<template>
  <header class="suzao-navbar" :class="props.className">
    <!-- Logo -->
    <div class="logo-box">
      <NuxtLink class="logo" to="/">
        <picture>
          <source 
            media="(max-width: 1440px)" 
            :srcset="`/static/assets/share-logo.png?v=${cssVersion}`" 
          />
          <source 
            media="(min-width: 1441px)" 
            :srcset="`/static/assets/share-logo.svg?v=${cssVersion}`" 
          />
          <img 
            :src="`/static/assets/share-logo.svg?v=${cssVersion}`" 
            :alt="$t('塑造')"
          />
        </picture>
      </NuxtLink>
    </div>

    <!-- 导航菜单 -->
    <div class="nav-list">
      <NuxtLink 
        to="/merchant" 
        class="list a" 
        :class="{ active: isActiveRoute('/merchant') }"
      >
        <span>{{ $t('商城') }}</span>
      </NuxtLink>

      <NuxtLink 
        to="/plastic/ai" 
        class="list a" 
        :class="{ active: isActiveRoute('/plastic/ai') }"
      >
        <span>{{ $t('材料智能助手') }}</span>
      </NuxtLink>

      <NuxtLink 
        to="/plastic/search" 
        class="list a" 
        :class="{ active: isActiveRoute('/plastic/search') }"
      >
        <span>{{ $t('物性表') }}</span>
      </NuxtLink>

      <NuxtLink 
        to="/plastic/advance-search" 
        class="list a" 
        :class="{ active: isActiveRoute('/plastic/advance-search') }"
      >
        {{ $t('性能搜索') }}
      </NuxtLink>

      <NuxtLink 
        to="/plastic/sg-calculator" 
        class="list a" 
        :class="{ active: isActiveRoute('/plastic/sg-calculator') }"
      >
        {{ $t('改性配方编辑器') }}
      </NuxtLink>

      <!-- 产品与服务下拉菜单 -->
      <div class="down a attracting">
        <NuxtLink class="list" to="/page/attracting-merchants?tab=settled">
          <span>{{ $t('产品与服务') }}</span>
        </NuxtLink>
        <div class="box">
          <NuxtLink to="/page/attracting-merchants?tab=settled">
            {{ $t('代理商入驻服务') }}
          </NuxtLink>
          <NuxtLink to="/page/attracting-merchants?tab=app">
            {{ $t('材料智能助手APP') }}
          </NuxtLink>
          <NuxtLink to="/page/technology-and-support?tab=rnd">
            {{ $t('改性技术服务') }}
          </NuxtLink>
          <NuxtLink to="/page/technology-and-support?tab=ul">
            {{ $t('企业申请UL技术指导') }}
          </NuxtLink>
        </div>
      </div>

      <!-- APP下载 -->
      <div class="down a down-app">
        <NuxtLink class="name list" to="/page/attracting-merchants?tab=app">
          APP下载
        </NuxtLink>
        <div class="box">
          <img src="/static/images/frontend/layouts/app.jpg" alt="扫码下载塑造APP" />
          <div class="text">
            <p class="p1">扫码下载塑造APP</p>
            <p class="p2">
              <span>
                <i class="iconfont icon-icon_pingguo"></i>
                <i class="iconfont icon-a-icon_anzhuofuben"></i>
              </span>
              <span>
                <i class="iconfont icon-icon_anzhuo-18"></i>
                <i class="iconfont icon-icon_anzhuo-20"></i>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户信息区域 -->
    <div class="info">
      <!-- 报价按钮 -->
      <div class="down">
        <NuxtLink 
          v-if="user?.domain === 'a'" 
          class="a quotation hot label vibrate" 
          to="/page/merchant-registration"
          @click="trackEvent('我要报价')"
        >
          <img src="/static/assets/page/pay/quotation-btn.png" alt="" />
        </NuxtLink>
        <NuxtLink 
          v-else 
          class="a quotation hot label vibrate" 
          to="/login?refer=/page/merchant-registration"
        >
          <img src="/static/assets/page/pay/quotation-btn.png" alt="" />
        </NuxtLink>
      </div>

      <!-- VIP激活按钮 -->
      <div 
        v-if="user && vipStatus !== 'up'" 
        class="activate-vip a" 
        @click="openMemberVipDialog"
      >
        <img src="/static/assets/layout/icon-activate-vip.png" alt="" />
      </div>

      <!-- 用户菜单 -->
      <div v-if="user">
        <div 
          v-if="user.domain === 'a'" 
          class="down member2" 
          :class="{ enterprise: isEnterprise }"
        >
          <NuxtLink class="name list" to="/member">
            <span class="span">
              <img 
                v-if="vipStatus === 'up'" 
                src="/static/assets/layout/icon-vip.png" 
                alt=""
              />
              {{ $t('用户中心') }}
            </span>
            <span v-if="unreadTotal" class="tip-num">{{ unreadTotal }}</span>
          </NuxtLink>
          
          <div class="box">
            <div class="top">
              <NuxtLink class="user-name" to="/member#/personal">
                {{ memberInfo.userName }} <span>></span>
                <span class="sign-vip" :class="vipStatus">至尊会员</span>
              </NuxtLink>
              <NuxtLink 
                v-if="memberInfo.upOrderCount" 
                class="user-name" 
                to="/member#/order-list"
              >
                已投：<span class="blue">{{ memberInfo.upOrderCount }}</span>
              </NuxtLink>
            </div>
            
            <div class="center">
              <div class="left">
                <NuxtLink class="num" to="/member#/info-by-page/list">
                  {{ memberInfo.exposure }}
                </NuxtLink>
                <p class="p">商品总曝光量</p>
              </div>
              <NuxtLink class="btn" to="/page/merchant-registration">
                + 发布商品
              </NuxtLink>
            </div>
            
            <div class="member-btn bottom">
              <NuxtLink class="name list" to="/member#/personal">
                {{ $t('我的资料') }}
              </NuxtLink>
              <NuxtLink 
                v-if="isEnterprise" 
                class="name list" 
                to="/member#/order-list"
              >
                {{ $t('订单中心') }}
              </NuxtLink>
              <NuxtLink 
                v-if="isEnterprise" 
                class="name list" 
                to="/member#/info-by-page"
              >
                {{ $t('数据中心') }}
              </NuxtLink>
              <NuxtLink class="name list" to="/member#/message">
                {{ $t('消息中心') }}
                <span v-if="unread.message" class="tip-num">
                  {{ unread.message }}
                </span>
              </NuxtLink>
              <NuxtLink class="name list" to="/member#/member-interest">
                {{ $t('我的会员') }}
              </NuxtLink>
              <NuxtLink class="name list" to="/member#/fav">
                {{ $t('我的收藏') }}
              </NuxtLink>
              <NuxtLink class="name list" to="/member#/info">
                {{ $t('账户设置') }}
              </NuxtLink>
              <NuxtLink class="name list" to="/member#/suggestion">
                {{ $t('意见反馈') }}
                <span v-if="unread.suggestion" class="tip-num">
                  {{ unread.suggestion }}
                </span>
              </NuxtLink>
              <a class="name list" @click="logout">
                {{ $t('退出登录') }}
              </a>
            </div>
          </div>
        </div>
        
        <NuxtLink v-else class="name list" to="/enterprise">
          {{ $t('商家管理') }}
        </NuxtLink>
      </div>
      
      <!-- 登录按钮 -->
      <div v-else class="name list" @click="openLoginDialog">
        {{ $t('登录') }}
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
const { $t } = useI18n()

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

<style scoped>
@import '@/assets/css/vendor/top-nav.css';

.suzao-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  position: relative;
  z-index: 999;
}

.logo-box {
  flex-shrink: 0;
}

.logo img {
  height: 40px;
  width: auto;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 30px;
  flex: 1;
  justify-content: center;
}

.nav-list .list {
  color: #333;
  text-decoration: none;
  padding: 10px 0;
  transition: color 0.3s ease;
  position: relative;
}

.nav-list .list:hover,
.nav-list .list.active {
  color: #007bff;
}

.nav-list .list.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 2px;
  background: #007bff;
}

.down {
  position: relative;
}

.down .box {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 10px;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.down:hover .box {
  opacity: 1;
  visibility: visible;
}

.info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.tip-num {
  background: #ff4444;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  min-width: 18px;
  height: 18px;
  line-height: 14px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .nav-list {
    display: none;
  }
  
  .suzao-navbar {
    padding: 0 10px;
  }
}

</style>