<template>
  <aside class="right-bar">
    <ul class="aside">
      <!-- APP下载 -->
      <li class="li">
        <div class="content">
          <div class="con">
            <i class="iconfont icon-erweima-cebianlan"></i>
          </div>
        </div>
        <div class="box one">
          <div class="left">
            <p class="p1">
              {{ $t('下载物性表APP') }}
            </p>
            <p class="p2">
              {{ $t('专业物性表查询平台') }}
            </p>
          </div>
          <img 
            :src="`/images/frontend/layouts/app.jpg?ver=${cssVersion}`"
            :alt="$t('下载物性表APP')"
          />
        </div>
      </li>

      <!-- 客服电话 -->
      <li class="li">
        <div class="content">
          <div class="con">
            <i class="iconfont icon-dianhua-cebianlan"></i>
          </div>
        </div>
        <div class="box two">
          <div class="left">
            <p class="p1">400 869 1788</p>
            <p class="p2">
              {{ $t('客服热线电话') }}
            </p>
          </div>
        </div>
      </li>

      <!-- 微信客服 -->
      <li class="li">
        <div class="content">
          <div class="con">
            <i class="iconfont icon-weixin-cebianlan"></i>
          </div>
        </div>
        <div class="box one">
          <div class="left">
            <p class="p1">
              {{ $t('在线客服') }}
            </p>
            <p class="p2">
              {{ $t('工作日') }}
            </p>
            <p class="p2">
              {{ $t('8:30-12:00 13:30-18:00') }}
            </p>
          </div>
          <img 
            :src="`/images/frontend/layouts/kefu.png?ver=${cssVersion}`"
            :alt="$t('关注公众号')"
          />
        </div>
      </li>

      <!-- 帮助 -->
      <li class="li">
        <div class="content">
          <NuxtLink 
            class="con a" 
            to="/page/help" 
            target="_blank" 
            :title="$t('常见问题')"
          >
            {{ $t('帮助') }}
          </NuxtLink>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
// 获取配置
const { public: config } = useRuntimeConfig()

// CSS 版本号，用于缓存控制
const cssVersion = computed(() => {
  return config.appVersion || '2025061101'
})
</script>

<style scoped>
@import '@/assets/less/vendor/right-bar.css';

.right-bar {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
}

.aside {
  list-style: none;
  padding: 0;
  margin: 0;
}

.li {
  position: relative;
  margin-bottom: 2px;
}

.content {
  background: #fff;
  border: 1px solid #e6e6e6;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.content:hover {
  background: #007bff;
  color: #fff;
}

.content:hover .box {
  opacity: 1;
  visibility: visible;
  transform: translateX(-100%);
}

.con {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.iconfont {
  font-size: 20px;
  color: #666;
}

.content:hover .iconfont {
  color: #fff;
}

.box {
  position: absolute;
  right: 60px;
  top: 0;
  background: #fff;
  border: 1px solid #e6e6e6;
  border-right: none;
  min-width: 200px;
  padding: 20px;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-90%);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;
}

.box.one {
  min-height: 120px;
}

.box.two {
  min-height: 60px;
}

.left {
  flex: 1;
}

.p1 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 5px 0;
}

.p2 {
  font-size: 12px;
  color: #666;
  margin: 0 0 3px 0;
  line-height: 1.4;
}

.box img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

/* 移动端隐藏 */
@media (max-width: 768px) {
  .right-bar {
    display: none;
  }
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .right-bar {
    right: -10px;
  }
}
</style>