<template>
  <header class="suzao-navbar">
    <div class="logo-box">
      <a class="logo" href="/">
        <picture>
          <source media="(max-width: 1440px)" srcset="/assets/frontend/share-logo.png?v=2024050801" />
          <source media="(min-width: 1441px)" srcset="/assets/frontend/share-logo.svg?v=2024050801" />
          <img src="/frontend/assets/share-logo.svg?v=2024050801" alt="塑造">
        </picture>
      </a>
      <div class="down a attracting">
        <a class="a " href="page/technologyAndSupport" @click="clickUpload('技术服务首页')">
          <img src="/frontend/assets/page/technology-and-support/technology-and-support-btn.png" alt="" srcset="">
        </a>
        <div class="box">
          <a href="page/technologyAndSupport?tab=rnd" @click="clickUpload('改性技术服务')">
            改性技术服务
          </a>
          <a href="page/technologyAndSupport?tab=ul" @click="clickUpload('企业申请UL技术指导')">
            企业申请UL技术指导
          </a>
        </div>
      </div>
    </div>
    <div class="nav-list">
      <a class="list a" href="plastic/ai">
        <span>
          材料智能助手
        </span>
      </a>
      <a class="list a new label vibrate" href="plastic/search">
        <span>
          物性表
        </span>
      </a>
      <a href="plastic/advanceSearch" class="list a">
        性能搜索
      </a>
      <a class="list a" href="plastic/sgCalculator">
        改性配方编辑器
      </a>
      <div class="down a attracting">
        <a class="list" href="page/attractingMerchants?tab=settled"><span>
            产品与服务
          </span></a>
        <div class="box">
          <a href="page/attractingMerchants?tab=settled">
            代理商入驻服务
          </a>
          <a href="page/attractingMerchants?tab=app">
            材料智能助手APP
          </a>
        </div>
      </div>

      <div class="down a down-app">
        <a class="name list" href="page/attractingMerchants?tab=app">
          <!-- <i class="iconfont icon-icon_xiazai"></i> -->
          APP下载</a>
        <div class="box">
          <img src="/images/frontend/layouts/app.jpg" alt="扫码下载塑造APP">
          <div class="text">
            <p class="p1">扫码下载塑造APP</p>
            <p class="p2">
              <span><i class="iconfont icon-icon_pingguo"></i><i class="iconfont icon-a-icon_anzhuofuben"></i></span>
              <span><i class="iconfont icon-icon_anzhuo-18"></i><i class="iconfont icon-icon_anzhuo-20"></i></span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="info">
      <div class="down">
        <a class="a quotation hot label vibrate" href="/page/merchantRegistration">
          <img src="/frontend/assets/page/pay/quotation-btn.png" alt="" srcset="">
        </a>
        <a class="a quotation hot label vibrate" href="/login?refer=/page/merchantRegistration">
          <img src="/frontend/assets/page/pay/quotation-btn.png" alt="" srcset="">
        </a>

      </div>

      <div v-if="vipStatus === 'off'" class="activate-vip a" @click="openMemberInterest">
        <img src="/frontend/assets/layout/icon-activate-vip.png" alt="">
      </div>

      <div class="down member2" :class="{ 'enterprise': isEnterprise }">
        <a class="name list" href="member">
          <span class="span"><img v-if="vipStatus === 'up'" src="/frontend/assets/layout/icon-vip.png" alt="">
            用户中心
          </span>
          <span class="tip-num" v-if="unreadTotal" v-cloak>{{ unreadTotal }}</span>
        </a>
        <div class="box">
          <div class="top">
            <a class="user-name" href="member#/personal">
              {{ merchantForm.userName }} <span>></span>
              <span class="sign-vip" :class="vipStatus">
                至尊会员
              </span>
            </a>
            <a v-if="merchantForm.upOrderCount" class="user-name" href="member#/order-list">
              已投：<span class="blue"> {{ merchantForm.upOrderCount }}</span>
            </a>
          </div>
          <div class="center">
            <div class="left">
              <a class="num" href="member/info-by-page/list">
                {{ merchantForm.exposure }}
              </a>
              <p class="p">商品总曝光量</p>
            </div>
            <a class="btn" href="page/merchantRegistration">+ 发布商品</a>
          </div>
          <div class="member-btn bottom">
            <a class="name list" href="member/personal">
              我的资料
            </a>
            <a v-if="isEnterprise" class="name list" href="member/order-list">
              订单中心
            </a>
            <a v-if="isEnterprise" class="name list" href="member/info-by-page">
              数据中心
            </a>
            <a class="name list" href="member/message">
              消息中心
              <span v-if="unread.message" class="tip-num">{{ unread.message }}</span>
            </a>
            <a class="name list" href="member#/member-interest">
              我的会员
            </a>
            <a class="name list" href="member#/fav">
              我的收藏
            </a>
            <a class="name list" href="member#/info">
              账户设置
            </a>
            <a class="name list" href="member#/suggestion">
              意见反馈
              <span v-if="unread.suggestion" class="tip-num">{{ unread.suggestion }}</span>
            </a>
            <a class="name list">
              退出登录
            </a>
          </div>
        </div>
      </div>
      <div class="name list" @click="openLoginDialog">
        登录
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const vipStatus = ref() // 'on'|'off'
const isEnterprise = ref(false)
const unreadTotal = ref(0)
const unread = ref({
  suggestion: 0,
  message: 0
})
const merchantForm = ref({
  userName: '',
  upOrderCount: 0,
  exposure: 0
})
const openLoginDialog = () => { }
const openMemberInterest = () => { }
const clickUpload = (string: string): void => { }
</script>
