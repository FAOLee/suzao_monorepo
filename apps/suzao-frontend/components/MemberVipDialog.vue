<template>
  <el-dialog 
    v-model="visible" 
    class="member-dialog" 
    width="700px"
    :before-close="handleClose"
  >
    <div class="header">
      <img class="header-icon" src="/static/layouts/icon-diamond.png" alt="VIP图标" />
      <div class="header-text">
        <div class="header-title">开通超级VIP专享</div>
        <div v-if="vipStatus !== 'up'" class="header-tip">
          您还未开通会员，暂时无法享受会员权益
        </div>
      </div>
      <el-link href="/page/member-redemption" type="primary" target="_blank">
        兑换码兑换
      </el-link>
    </div>

    <div class="content">
      <ul class="content-left">
        <li class="left-title">{{ contentData.title }}</li>
        <li 
          v-for="(item, index) in contentData.list" 
          :key="index"
          class="w50"
        >
          <img class="li-img" :src="item.img" :alt="item.title" />
          <p class="li-title">{{ item.title }}</p>
          <p class="li-tip">{{ item.tip }}</p>
        </li>
      </ul>

      <div class="content-right">
        <div class="content-ul">
          <ul class="ul">
            <li 
              v-for="item in goodsList" 
              :key="item.id"
              class="li" 
              :class="{ active: goodsId === item.id }" 
              @click="selectGoods(item)"
            >
              <div class="box">
                <div v-if="item.extraNote" class="extraNote">
                  {{ item.extraNote }}
                </div>
                <p v-if="item.name" class="validityTime">{{ item.name }}</p>
                <p v-else class="validityTime">{{ item.validityTime }}天</p>
                <p class="price"><span>￥</span>{{ item.price }}</p>
                <p v-if="item.originPrice" class="originPrice">
                  ￥{{ item.originPrice }}
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div class="pay-con">
          <ul class="tab">
            <li 
              v-for="item in payTab" 
              :key="item.id"
              class="li" 
              :class="{ active: payMethod === item.id }" 
              @click="selectPayMethod(item)"
            >
              <img class="icon" :src="item.icon" :alt="item.text" />
              <div class="text">{{ item.text }}</div>
            </li>
          </ul>

          <div class="pay-con">
            <div class="con-left">
              <div class="QR-code" v-loading="!paymentUrl" id="QRCode">
                <VueQrcode 
                  v-if="paymentUrl" 
                  :value="paymentUrl" 
                  :size="100" 
                  :margin="1"
                  :color="{ dark: '#000000', light: '#ffffff' }"
                  type="image/png"
                  error-correction-level="M"
                />
              </div>
              <p>打开微信扫一扫</p>
            </div>
            <div class="con-right">
              <p class="agree-p">同意并支付</p>
              <div class="text">
                <span class="price">￥{{ selectedGoods?.price }}</span>
                <span v-if="selectedGoods?.originPrice" class="originPrice">
                  ￥{{ selectedGoods.originPrice }}
                </span>
              </div>
              <div class="agree">
                <el-checkbox v-model="agree" />
                <p class="agree-tip">
                  请阅读并同意 
                  <el-link target="_blank" href="/page/membership-agreement-service">
                    《平台信息服务协议》
                  </el-link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
/// <reference path="../types/global.d.ts" />

import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'
import VueQrcode from 'vue-qrcode'

// 类型定义
interface GoodsItem {
  id: string
  name?: string
  validityTime?: number
  price: number
  originPrice?: number
  extraNote?: string
}

interface PayMethod {
  id: string
  icon: string
  text: string
}

interface PaymentResponse {
  code: number
  data: {
    qrcode: string  // 支付URL而不是HTML
  }
}

interface ContentItem {
  img: string
  title: string
  tip: string
}

interface ContentData {
  title: string
  list: ContentItem[]
}

interface Props {
  modelValue: boolean
  vipStatus?: string
  user?: any
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'closed'): void
}

// Props 和 Emits
const props = withDefaults(defineProps<Props>(), {
  vipStatus: '',
  user: null
})

// 使用 toast
const { error: showErrorToast } = useToast()

const emit = defineEmits<Emits>()

// 响应式数据
const goodsId = ref('')
const payMethod = ref('wx_pay')
const paymentUrl = ref('')
const agree = ref(false)

