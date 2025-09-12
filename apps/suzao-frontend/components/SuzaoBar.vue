<template>
  <div class="right-bar">
    <div class="aside bg-white">
      <!-- APP下载 -->
      <div class="li">
        <div class="content">
          <div class="con">
            <i class="iconfont icon-erweima-cebianlan"></i>
          </div>
        </div>
        <!-- 悬浮弹出框 -->
        <div class="box one">
          <div class="left">
            <p class="p1">{{ $t('app.downloadPropertyApp') }}</p>
            <p class="p2">{{ $t('app.propertyQueryPlatform') }}</p>
          </div>
          <img 
            :src="`/static/layouts/app.jpg`"
            :alt="$t('app.downloadPropertyApp')"
          />
        </div>
      </div>

      <!-- 客服电话 -->
      <div class="li">
        <div class="content">
          <div class="con">
            <i class="iconfont icon-dianhua-cebianlan"></i>
          </div>
        </div>
        <!-- 悬浮弹出框 -->
        <div class="box two">
          <div class="left">
            <p class="p1">400 869 1788</p>
            <p class="p2">{{ $t('app.customerServiceHotline') }}</p>
          </div>
        </div>
      </div>

      <!-- 微信客服 -->
      <div class="li">
        <div class="content">
          <div class="con">
            <i class="iconfont icon-weixin-cebianlan"></i>
          </div>
        </div>
        <!-- 悬浮弹出框 -->
        <div class="box one">
          <div class="left">
            <p class="p1">{{ $t('app.onlineCustomerService') }}</p>
            <p class="p2">{{ $t('app.workdays') }}</p>
            <p class="p2">{{ $t('app.workingHours') }}</p>
          </div>
          <img 
            :src="`/static/layouts/kefu.png`"
            :alt="$t('app.followOfficialAccount')"
          />
        </div>
      </div>

      <!-- 帮助 -->
      <div class="li">
        <div class="content">
          <NuxtLink class="con a" to="/page/help" target="_blank" :title="$t('app.faq')">
            {{ $t('app.help') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/_variables.scss' as *;
@use 'sass:math';

.right-bar {
  padding: 0;
  margin: 0;
  position: fixed;
  right: 0;
  bottom: 50%;
  z-index: 1000;
  font-size: 0;
  line-height: 0;

  .aside {
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    flex-direction: column;
    border-radius: 22px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid $background-color;
  }

  .li {
    position: relative;

    &:first-of-type {
      .content {
        border-radius: 50% 50% 0 0;
      }
    }
    &:last-of-type {
      .content {
        border-radius: 0 0 50% 50%;
      }
    }

    & + .li {
      &::after {
        content: '';
        position: absolute;
        left: 10px;
        right: 10px;
        top: 0;
        height: 1px;
        background-color: $border-color;
        z-index: 1;
      }
    }

    .content {
      width: 44px;
      height: 44px;
      z-index: 1;
      position: relative;
      transition: transform 0.4s;
      overflow: hidden;

      .con {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: $white;
        color: $text-color3;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        font-size: 12px;

        &.a {
          text-decoration: none;
        }
        .iconfont {
          font-size: 24px;
        }
      }
    }

    .box {
      pointer-events: none;
      position: absolute;
      top: 0;
      right: 0;
      transition: transform 0.4s, right 0.4s, opacity 0.4s;
      transform: translateX(100%);
      opacity: 0;
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 10px 20px;
      background-color: $white;
      box-shadow: 0px 2px 4px 2px rgba(214, 214, 214, 0.5);

      &::before {
        content: '';
        position: absolute;
        right: 0px;
        top: 0;
        height: 100%;
        width: 15px;
        transform: translateX(100%);
      }

      &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-left: 5px solid $white;
        border-bottom: 5px solid transparent;
        border-top: 5px solid transparent;
        right: 0;
      }

      &.one {
        &::after {
          top: 20%;
          transform: translate(100%, -50%);
        }
      }

      &.two {
        &::after {
          top: 50%;
          transform: translate(100%, -50%);
        }
      }

      p {
        white-space: nowrap;
        line-height: 1.375;
      }

      .left {
        padding-right: 20px;
        display: block;
        .p1 {
          font-size: 16px;
          color: $text-color;
          font-weight: bold;

          + .p2 {
            padding-top: 5px;
          }
        }

        .p2 {
          font-size: 12px;
          color: $text-color3;
        }
      }

      img {
        height: 76px;
      }
    }

    &:hover {
      .content {
        .con {
          color: $red;

          &.a {
            text-decoration: underline;
          }
        }
      }
      .box {
        opacity: 1;
        right: 100%;
        transform: translateX(calc(-15px));
      }
    }
  }
}
</style>

