<template>
  <!-- SEO Head 配置 -->
  <Head>
    <Title>{{ $t('nav.brand') }} - {{ getPageTitle() }}</Title>
    <Meta name="description" :content="$t('login.description')" />
    <Meta property="og:title" :content="`${$t('nav.brand')} - ${getPageTitle()}`" />
    <Meta property="og:type" content="website" />
  </Head>

  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl w-full flex bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- 左侧品牌展示区域 -->
      <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative">
        <div class="flex flex-col justify-center items-center text-white text-center p-12">
          <div class="mb-8">
            <img src="/static/share-logo.svg" class="h-16 w-auto mx-auto mb-6" :alt="$t('nav.brand')" />
            <h1 class="text-3xl font-bold mb-4">{{ $t('login.platformTitle') }}</h1>
            <p class="text-lg opacity-90">{{ $t('login.platformSubtitle') }}</p>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单区域 -->
      <div class="w-full lg:w-1/2 p-8 lg:p-12" v-loading="loading">
        <div class="max-w-md mx-auto">
          <!-- 标题区域 -->
          <div class="text-center mb-8">
            <div v-if="activeTab === 0" class="mb-6">
              <h2 class="text-2xl font-bold text-gray-900">{{ wxMode ? $t('login.bindPhone') : $t('login.signIn') }}</h2>
            </div>
            <div v-else-if="activeTab === 1" class="mb-6">
              <h2 class="text-2xl font-bold text-gray-900">{{ $t('login.wechatLogin') }}</h2>
              <p class="text-sm text-gray-600 mt-2">{{ $t('login.wechatTip') }}</p>
            </div>
            <div v-else-if="activeTab === 2" class="mb-6">
              <h2 class="text-2xl font-bold text-gray-900">{{ $t('login.completeInfo') }}</h2>
            </div>
          </div>

          <!-- 表单切换标签 -->
          <div v-if="activeTab === 0" class="mb-6">
            <el-tabs v-model="activeName" @tab-click="handleTabClick" class="login-tabs">
              <el-tab-pane :label="$t('login.accountPassword')" name="login">
                <!-- 账号密码登录表单 -->
                <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @submit.prevent="submitLogin" class="space-y-4">
                  <el-form-item prop="username">
                    <el-input 
                      v-model="loginForm.username" 
                      :placeholder="$t('login.usernamePlaceholder')" 
                      size="large"
                      class="w-full"
                    />
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input 
                      v-model="loginForm.password" 
                      type="password" 
                      :placeholder="$t('login.passwordPlaceholder')"
                      @keyup.enter="submitLogin"
                      size="large"
                      class="w-full"
                    />
                  </el-form-item>
                  <el-form-item class="text-right mb-6">
                    <el-button 
                      type="primary" 
                      @click="submitLogin" 
                      :loading="loading"
                      size="large"
                      class="w-full mb-4 bg-blue-600 hover:bg-blue-700"
                    >
                      {{ $t('login.signIn') }}
                    </el-button>
                    <div class="flex justify-between text-sm">
                      <NuxtLink to="/login/forget" class="text-blue-600 hover:text-blue-700">{{ $t('login.forgotPassword') }}</NuxtLink>
                      <a href="#" @click.prevent="switchToSmsLogin" class="text-blue-600 hover:text-blue-700">{{ $t('login.freeRegister') }}</a>
                    </div>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane :label="$t('login.smsVerification')" name="sms">
                <!-- 短信验证码登录表单 -->
                <el-form ref="smsFormRef" :model="smsForm" :rules="smsRules" @submit.prevent="submitSmsLogin" class="space-y-4">
                  <el-form-item prop="cellphone">
                    <el-input 
                      v-model="smsForm.cellphone" 
                      :placeholder="$t('login.phonePlaceholder')"
                      size="large"
                      class="w-full"
                      @input="onPhoneInput"
                    />
                  </el-form-item>
                  <el-form-item prop="captcha" class="captcha-row">
                    <div class="flex gap-3">
                      <el-input 
                        v-model="smsForm.captcha" 
                        :placeholder="$t('login.imageCaptchaPlaceholder')"
                        size="large"
                        class="flex-1"
                      />
                      <img 
                        :src="captchaUrl" 
                        :alt="$t('login.imageCaptcha')"
                        @click="refreshCaptcha" 
                        class="w-28 h-[40px] border border-gray-300 rounded cursor-pointer hover:border-blue-500"
                        :title="$t('login.refreshCaptcha')"
                      />
                    </div>
                  </el-form-item>
                  <el-form-item prop="smsCode" class="sms-code-row">
                    <div class="flex gap-3">
                      <el-input 
                        v-model="smsForm.smsCode" 
                        :placeholder="$t('login.smsCodePlaceholder')"
                        @keyup.enter="submitSmsLogin"
                        size="large"
                        class="flex-1"
                      />
                      <el-button 
                        :disabled="smsButtonDisabled" 
                        @click="sendSmsCode"
                        size="large"
                        class="w-32 flex-shrink-0"
                      >
                        {{ smsButtonText }}
                      </el-button>
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <el-button 
                      type="success" 
                      @click="submitSmsLogin" 
                      :loading="loading"
                      size="large"
                      class="w-full bg-green-600 hover:bg-green-700"
                    >
                      {{ wxMode ? $t('login.bindPhone') : $t('login.loginOrRegister') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>

          <!-- 微信扫码登录 -->
          <div v-else-if="activeTab === 1" class="flex justify-center">
            <div class="text-center">
              <div class="wx-qr-container" v-loading="wxLoading">
                <img v-if="wxCodeSrc" :src="wxCodeSrc" :alt="$t('login.wechatQR')" class="w-48 h-48 mx-auto border border-gray-200 rounded-lg" />
              </div>
            </div>
          </div>

          <!-- 完善信息表单 -->
          <div v-else-if="activeTab === 2">
            <el-form ref="fillInfoFormRef" :model="fillInfoForm" :rules="fillInfoRules" @submit.prevent="submitFillInfo" class="space-y-4">
              <el-form-item prop="name">
                <el-input 
                  v-model="fillInfoForm.name" 
                  :placeholder="$t('login.namePlaceholder')"
                  size="large"
                  class="w-full"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input 
                  v-model="fillInfoForm.password" 
                  type="password" 
                  :placeholder="$t('login.setPasswordPlaceholder')"
                  size="large"
                  class="w-full"
                />
              </el-form-item>
              <el-form-item prop="passwordRepeat">
                <el-input 
                  v-model="fillInfoForm.passwordRepeat" 
                  type="password" 
                  :placeholder="$t('login.confirmPasswordPlaceholder')"
                  @keyup.enter="submitFillInfo"
                  size="large"
                  class="w-full"
                />
              </el-form-item>
              <el-form-item>
                <el-button 
                  type="primary" 
                  @click="submitFillInfo" 
                  :loading="loading"
                  size="large"
                  class="w-full mb-4 bg-blue-600 hover:bg-blue-700"
                >
                  {{ $t('login.saveAndEnter') }}
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button 
                  @click="skipFillInfo"
                  size="large"
                  class="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  {{ $t('login.skipAndEnter') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 底部切换和协议 -->
          <div class="mt-8 text-center space-y-4">
            <!-- 登录方式切换按钮 -->
            <div v-if="activeTab === 0 && !wxMode">
              <el-button 
                @click="switchToWechat" 
                size="large"
                class="w-full border-green-500 text-green-600 hover:bg-green-50"
                plain
              >
                <i class="iconfont icon-weixin mr-2"></i>
                {{ $t('login.wechatLoginRegister') }}
              </el-button>
            </div>
            <div v-else-if="activeTab === 1">
              <el-button 
                @click="switchToAccount" 
                size="large"
                class="w-full"
                plain
              >
                {{ $t('login.accountLogin') }}
              </el-button>
            </div>

            <!-- 用户协议 -->
            <p class="text-xs text-gray-500 leading-relaxed px-4">
              {{ $t('login.agreementText') }}
              <NuxtLink to="/page/agreement" target="_blank" class="text-blue-600 hover:text-blue-700">{{ $t('login.userAgreement') }}</NuxtLink>
              {{ $t('login.and') }}
              <NuxtLink to="/page/privacy-policy" target="_blank" class="text-blue-600 hover:text-blue-700">{{ $t('login.privacyPolicy') }}</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// 使用 Nuxt 的国际化和消息系统
const { $t, $message } = useNuxtApp()
const route = useRoute()
const router = useRouter()

// 类型定义
interface LoginForm {
  username: string
  password: string
}

interface ApiResponse {
  status: number
  errors?: string[]
  msg?: string
  data?: any
  captcha?: string
  fresh?: number
  code?: number
  user?: {
    has_password: boolean
    [key: string]: any
  }
}

interface SmsForm {
  cellphone: string
  captcha: string
  smsCode: string
}

interface FillInfoForm {
  name: string
  password: string
  passwordRepeat: string
}

type FormInstance = any
type TabsPaneContext = { paneName: string | number }

// 响应式数据
const loading = ref(false)
const activeTab = ref(0) // 0: 账号密码, 1: 微信登录, 2: 完善信息
const activeName = ref('login') // 'login': 账号密码, 'sms': 短信验证码
const wxMode = ref(false)
const wxTimer = ref<NodeJS.Timeout | null>(null)

// 表单数据
const loginForm = ref<LoginForm>({
  username: '',
  password: ''
})

const smsForm = ref<SmsForm>({
  cellphone: '',
  captcha: '',
  smsCode: ''
})

const fillInfoForm = ref<FillInfoForm>({
  name: '',
  password: '',
  passwordRepeat: ''
})

// 验证码相关
const itemKey = ref(Math.random())
const captchaUrl = computed(() => `/vendor/captcha?w=280&h=72&${itemKey.value}`)
const smsButtonDisabled = ref(false)
const smsButtonText = ref('')
const smsCountdown = ref(0)

// 微信相关
const wxLoading = ref(false)
const wxCodeSrc = ref('')

// 表单引用
const loginFormRef = ref<FormInstance>()
const smsFormRef = ref<FormInstance>()
const fillInfoFormRef = ref<FormInstance>()

// 表单验证规则
const phoneValidator = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error($t('login.phoneRequired')))
  }
  const reg = /^1[3-9]\d{9}$/
  if (reg.test(value)) {
    callback()
  } else {
    return callback(new Error($t('login.phoneFormatError')))
  }
}

