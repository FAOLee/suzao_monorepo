<template>
  <el-dialog 
    v-model="visible" 
    class="login-dialog" 
    :close-on-click-modal="false"
    width="988px"
    :before-close="handleClose"
  >
    <div class="login-box">
      <!-- 左侧图片区域 -->
      <div class="login-pic">
        <ByShare 
          v-for="item in shareItems" 
          :key="item.id"
          :item="item" 
        />
      </div>

      <!-- 右侧登录内容 -->
      <div class="login-content" v-loading="loading">
        <div class="top">
          <!-- 账号密码登录 -->
          <div v-if="activeTab === 0" class="title poab-top">
            <div class="logo">
              <img src="/frontend/assets/share-logo.svg" alt="Logo" />
            </div>
          </div>

          <!-- 微信扫码登录 -->
          <div v-else-if="activeTab === 1" class="title">
            微信扫码登录
            <div class="tip">未注册的微信号将自动创建塑造账号</div>
          </div>

          <!-- 完善信息 -->
          <div v-else-if="activeTab === 2" class="title">
            完善信息
          </div>

          <!-- 登录表单 -->
          <el-tabs 
            v-if="activeTab === 0" 
            :class="{ wx: isWeChat }" 
            v-model="activeName" 
            @tab-click="handleTabClick"
          >
            <!-- 账号密码登录 -->
            <el-tab-pane label="账号密码" name="login">
              <el-form 
                ref="loginFormRef" 
                :model="loginForm" 
                :rules="loginRules"
                @submit.prevent="submitLogin"
              >
                <el-form-item prop="username">
                  <el-input 
                    v-model="loginForm.username" 
                    placeholder="输入手机/邮箱" 
                    name="username" 
                    type="text"
                  />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input 
                    v-model="loginForm.password" 
                    type="password" 
                    placeholder="输入密码" 
                    @keyup.enter="submitLogin"
                  />
                </el-form-item>
                <el-form-item class="btn-box tar">
                  <el-button 
                    class="suzao-btn" 
                    type="primary" 
                    @click="submitLogin"
                    :loading="loading"
                  >
                    登录
                  </el-button>
                  <el-link href="/login/forget">忘记密码？</el-link>
                  <el-link @click="switchToRegister">免费注册</el-link>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 短信验证码登录 -->
            <el-tab-pane label="短信验证码" name="sms">
              <el-form 
                ref="smsFormRef" 
                :model="smsForm" 
                :rules="smsRules"
                @submit.prevent="submitSmsLogin"
              >
                <el-form-item prop="cellphone">
                  <el-input 
                    v-model="smsForm.cellphone" 
                    placeholder="输入手机号"
                    @input="checkCaptcha"
                  />
                </el-form-item>
                <el-form-item prop="captcha">
                  <div id="captcha-element"></div>
                </el-form-item>
                <el-form-item prop="smsCode" class="code">
                  <el-input 
                    v-model="smsForm.smsCode" 
                    placeholder="请输入短信验证码"
                    @keyup.enter="submitSmsLogin"
                  />
                  <el-button 
                    class="captcha-btn" 
                    :disabled="smsButtonDisabled"
                    @click="sendSmsCode"
                  >
                    {{ smsButtonText }}
                  </el-button>
                </el-form-item>
                <el-form-item>
                  <el-button 
                    class="suzao-btn" 
                    type="success" 
                    @click="submitSmsLogin"
                    :loading="loading"
                  >
                    {{ isWeChat ? '绑定手机' : '登录/注册' }}
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>

          <!-- 微信二维码 -->
          <div v-else-if="activeTab === 1" class="wx-box">
            <div class="wx-frame" v-loading="wxLoading">
              <img v-if="wxCodeSrc" class="wx-img" :src="wxCodeSrc" />
            </div>
          </div>

          <!-- 完善信息表单 -->
          <el-form 
            v-else-if="activeTab === 2" 
            ref="fillInfoFormRef" 
            :model="fillInfoForm" 
            :rules="fillInfoRules"
            @submit.prevent="submitFillInfo"
          >
            <el-form-item prop="name">
              <el-input 
                v-model="fillInfoForm.name" 
                placeholder="输入姓名" 
                name="name" 
                type="text"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input 
                v-model="fillInfoForm.password" 
                type="password" 
                placeholder="输入登录密码"
              />
            </el-form-item>
            <el-form-item prop="passwordRepeat">
              <el-input 
                v-model="fillInfoForm.passwordRepeat" 
                type="password" 
                placeholder="再次输入密码" 
                @keyup.enter="submitFillInfo"
              />
            </el-form-item>
            <el-form-item>
              <el-button 
                class="suzao-btn" 
                @click="submitFillInfo"
                :loading="loading"
              >
                保存信息并进入
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button 
                class="suzao-border-btn" 
                @click="skipFillInfo"
              >
                后续完善，直接进入
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 底部切换 -->
        <div class="bottom">
          <el-button 
            v-if="activeTab === 0 && !isWeChat" 
            class="wx-btn" 
            plain 
            @click="switchToWechat"
          >
            <i class="iconfont icon-weixin" /> 微信登录/注册
          </el-button>
          <el-button 
            v-else-if="activeTab === 1" 
            plain 
            @click="switchToAccount"
          >
            账号登录
          </el-button>
          <p class="agreement">
            未注册过物性表的手机号，我们会自动帮您注册账号登录或完成注册则表示您同意塑造平台的
            <el-link target="_blank" href="/page/agreement">用户协议</el-link>
            和
            <el-link target="_blank" href="/page/privacy-policy">隐私政策</el-link>
          </p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
