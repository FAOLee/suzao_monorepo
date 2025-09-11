<template>
  <header class="suzao-navbar">
    <!-- Logo区域 -->
    <div class="logo-box">
      <NuxtLink class="logo" to="/">
        <picture>
          <source media="(max-width: 1440px)" :srcset="`/static/share-logo.png?v=${cssVersion}`">
          <source media="(min-width: 1441px)" :srcset="`/static/share-logo.svg?v=${cssVersion}`">
          <img :src="`/static/share-logo.svg?v=${cssVersion}`" :alt="$t('nav.brand') || '塑造'">
        </picture>
      </NuxtLink>
    </div>

    <!-- 导航菜单区域 -->
    <div class="nav-list">
      <!-- 商城 -->
      <NuxtLink to="/merchant" class="a list" :class="{ active: isActiveRoute('/merchant') }">
        <span>{{ $t('nav.shop') || '商城' }}</span>
      </NuxtLink>

      <!-- 材料助手 -->
      <NuxtLink to="/plastic/ai" class="a list" :class="{ active: isActiveRoute('/plastic/ai') }">
        <span>{{ $t('header.materialsAssistant') || '材料助手' }}</span>
      </NuxtLink>

      <!-- 物性表 -->
      <NuxtLink to="/plastic/search" class="a list" :class="{ active: isActiveRoute('/plastic/search') }">
        <span>{{ $t('header.propertyTable') || '物性表' }}</span>
      </NuxtLink>

      <!-- 性能搜索 -->
      <NuxtLink to="/plastic/advance-search" class="a list"
        :class="{ active: isActiveRoute('/plastic/advance-search') }">
        <span>{{ $t('header.performanceSearch') || '性能搜索' }}</span>
      </NuxtLink>

      <!-- 公式编辑器 -->
      <NuxtLink to="/plastic/sg-calculator" class="a list" :class="{ active: isActiveRoute('/plastic/sg-calculator') }">
        <span>{{ $t('header.formulaEditor') || '公式编辑器' }}</span>
      </NuxtLink>

      <!-- 产品与服务下拉菜单 -->
      <div class="down attracting">
        <NuxtLink class="a list" to="/page/attracting-merchants?tab=settled">
          <span>{{ $t('header.productsAndServices') || '产品与服务' }}</span>
        </NuxtLink>
        <div class="box">
          <NuxtLink to="/page/attracting-merchants?tab=settled">
            {{ $t('header.agencyService') || '代理服务' }}
          </NuxtLink>
          <NuxtLink to="/page/attracting-merchants?tab=app">
            {{ $t('nav.materialsAssistantApp') || '材料智能助手APP' }}
          </NuxtLink>
          <NuxtLink to="/page/technology-and-support?tab=rnd">
            {{ $t('header.rndService') || '研发服务' }}
          </NuxtLink>
          <NuxtLink to="/page/technology-and-support?tab=ul">
            {{ $t('header.ulService') || 'UL服务' }}
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
            {{ $t('header.userCenter') || '用户中心' }}
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
              {{ $t('member.myProfile') || '我的资料' }}
            </NuxtLink>
            <NuxtLink v-if="isEnterprise" class="name" to="/member#/order-list">
              {{ $t('member.orderCenter') || '订单中心' }}
            </NuxtLink>
            <NuxtLink v-if="isEnterprise" class="name" to="/member#/info-by-page">
              {{ $t('member.dataCenter') || '数据中心' }}
            </NuxtLink>
            <NuxtLink class="name" to="/member#/message">
              {{ $t('member.messages') || '消息' }}
              <span v-if="unread.message" class="tip-num">{{ unread.message }}</span>
            </NuxtLink>
            <NuxtLink class="name" to="/member#/member-interest">
              {{ $t('member.myMembers') || '我的会员' }}
            </NuxtLink>
            <NuxtLink class="name" to="/member#/fav">
              {{ $t('member.favorites') || '收藏' }}
            </NuxtLink>
            <NuxtLink class="name" to="/member#/info">
              {{ $t('member.accountSettings') || '账户设置' }}
            </NuxtLink>
            <NuxtLink class="name" to="/member#/suggestion">
              {{ $t('member.feedback') || '意见反馈' }}
              <span v-if="unread.suggestion" class="tip-num">{{ unread.suggestion }}</span>
            </NuxtLink>
            <a class="name" @click="logout">
              {{ $t('member.logout') || '退出登录' }}
            </a>
          </div>
        </div>
      </div>

      <!-- 登录按钮 -->
      <div v-else class="name list" @click="openLoginDialog">
        {{ $t('header.login') || '登录' }}
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