const passwordValidator = (rule: any, value: any, callback: any) => {
  const numb = /\d+/
  const upperCase = /[A-Z]+/
  const lowerCase = /[a-z]+/
  const minLen = 8
  if (!(numb.test(value) && upperCase.test(value) && lowerCase.test(value) && value.length >= minLen)) {
    callback(new Error($t('login.passwordFormatError')))
  } else {
    callback()
  }
}

const passwordRepeatValidator = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error($t('login.confirmPasswordRequired')))
  } else if (value !== fillInfoForm.value.password) {
    callback(new Error($t('login.passwordMismatch')))
  } else {
    callback()
  }
}

// 验证规则
const loginRules = computed(() => ({
  username: [{ required: true, trigger: 'blur', message: $t('login.usernameRequired') }],
  password: [{ required: true, trigger: 'blur', message: $t('login.passwordRequired') }]
}))

const smsRules = computed(() => ({
  cellphone: [{ validator: phoneValidator, trigger: 'blur' }],
  captcha: [{ required: true, message: $t('login.captchaRequired'), trigger: 'blur' }],
  smsCode: [
    { required: true, message: $t('login.smsCodeRequired'), trigger: 'blur' },
    { pattern: /^[0-9]{6}$/, message: $t('login.smsCodeFormatError'), trigger: 'blur' }
  ]
}))