// 模拟数据 - 实际项目中从API获取
const contentData = ref<ContentData>({
  title: 'VIP会员特权',
  list: [
    {
      img: '/static/vip/privilege1.png',
      title: '专属客服',
      tip: '1对1专属服务'
    },
    {
      img: '/static/vip/privilege2.png', 
      title: '数据下载',
      tip: '无限次数据导出'
    },
    {
      img: '/static/vip/privilege3.png',
      title: '高级搜索',
      tip: '更多筛选条件'
    }
  ]
})

const goodsList = ref<GoodsItem[]>([
  {
    id: '1',
    name: '月卡会员',
    validityTime: 30,
    price: 99,
    originPrice: 199,
    extraNote: '限时优惠'
  },
  {
    id: '2', 
    name: '年卡会员',
    validityTime: 365,
    price: 999,
    originPrice: 1999,
    extraNote: '最划算'
  }
])

const payTab = ref<PayMethod[]>([
  {
    id: 'wx_pay',
    icon: '/static/pay/wechat.png',
    text: '微信支付'
  },
  {
    id: 'ali_pay',
    icon: '/static/pay/alipay.png', 
    text: '支付宝'
  }
])

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedGoods = computed(() => {
  return goodsList.value.find(item => item.id === goodsId.value)
})

// 方法
const handleClose = () => {
  visible.value = false
  emit('closed')
}

const selectGoods = (item: GoodsItem) => {
  goodsId.value = item.id
  generateQRCode()
}

const selectPayMethod = (item: PayMethod) => {
  payMethod.value = item.id
  generateQRCode()
}

const generateQRCode = async () => {
  if (!selectedGoods.value || !agree.value) return
  
  try {
    paymentUrl.value = ''
    
    // 模拟生成支付二维码
    const response = await $fetch<PaymentResponse>('/api/payment/qrcode', {
      method: 'POST',
      body: {
        goodsId: goodsId.value,
        payMethod: payMethod.value,
        price: selectedGoods.value.price
      }
    })
    
    if (response.code === 200) {
      paymentUrl.value = response.data.qrcode
    }
  } catch (error) {
    console.error('生成支付二维码失败:', error)
    showErrorToast('生成支付二维码失败，请重试')
  }
}

// 监听器
watch([() => goodsId.value, () => payMethod.value, () => agree.value], () => {
  if (goodsId.value && payMethod.value && agree.value) {
    generateQRCode()
  }
})

// 初始化
onMounted(() => {
  if (goodsList.value.length > 0) {
    const firstGoods = goodsList.value[0]
    if (firstGoods?.id) {
      goodsId.value = firstGoods.id
    }
  }
})
</script>

<style scoped>
.member-dialog :deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.header-text {
  flex: 1;
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}

.header-tip {
  font-size: 14px;
  opacity: 0.9;
}

.content {
  display: flex;
  min-height: 400px;
}

.content-left {
  flex: 1;
  padding: 24px;
  background: #f8f9fa;
  border-right: 1px solid #f0f0f0;
}

.left-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.w50 {
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.li-img {
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
}

.li-title {
  font-weight: 500;
  color: #333;
  margin: 0 0 4px 0;
}

.li-tip {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.content-right {
  flex: 1;
  padding: 24px;
}

.content-ul {
  margin-bottom: 24px;
}

.ul {
  display: flex;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.li {
  flex: 1;
  cursor: pointer;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.li:hover,
.li.active {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

.box {
  padding: 16px;
  text-align: center;
  position: relative;
}

.extraNote {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f56c6c;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
}

.validityTime {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.price {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
  margin: 0;
}

.originPrice {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin: 4px 0 0 0;
}

.pay-con {
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.tab {
  display: flex;
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.tab .li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab .li:hover,
.tab .li.active {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

.tab .icon {
  width: 24px;
  height: 24px;
}

.QR-code {
  width: 120px;
  height: 120px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.con-left {
  text-align: center;
}

.con-right {
  margin-top: 16px;
}

.agree-p {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 12px 0;
}

.agree {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 16px;
}

.agree-tip {
  margin: 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.price span {
  font-size: 14px;
}

.originPrice {
  margin-left: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }
  
  .content-left,
  .content-right {
    flex: none;
  }
  
  .ul {
    flex-direction: column;
  }
  
  .tab {
    justify-content: center;
  }
}
</style>