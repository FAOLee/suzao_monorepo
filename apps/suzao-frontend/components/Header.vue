<template>
  <header class="suzao-navbar">
    <div class="logo-box">
      <nuxt-link class="logo" href="/">
        <picture>
          <source media="(max-width: 1440px)" srcset="/public/static/share-logo.png?v=2024050801" />
          <source media="(min-width: 1441px)" srcset="/public/static/share-logo.svg?v=2024050801" />
          <img src="/public/static/share-logo.svg?v=2024050801" alt="塑造" />
        </picture>
      </nuxt-link>
      <div class="down a attracting">
        <nuxt-link class="a" href="/page/technologyAndSupport">
          <img
            src="/public/static/page/technology-and-support/technology-and-support-btn.png"
            alt=""
            srcset=""
          />
        </nuxt-link>
        <div class="box">
          <nuxt-link href="/page/technologyAndSupport?tab=rnd"> 改性技术服务 </nuxt-link>
          <nuxt-link href="/page/technologyAndSupport?tab=ul"> 企业申请UL技术指导 </nuxt-link>
        </div>
      </div>
    </div>
    <div class="nav-list">
      <nuxt-link class="list a" href="/plastic/ai">
        <span> 材料智能助手 </span>
      </nuxt-link>
      <nuxt-link class="list a new label vibrate" href="/plastic/search">
        <span> 物性表 </span>
      </nuxt-link>
      <nuxt-link href="/plastic/advanceSearch" class="list a"> 性能搜索 </nuxt-link>
      <nuxt-link class="list a" href="/plastic/sgCalculator"> 改性配方编辑器 </nuxt-link>
      <div class="down a attracting">
        <nuxt-link class="list" href="/page/attracting-merchants?tab=settled"
          ><span> 产品与服务 </span></nuxt-link
        >
        <div class="box">
          <nuxt-link href="/page/attracting-merchants?tab=settled"> 代理商入驻服务 </nuxt-link>
          <nuxt-link href="/page/attracting-merchants?tab=app"> 材料智能助手APP </nuxt-link>
        </div>
      </div>

      <div class="down a down-app">
        <nuxt-link class="name list" href="/page/attracting-merchants?tab=app">
          <!-- <i class="iconfont icon-icon_xiazai"></i> -->
          APP下载
        </nuxt-link>
        <div class="box">
          <img src="/public/static/layout/app.jpg" alt="扫码下载塑造APP" />
          <div class="text">
            <p class="p1">扫码下载塑造APP</p>
            <p class="p2">
              <span
                ><i class="iconfont icon-icon_pingguo"></i
                ><i class="iconfont icon-a-icon_anzhuofuben"></i
              ></span>
              <span
                ><i class="iconfont icon-icon_anzhuo-18"></i
                ><i class="iconfont icon-icon_anzhuo-20"></i
              ></span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="info">
      <div class="down">
        <nuxt-link class="a quotation hot label vibrate" href="/page/merchant-registration">
          <img src="/public/static/page/pay/quotation-btn.png" alt="" srcset="" />
        </nuxt-link>
        <nuxt-link
          class="a quotation hot label vibrate"
          href="/login?refer=/page/merchant-registration"
        >
          <img src="/public/static/page/pay/quotation-btn.png" alt="" srcset="" />
        </nuxt-link>
      </div>
      <div v-if="vipStatus === 'off'" class="activate-vip a" @click="openMemberInterest">
        <img src="/public/static/layout/icon-activate-vip.png" alt="" />
      </div>
      <div class="down member2" :class="{ enterprise: isEnterprise }">
        <nuxt-link class="name list" href="/member">
          <span class="span"
            ><img v-if="vipStatus === 'up'" src="/public/static/layout/icon-vip.png" alt="" />
            用户中心
          </span>
          <span class="tip-num" v-if="unreadTotal" v-cloak>{{ unreadTotal }}</span>
        </nuxt-link>
        <div class="box">
          <div class="top">
            <nuxt-link class="user-name" href="/member/personal">
              {{ merchantForm.userName }} <span>></span>
              <span class="sign-vip" :class="vipStatus"> 至尊会员 </span>
            </nuxt-link>
            <nuxt-link v-if="merchantForm.upOrderCount" class="user-name" href="/member/order-list">
              已投：<span class="blue"> {{ merchantForm.upOrderCount }}</span>
            </nuxt-link>
          </div>
          <div class="center">
            <div class="left">
              <nuxt-link class="num" href="/member/info-by-page/list">
                {{ merchantForm.exposure }}
              </nuxt-link>
              <p class="p">商品总曝光量</p>
            </div>
            <nuxt-link class="btn" href="/page/merchant-registration">+ 发布商品</nuxt-link>
          </div>
          <div class="member-btn bottom">
            <nuxt-link class="name list" href="/member/personal"> 我的资料 </nuxt-link>
            <nuxt-link v-if="isEnterprise" class="name list" href="/member/order-list">
              订单中心
            </nuxt-link>
            <nuxt-link v-if="isEnterprise" class="name list" href="/member/info-by-page">
              数据中心
            </nuxt-link>
            <nuxt-link class="name list" href="/member/message">
              消息中心
              <span v-if="unread.message" class="tip-num">{{ unread.message }}</span>
            </nuxt-link>
            <nuxt-link class="name list" href="/member/interest"> 我的会员 </nuxt-link>
            <nuxt-link class="name list" href="/member/fav"> 我的收藏 </nuxt-link>
            <nuxt-link class="name list" href="/member/info"> 账户设置 </nuxt-link>
            <nuxt-link class="name list" href="/member/suggestion">
              意见反馈
              <span v-if="unread.suggestion" class="tip-num">{{ unread.suggestion }}</span>
            </nuxt-link>
            <nuxt-link class="name list"> 退出登录 </nuxt-link>
          </div>
        </div>
      </div>
      <div class="name list" @click="openLoginDialog">登录</div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Header',
});
import { ref } from 'vue';
const vipStatus = ref('off'); // 'on'|'off'
const isEnterprise = ref(false);
const unreadTotal = ref(0);
const unread = ref({
  suggestion: 0,
  message: 0,
});
const merchantForm = ref({
  userName: '',
  upOrderCount: 0,
  exposure: 0,
});
const isLogin = ref(false);
const openLoginDialog = () => {};
const openMemberInterest = () => {};
</script>