const fillInfoRules = computed(() => ({
  name: [{ required: true, message: $t('login.nameRequired'), trigger: 'blur' }],
  password: [{ validator: passwordValidator, trigger: 'blur' }],
  passwordRepeat: [{ validator: passwordRepeatValidator, trigger: 'blur' }]
}))

// 计算属性
const getPageTitle = () => {
  switch (activeTab.value) {
    case 0:
      return wxMode.value ? $t('login.bindPhone') : $t('login.signIn')
    case 1:
      return $t('login.wechatLogin')
    case 2:
      return $t('login.completeInfo')
    default:
      return $t('login.signIn')
  }
}

// 初始化短信按钮文本
const initSmsButtonText = () => {
  smsButtonText.value = $t('login.sendSmsCode') || '发送验证码'
}

// 监听 activeTab 变化
watch(activeTab, (newVal) => {
  if (newVal === 1) {
    generateWechatQR()
  } else if (wxTimer.value) {
    clearTimeout(wxTimer.value)
    wxTimer.value = null
  }
})

// 方法
const handleTabClick = (tab: TabsPaneContext) => {
  activeName.value = tab.paneName as string
  // 更新 URL 参数
  router.push({
    query: {
      ...route.query,
      active: tab.paneName
    }
  })
}

const switchToAccount = () => {
  activeTab.value = 0
}