/// <reference path="../types/global.d.ts" />

import { ref, computed, onMounted, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

// 类型定义
interface LoginForm {
  username: string
  password: string
}

interface SmsForm {
  cellphone: string
  smsCode: string
}

interface FillInfoForm {
  name: string
  password: string
  passwordRepeat: string
}

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'login-success', user: any): void
  (e: 'closed'): void
}

// Props 和 Emits
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 表单引用
const loginFormRef = ref<FormInstance>()
const smsFormRef = ref<FormInstance>()
const fillInfoFormRef = ref<FormInstance>()

// 响应式数据
const loading = ref(false)
const wxLoading = ref(false)
const activeTab = ref(0) // 0: 表单登录, 1: 微信登录, 2: 完善信息
const activeName = ref('login')
const isWeChat = ref(false)
const wxCodeSrc = ref('')
const smsButtonDisabled = ref(false)
const smsButtonText = ref('获取验证码')
const smsCountdown = ref(0)

// 表单数据
const loginForm = ref<LoginForm>({
  username: '',
  password: ''
})

const smsForm = ref<SmsForm>({
  cellphone: '',
  smsCode: ''
})

const fillInfoForm = ref<FillInfoForm>({
  name: '',
  password: '',
  passwordRepeat: ''
})

// 模拟分享数据
const shareItems = ref([
  {
    id: '1',
    title: '塑造平台',
    image: [{ url: '/frontend/assets/login-banner.jpg' }],
    link: '/page/about'
  }
])

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入手机号或邮箱', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const smsRules: FormRules = {
  cellphone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  smsCode: [
    { required: true, message: '请输入短信验证码', trigger: 'blur' }
  ]
}

const fillInfoRules: FormRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  passwordRepeat: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== fillInfoForm.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 方法
const handleClose = () => {
  visible.value = false
  resetForms()
  emit('closed')
}

const resetForms = () => {
  loginForm.value = { username: '', password: '' }
  smsForm.value = { cellphone: '', smsCode: '' }
  fillInfoForm.value = { name: '', password: '', passwordRepeat: '' }
  activeTab.value = 0
  activeName.value = 'login'
}

const handleTabClick = (tab: any) => {
  activeName.value = tab.name
}

const switchToRegister = () => {
  activeName.value = 'sms'
}

const switchToWechat = () => {
  activeTab.value = 1
  generateWechatQR()
}

const switchToAccount = () => {
  activeTab.value = 0
}

const checkCaptcha = () => {
  // 检查是否需要验证码
  if (smsForm.value.cellphone.length >= 11) {
    // 初始化阿里云验证码
    nextTick(() => {
      initAliyunCaptcha()
    })
  }
}

const initAliyunCaptcha = () => {
  // 初始化阿里云滑动验证码
  // 这里需要根据实际的阿里云验证码SDK进行实现
  console.log('初始化阿里云验证码')
}

