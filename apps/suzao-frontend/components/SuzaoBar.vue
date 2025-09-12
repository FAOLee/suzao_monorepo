<template>
  <aside class="right-bar" role="complementary" aria-label="客户服务工具栏">
    <nav class="aside bg-white" role="navigation" aria-label="客户服务选项">
      <!-- APP下载 -->
      <section class="li" aria-labelledby="app-download-label">
        <div class="content">
          <button class="con" type="button" aria-describedby="app-download-tooltip">
            <i class="iconfont icon-erweima-cebianlan" aria-hidden="true"></i>
            <span class="sr-only">下载物性表APP</span>
          </button>
        </div>
        <!-- 悬浮弹出框 -->
        <div class="box one" role="tooltip" id="app-download-tooltip">
          <div class="left">
            <p class="p1" id="app-download-label">下载物性表APP</p>
            <p class="p2">专业物性表查询平台</p>
          </div>
          <img 
            :src="`/static/layouts/app.jpg`"
            alt="下载物性表APP"
          />
        </div>
      </section>

      <!-- 客服电话 -->
      <section class="li" aria-labelledby="phone-service-label">
        <div class="content">
          <a class="con" href="tel:4008691788" aria-describedby="phone-service-tooltip">
            <i class="iconfont icon-dianhua-cebianlan" aria-hidden="true"></i>
            <span class="sr-only">客服热线电话</span>
          </a>
        </div>
        <!-- 悬浮弹出框 -->
        <div class="box two" role="tooltip" id="phone-service-tooltip">
          <div class="left">
            <p class="p1" id="phone-service-label">
              <a href="tel:4008691788">400 869 1788</a>
            </p>
            <p class="p2">客服热线电话</p>
          </div>
        </div>
      </section>

      <!-- 微信客服 -->
      <section class="li" aria-labelledby="wechat-service-label">
        <div class="content">
          <button class="con" type="button" aria-describedby="wechat-service-tooltip">
            <i class="iconfont icon-weixin-cebianlan" aria-hidden="true"></i>
            <span class="sr-only">在线客服</span>
          </button>
        </div>
        <!-- 悬浮弹出框 -->
        <div class="box one" role="tooltip" id="wechat-service-tooltip">
          <div class="left">
            <p class="p1" id="wechat-service-label">在线客服</p>
            <p class="p2">工作日</p>
            <p class="p2">8:30-12:00 13:30-18:00</p>
          </div>
          <img 
            :src="`/static/layouts/kefu.png`"
            alt="关注微信公众号"
          />
        </div>
      </section>

      <!-- 帮助 -->
      <section class="li" aria-labelledby="help-label">
        <div class="content">
          <NuxtLink class="con a" to="/page/help" target="_blank" title="常见问题" aria-label="帮助">
            <span id="help-label">帮助</span>
          </NuxtLink>
        </div>
      </section>
    </nav>
  </aside>
</template>

<style scoped lang="scss">
@import '../assets/scss/components/suzao-bar.scss';
</style>