const switchToWechat = () => {
  activeTab.value = 1
}

const switchToSmsLogin = () => {
  activeName.value = 'sms'
}

const switchToFillInfo = () => {
  activeTab.value = 2
}

const refreshCaptcha = () => {
  itemKey.value = Math.random()
}

const onPhoneInput = () => {
  // 手机号输入时的验证逻辑
  if (smsForm.value.cellphone.length >= 11) {
    // 可以在这里添加验证码检查逻辑
  }
}

const submitLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    try {
      loading.value = true
      const response = await $fetch<ApiResponse>('/login/ajax', {
        method: 'POST',
        body: loginForm.value
      })
      
      if (response.status === 1) {
        $message.success($t('login.loginSuccess'))
        await navigateAfterLogin()
      } else {
        $message.error(response.errors?.join('') || $t('login.loginFailed'))
      }
    } catch (error) {
      console.error('Login error:', error)
      $message.error($t('login.loginFailed'))
    } finally {
      loading.value = false
    }
  })
}

const sendSmsCode = async () => {
  if (!smsFormRef.value) return
  
  await smsFormRef.value.validateField('cellphone', async (error: string) => {
    if (error) return
    
    try {
      const response = await $fetch<ApiResponse>('/vendor/sendPhoneCaptcha', {
        method: 'POST',
        body: {
          cellphone: smsForm.value.cellphone,
          captcha: smsForm.value.captcha,
          type: 'login'
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      
      if (response.status === 1) {
        $message.success($t('login.smsSendSuccess'))
        startSmsCountdown()
      } else {
        $message.error(response.errors?.join('') || $t('login.smsSendFailed'))
        if (response.fresh === 1) {
          refreshCaptcha()
        }
      }
    } catch (error) {
      console.error('SMS send error:', error)
      $message.error($t('login.smsSendFailed'))
    }
  })
}

const startSmsCountdown = () => {
  const countdown = 120
  smsCountdown.value = countdown
  smsButtonDisabled.value = true
  smsButtonText.value = `${countdown}${$t('login.secondsLater') || 's后重新获取'}`
  
  const timer = setInterval(() => {
    smsCountdown.value--
    smsButtonText.value = `${smsCountdown.value}${$t('login.secondsLater') || 's后重新获取'}`
    
    if (smsCountdown.value <= 0) {
      clearInterval(timer)
      endSmsCountdown()
    }
  }, 1000)
}

const endSmsCountdown = () => {
  smsButtonDisabled.value = false
  smsButtonText.value = $t('login.sendSmsCode') || '发送验证码'
  smsCountdown.value = 0
}

const submitSmsLogin = async () => {
  if (!smsFormRef.value) return
  
  await smsFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    try {
      loading.value = true
      const response = await $fetch<ApiResponse>('/login/byPhoneCaptcha', {
        method: 'POST',
        body: {
          phone: smsForm.value.cellphone,
          phone_captcha: smsForm.value.smsCode
        }
      })
      
      if (response.status === 1) {
        // 判断是否需要完善信息
        if (response.user?.has_password) {
          $message.success($t('login.loginSuccess'))
          await navigateAfterLogin()
        } else {
          // 需要完善信息
          switchToFillInfo()
        }
      } else {
        $message.error(response.errors?.join('') || $t('login.loginFailed'))
      }
    } catch (error) {
      console.error('SMS login error:', error)
      $message.error($t('login.loginFailed'))
    } finally {
      loading.value = false
    }
  })
}

const generateWechatQR = async () => {
  try {
    wxLoading.value = true
    const response = await $fetch<ApiResponse>('/vendor/getYqszLoginQr', {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    
    if (response.status === 1) {
      wxCodeSrc.value = `data:image/png;base64,${response.data?.img}`
      startWechatPolling()
    } else {
      $message.error(response.errors?.join('') || $t('login.qrGenerateFailed'))
    }
  } catch (error) {
    console.error('WeChat QR generate error:', error)
    $message.error($t('login.qrGenerateFailed'))
  } finally {
    wxLoading.value = false
  }
}

const startWechatPolling = () => {
  const pollWechatStatus = async () => {
    try {
      const response = await $fetch<ApiResponse>('/vendor/checkGzhLogin', {
        method: 'GET'
      })
      
      if (response.status === 1) {
        // 继续轮询
        wxTimer.value = setTimeout(pollWechatStatus, 2000)
      } else if (response.status === 2) {
        // 扫码完成
        if (wxTimer.value) {
          clearTimeout(wxTimer.value)
          wxTimer.value = null
        }
        
        if (response.data?.status === 1) {
          if (response.data?.has_user) {
            $message.success($t('login.loginSuccess'))
            await navigateAfterLogin()
          } else {
            // 需要绑定手机号
            switchToAccount()
            activeName.value = 'sms'
            wxMode.value = true
          }
        } else {
          $message.error($t('login.wechatScanFailed'))
        }
      } else {
        if (wxTimer.value) {
          clearTimeout(wxTimer.value)
          wxTimer.value = null
        }
        $message.error($t('login.wechatScanFailed'))
      }
    } catch (error) {
      console.error('WeChat polling error:', error)
      if (wxTimer.value) {
        clearTimeout(wxTimer.value)
        wxTimer.value = null
      }
    }
  }
  
  // 开始轮询
  wxTimer.value = setTimeout(pollWechatStatus, 2000)
  
  // 60秒后停止轮询
  setTimeout(() => {
    if (wxTimer.value) {
      clearTimeout(wxTimer.value)
      wxTimer.value = null
    }
  }, 60000)
}

const submitFillInfo = async () => {
  if (!fillInfoFormRef.value) return
  
  await fillInfoFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    try {
      loading.value = true
      const response = await $fetch<ApiResponse>('/member/fillInfo', {
        method: 'POST',
        query: { scene: 'm_user' },
        body: fillInfoForm.value
      })
      
      if (response.status === 1) {
        $message.success($t('login.infoSaveSuccess'))
        await navigateAfterLogin()
      } else {
        $message.error(response.errors?.join('') || $t('login.infoSaveFailed'))
      }
    } catch (error) {
      console.error('Fill info error:', error)
      $message.error($t('login.infoSaveFailed'))
    } finally {
      loading.value = false
    }
  })
}

const skipFillInfo = async () => {
  await navigateAfterLogin()
}

const navigateAfterLogin = async () => {
  const refer = route.query.refer as string
  if (refer) {
    await navigateTo(decodeURIComponent(refer))
  } else {
    await navigateTo('/')
  }
}

// 生命周期
onMounted(() => {
  // 初始化短信按钮文本
  initSmsButtonText()
  
  // 检查 URL 参数设置默认 tab
  const activeParam = route.query.active as string
  if (['login', 'sms'].includes(activeParam)) {
    activeName.value = activeParam
  }
  
  // 检测是否在微信环境
  if (typeof window !== 'undefined') {
    wxMode.value = /MicroMessenger/i.test(navigator.userAgent)
  }
})

// 组件销毁时清理定时器
onUnmounted(() => {
  if (wxTimer.value) {
    clearTimeout(wxTimer.value)
    wxTimer.value = null
  }
})

// 设置页面布局为 special
definePageMeta({
  layout: 'special'
})
</script>

<style scoped>
/* Tailwind CSS 已经包含了大部分所需的样式 */
.login-tabs :deep(.el-tabs__header) {
  margin-bottom: 24px;
}

.login-tabs :deep(.el-tabs__item) {
  font-weight: 500;
  color: #6b7280;
}

.login-tabs :deep(.el-tabs__item.is-active) {
  color: #3b82f6;
  font-weight: 600;
}

.captcha-row :deep(.el-form-item__content),
.sms-code-row :deep(.el-form-item__content) {
  display: flex;
  gap: 12px;
}

/* 微信扫码区域的加载样式 */
.wx-qr-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 移动端适配 */
@media (max-width: 1024px) {
  .login-form {
    padding: 2rem 1rem;
  }
}

@media (max-width: 640px) {
  .login-form {
    padding: 1.5rem 1rem;
  }
}
</style>