<style scoped>
/* 基础容器样式 */
.suzao-navbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 21;
  padding-top: 13px;
  padding-bottom: 13px;
  padding-left: 20px;
  padding-right: 20px;
  height: 70px;
}

.suzao-navbar::after {
  content: '';
  position: absolute;
  height: 1px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #e5e5e5;
}

.suzao-navbar a {
  text-decoration: none;
}

/* Logo区域 */
.logo-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.logo-box,
.logo,
.logo img {
  height: 100%;
}

.logo {
  padding-top: 0;
  padding-bottom: 0;
}

/* 导航区域 */
.nav-list {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
}

.nav-list .down+.down {
  margin-left: 5px;
}

/* 导航项样式 */
.list {
  display: block;
  font-size: 16px;
  border-radius: 12px;
  padding: 12px;
  line-height: 1;
  color: #333333;
}

.list:hover {
  background-color: rgba(93, 93, 223, 0.1);
}

.a {
  box-sizing: border-box;
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
}

/* AI激活状态 */
.ai-active span {
  background: linear-gradient(90deg, #ebfbff 0%, #dbf5ff 42%, #b3e2ff 100%);
  border-radius: 12px;
  border: 1px solid #b5e3ff;
  padding: 12px;
  display: inline-block;
}

.ai-active:hover span {
  background: linear-gradient(90deg, #d1f0f7 0%, #98d0f4 100%);
}

.ai-active.list {
  padding: 0;
}

.ai-active.list:hover {
  background-color: transparent;
}

/* 激活状态 */
.list.active {
  position: relative;
}

.list.active:hover {
  background-color: rgba(0, 0, 0, 0);
}

.list.active::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 4px;
  background: #4141eb;
  border-radius: 10px;
}

/* 下拉菜单 */
.down {
  position: relative;
  font-size: 0;
  line-height: 0;
}

.down+.name,
.down+.down {
  margin-left: 18px;
}

.down .box {
  background-color: #ffffff;
  height: 0;
  overflow: hidden;
  transition: 0.4s;
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  padding-left: 15px;
  padding-right: 15px;
  right: 50%;
  bottom: 0;
  transform: translate(50%, 100%);
  z-index: 1;
}

.down .box a {
  position: relative;
}

.down:hover .box {
  box-shadow: 0px 2px 4px 2px rgba(214, 214, 214, 0.5);
}

/* APP下载特殊样式 */
.down-app .box {
  width: 252px;
  background: #ffffff;
  border-radius: 12px;
}

.down-app:hover .box {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 15px;
  padding-right: 15px;
  height: auto;
  bottom: 0;
  display: flex;
  align-items: center;
}

.down-app .box img {
  width: 76px;
  height: auto;
  flex-shrink: 0;
}

.down-app .box .text {
  padding-left: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.down-app .box .p1 {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  line-height: 1.5;
  text-align: center;
}

.down-app .box .p2 {
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  line-height: 1.4;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.down-app .box .p2 span {
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #333333;
  padding: 2px 4px;
  vertical-align: middle;
}

.down-app .box .p2 .icon-icon_anzhuo-18 {
  color: #34d874;
}

.down-app .box .p2 .iconfont {
  font-size: 16px;
  vertical-align: middle;
}

.down-app .box .text .p1+.p2 {
  margin-top: 5px;
}

.down-app .box .text .iconfont+.iconfont {
  margin-left: 3px;
}

/* 招商下拉菜单 */
.attracting .box {
  width: 165px;
  border-radius: 8px;
}

.attracting .box a {
  font-size: 14px;
  font-weight: 400;
  line-height: 2.25;
  color: #999999;
  width: 100%;
  text-align: center;
}

.attracting .box a:hover {
  background: #f5f5f5;
  border-radius: 8px;
  color: #333333;
}

.attracting:hover .box {
  border: 1px solid #f5f5f5;
  padding: 12px;
  height: auto;
  bottom: 0;
}

/* 用户信息区域 */
.info {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.info .name {
  border: 1px solid rgba(93, 93, 223, 0.1);
  display: block;
  cursor: pointer;
}

.info .name .iconfont {
  line-height: 14px;
}

.info .name:hover {
  border-color: rgba(93, 93, 223, 0.1);
}

/* 报价按钮 */
.quotation img {
  max-width: 135px;
}

/* VIP激活按钮 */
.activate-vip {
  margin-left: 12px;
  margin-right: 12px;
  width: 115px;
  cursor: pointer;
}

.activate-vip img {
  width: 100%;
}

/* 消息提示数字 */
.tip-num {
  position: absolute;
  right: -3px;
  top: -3px;
  background: #fe3b30;
  border-radius: 8px;
  color: #ffffff;
  min-width: 16px;
  font-size: 12px;
  height: 16px;
  line-height: 1;
  padding: 2px;
  text-align: center;
}

/* 用户菜单样式 */
.member2 {
  padding: 0;
}

.member2 .span {
  display: flex;
  align-items: center;
}

.member2 .span img {
  margin-right: 3px;
  width: 29px;
  display: inline-block;
}

.member2 .box {
  font-size: 16px;
  line-height: 1;
  width: 385px;
  border-radius: 8px;
  right: 0;
  transform: translateY(100%);
  display: block;
}

.member2 .box .top,
.member2 .box .center,
.member2 .box .bottom {
  width: 100%;
}

.member2 .box .center {
  display: none;
}

.member2 .box .top {
  display: flex;
  justify-content: space-between;
}

.member2 .box .user-name {
  font-size: 20px;
  line-height: 1;
  color: #333333;
  font-weight: bold;
}

.member2 .box .user-name span {
  color: #c4c4c4;
}

.member2 .box .user-name .blue {
  color: #4a49d7;
}

.member2 .box .bottom {
  display: flex;
  flex-wrap: wrap;
}

.member2 .box .bottom .name {
  box-sizing: border-box;
  margin-top: 18px;
  width: calc(33.33% - 12px);
  text-align: center;
}

.member2 .box .bottom .name:not(:nth-of-type(3n)) {
  margin-right: 18px;
}

.member2 .box .bottom .name:hover {
  background: #f5f5f5;
  border-radius: 8px;
  color: #333333;
}

.member2:hover .box {
  box-shadow: 0px 0px 10px 0px rgba(134, 134, 134, 0.5);
  border: 1px solid #f5f5f5;
  padding: 15px;
  height: auto;
  bottom: 0;
}

.member2.enterprise .box .top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.member2.enterprise .box .center {
  margin-top: 20px;
  padding: 15px 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to top, #f9f7f8 0%, #e8e4fe 100%);
  border-radius: 8px;
  border: 1px solid #f6f4ff;
}

.member2.enterprise .box .center .left {
  display: block;
  width: auto;
  pointer-events: all;
}

.member2.enterprise .box .center .left .num {
  font-size: 28px;
  color: #333333;
  line-height: 40px;
}

.member2.enterprise .box .center .left .p {
  font-size: 14px;
  color: #666666;
}

.member2.enterprise .box .center .btn {
  padding: 18px 26px;
  background: linear-gradient(90deg, #fff0da 0%, #ffe9c8 24%, #ffdeb3 100%);
  box-shadow: 0px 2px 4px 0px #dfb782;
  border-radius: 28px;
  border: 1px solid #f5f5f5;
  font-size: 18px;
  color: #452206;
}

.member2.enterprise:hover .box {
  height: 350px;
}

/* 响应式样式 - 移动端 */
@media (max-width: 992px) {
  .suzao-navbar {
    padding-top: calc(14 / 750 * 100vw);
    padding-bottom: calc(14 / 750 * 100vw);
    padding-left: calc(30 / 750 * 100vw);
    padding-right: calc(30 / 750 * 100vw);
    height: calc(90 / 750 * 100vw);
  }

  .logo {
    padding-top: 0;
    padding-bottom: 0;
  }

  .nav-list,
  .info {
    display: none;
  }
}
</style>