const sendSmsCode = async () => {
  if (!smsForm.value.cellphone) {
    ElMessage.error('请输入手机号')
    return
  }

  try {
    loading.value = true
    const response = await $fetch('/api/sms/send', {
      method: 'POST',
      body: {
        cellphone: smsForm.value.cellphone,
        type: 'login'
      }
    })

    if (response.code === 200) {
      ElMessage.success('验证码已发送')
      startCountdown()
    } else {
      ElMessage.error(response.message || '发送失败')
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    ElMessage.error('发送失败，请重试')
  } finally {
    loading.value = false
  }
}

const startCountdown = () => {
  smsCountdown.value = 60
  smsButtonDisabled.value = true
  smsButtonText.value = `${smsCountdown.value}s后重新获取`

  const timer = setInterval(() => {
    smsCountdown.value--
    smsButtonText.value = `${smsCountdown.value}s后重新获取`

    if (smsCountdown.value <= 0) {
      clearInterval(timer)
      smsButtonDisabled.value = false
      smsButtonText.value = '获取验证码'
    }
  }, 1000)
}

const submitLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      loading.value = true
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: loginForm.value
      })

      if (response.code === 200) {
        ElMessage.success('登录成功')
        emit('login-success', response.data.user)
        handleClose()
      } else {
        ElMessage.error(response.message || '登录失败')
      }
    } catch (error) {
      console.error('登录失败:', error)
      ElMessage.error('登录失败，请重试')
    } finally {
      loading.value = false
    }
  })
}

const submitSmsLogin = async () => {
  if (!smsFormRef.value) return

  await smsFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      loading.value = true
      const response = await $fetch('/api/auth/sms-login', {
        method: 'POST',
        body: smsForm.value
      })

      if (response.code === 200) {
        ElMessage.success('登录成功')
        emit('login-success', response.data.user)
        handleClose()
      } else {
        ElMessage.error(response.message || '登录失败')
      }
    } catch (error) {
      console.error('短信登录失败:', error)
      ElMessage.error('登录失败，请重试')
    } finally {
      loading.value = false
    }
  })
}

const submitFillInfo = async () => {
  if (!fillInfoFormRef.value) return

  await fillInfoFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      loading.value = true
      const response = await $fetch('/api/auth/fill-info', {
        method: 'POST',
        body: fillInfoForm.value
      })

      if (response.code === 200) {
        ElMessage.success('信息保存成功')
        emit('login-success', response.data.user)
        handleClose()
      } else {
        ElMessage.error(response.message || '保存失败')
      }
    } catch (error) {
      console.error('保存信息失败:', error)
      ElMessage.error('保存失败，请重试')
    } finally {
      loading.value = false
    }
  })
}

const skipFillInfo = () => {
  // 跳过完善信息，直接进入系统
  emit('login-success', { skipFillInfo: true })
  handleClose()
}

const generateWechatQR = async () => {
  try {
    wxLoading.value = true
    const response = await $fetch('/api/auth/wechat-qr', {
      method: 'GET'
    })

    if (response.code === 200) {
      wxCodeSrc.value = response.data.qrcode
      checkWechatLogin()
    }
  } catch (error) {
    console.error('获取微信二维码失败:', error)
    ElMessage.error('获取二维码失败')
  } finally {
    wxLoading.value = false
  }
}

const checkWechatLogin = () => {
  // 轮询检查微信登录状态
  // 实际项目中需要实现轮询逻辑
  console.log('检查微信登录状态')
}

// 生命周期
onMounted(() => {
  // 检测是否在微信环境
  isWeChat.value = /MicroMessenger/i.test(navigator.userAgent)
})
</script>

<style scoped>
.login-dialog :deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

.login-box {
  display: flex;
  min-height: 600px;
}

.login-pic {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.login-content {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.top {
  flex: 1;
}

.title {
  text-align: center;
  margin-bottom: 30px;
}

.title .logo img {
  height: 60px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.tip {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}

.btn-box {
  text-align: right;
}

.suzao-btn {
  background: #409eff;
  border-color: #409eff;
  padding: 12px 24px;
  border-radius: 6px;
}

.suzao-border-btn {
  border: 1px solid #409eff;
  color: #409eff;
  background: transparent;
  padding: 12px 24px;
  border-radius: 6px;
}

.code {
  display: flex;
  gap: 12px;
}

.code .el-input {
  flex: 1;
}

.captcha-btn {
  width: 120px;
  flex-shrink: 0;
}

.wx-box {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.wx-frame {
  width: 200px;
  height: 200px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wx-img {
  max-width: 180px;
  max-height: 180px;
}

.bottom {
  margin-top: 30px;
  text-align: center;
}

.wx-btn {
  margin-bottom: 20px;
  padding: 12px 24px;
}

.agreement {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  margin: 0;
}

.agreement .el-link {
  color: #409eff;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-box {
    flex-direction: column;
  }
  
  .login-pic {
    min-height: 200px;
  }
  
  .login-content {
    padding: 20px;
  }
}
</style>