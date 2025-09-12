<template>
  <!-- SEO Head 配置 -->

  <Head>
    <Title>塑造 - {{ getPageTitle() }}</Title>
    <Meta name="description" content="AI智能材料技术应用平台 - 塑造助力工业之巅，科技创新之美！" />
    <Meta property="og:title" :content="`塑造 - ${getPageTitle()}`" />
    <Meta property="og:type" content="website" />
  </Head>
  <div class="login-page">
    <div class="flex-box">
      <div class="login-pic">
        <div class="content">
          <div class="box">
            <img src="/static/share-logo.svg" class="logo" alt="塑造">
            <div class="text">
              <p class="p1">AI智能材料技术应用平台</p>
              <p class="p2">塑造助力工业之巅，科技创新之美！</p>
            </div>
          </div>
        </div>
      </div>
      <div class="login-content" v-loading='loading'>
        <div class="top">
          <div class="title" v-if='activeTab === 0'>
            <!-- {{ wx ? '绑定手机' : '登录'}} -->
          </div>
          <div class="title" v-else-if='activeTab === 1'>
            微信扫码登录
            <div class="tip">未注册的微信号将自动创建塑造账号</div>
          </div>
          <div class="title" v-else-if='activeTab === 2'>
            完善信息
          </div>
          <!-- 1. 账号密码 -->
          <el-tabs :class="wx ? 'wx' : ''" v-if='activeTab === 0' v-model="activeName" @tab-click="handleClick"
            ref="tabs">
            <el-tab-pane label="账号密码" name="login">
              <!-- 1.1 账号密码 -->
              <el-form ref="loginFormRef" v-if="activeName === 'login'" key='login' :model="loginForm"
                :rules="loginRules">
                <el-form-item prop="username">
                  <el-input v-model="loginForm.username" placeholder="输入手机/邮箱" name="username" type="text"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input v-model="loginForm.password" type="password" placeholder="输入密码"
                    @keyup.native.enter="submitLogin('loginForm')"></el-input>
                </el-form-item>
                <el-form-item class="btn-box">
                  <el-button class="suzao-btn" type="primary" @click="submitLogin('loginForm')">登录</el-button>
                  <el-link href='/login/forget'> 忘记密码？</el-link> <el-link @click="handleClick({ name: 'reg' })">
                    免费注册</el-link>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="短信验证码" name="reg">
              <!-- 1.2 短信验证码 -->
              <el-form ref="phoneLoginFormRef" v-if="activeName === 'reg'" key='reg' :model="phoneLoginForm"
                :rules="phoneLoginRules">
                <el-form-item prop="cellphone">
                  <el-input v-model.trim="phoneLoginForm.cellphone" placeholder="输入手机号"></el-input>
                </el-form-item>
                <el-form-item prop="captcha" class="code">
                  <el-input v-model.trim="phoneLoginForm.captcha" placeholder="输入图片验证码" @input="isCaptchaOK"></el-input>
                  <img class="captcha-img" :src="captchaImageUrl" alt="图片验证码" @click="freshCaptcha" title="点击刷新">
                </el-form-item>
                <el-form-item prop="phone_captcha" class="code">
                  <el-input v-model.trim="phoneLoginForm.phone_captcha" @keyup.native.enter="submitPhoneForm"
                    placeholder="请输入短信验证码"></el-input>
                  <el-button class="captcha-img" :disabled="getPhoneCaptchaBtnStatus" @click="getPhoneCaptcha">{{
                    getPhoneCaptchaBtnTxt }}</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button class="suzao-btn" type="success" @click="submitPhoneForm">{{ wx ? '绑定手机' : '登录/注册'
                  }}</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          <!-- 2. 微信扫码登录 -->
          <div v-else-if='activeTab === 1' class="wx-box">
            <div class="wx-frame" v-loading='wxLoading'>
              <img class="wx-img" v-if='wxCodeSrc' :src="wxCodeSrc">
            </div>
          </div>
          <!-- 4. 完善信息 -->
          <el-form v-else-if='activeTab === 2' ref="fillInfoFormRef" :model="fillInfoForm" :rules="fillInfoRules">
            <el-form-item prop="name">
              <el-input v-model="fillInfoForm.name" placeholder="输入姓名" name="name" type="text"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="fillInfoForm.password" type="password" placeholder="输入登录密码"></el-input>
            </el-form-item>
            <el-form-item prop="password_rep">
              <el-input v-model="fillInfoForm.password_rep" type="password" placeholder="再次输入密码"
                @keyup.native.enter="setFillInfo('fillInfoForm')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="suzao-btn" @click="setFillInfo('fillInfoForm')">保存信息并进入</el-button>
            </el-form-item>
            <el-form-item>
              <el-button class="suzao-border-btn" @click='goRefer'>后续完善，直接进入</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="bottom">
          <!-- 微信登录按钮/账号登录按钮及用户协议 -->
          <el-button class="wx-btn" plain v-if='activeTab === 0 && !wx' @click='tabForm(1)'><i
              class="iconfont icon-weixin"></i> 微信登录/注册</el-button>
          <el-button plain @click='tabForm(0)' v-else-if='activeTab === 1'>账号登录</el-button>
          <p class="agreement">
            未注册过物性表的手机号，我们会自动帮您注册账号登录或完成注册则表示您同意塑造平台的
            <el-link target="_blank" href='/page/agreement'>用户协议</el-link>
            和
            <el-link target="_blank" href='/page/privacyPolicy'>隐私政策</el-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// 使用 Nuxt 的消息系统和国际化
const { $message } = useNuxtApp()
// 移除 i18n，使用硬编码中文
const router = useRouter()

// 表单验证函数
const checkPhone = (_rule: any, value: string, callback: Function) => {
  if (!value) {
    return callback(new Error('手机号不能为空'))
  } else {
    let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
    if (reg.test(value)) {
      callback()
    } else {
      return callback(new Error('请输入正确的手机号'))
    }
  }
}

const validatePass = (_rule: any, value: string, callback: Function) => {
  var numb = /\d+/
  var upperCase = /[A-Z]+/
  var lowerCase = /[a-z]+/
  var len = 8
  if (!(numb.test(value) && upperCase.test(value) && lowerCase.test(value) && value.length >= len)) {
    callback(new Error('密码至少8位数，同时包含大写字母、小写字母、数字'))
  } else {
    callback()
  }
}

const validatePass2 = (_rule: any, value: string, callback: Function) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== fillInfoForm.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 响应式数据
const loading = ref(false)
const activeTab = ref(0) // 0账号密码 1微信登录 2完善信息
const activeName = ref('login') // login账号密码 reg短信/注册
const wx = ref(false)
const wxTimer = ref<NodeJS.Timeout | null>(null)

// 账号密码登录
const loginForm = ref({ username: '', password: '' })
const loginFormRef = ref()
const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '账号不能为空' }],
  password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
}

// 短信验证码登录
const itemKey = ref(Math.random()) // 图片验证码
const phoneLoginForm = ref({
  cellphone: '',
  captcha: '',
  phone_captcha: ''
})
const phoneLoginFormRef = ref()
const phoneLoginRules = {
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  phone_captcha: [
    { required: true, message: '请输入短信验证码', trigger: 'blur' },
    { pattern: /^[0-9]{6}$/, message: '请填写正确的短信验证码', trigger: 'blur' }
  ],
  cellphone: [{ validator: checkPhone, trigger: 'blur' }]
}

const getPhoneCaptchaBtnStatus = ref(true) // 短信验证码禁用
const getPhoneCaptchaBtnTxt = ref('发送验证码')
const countDown = ref(120) // 倒计时
const captchaTime = ref(120) // 倒计时数字显示

// 微信登录
const wxCodeSrc = ref('')
const wxLoading = ref(true)
const base64 = 'data:image/png;base64,'

// 完善信息
const fillInfoForm = ref({
  name: '', // 姓名
  password: '', // 密码
  password_rep: '' // 重复密码
})
const fillInfoFormRef = ref()
const fillInfoRules = {
  password: [{ validator: validatePass, trigger: 'blur' }],
  password_rep: [{ validator: validatePass2, trigger: 'blur' }]
}

// URL参数处理
const paramUrl = computed(() => {
  const params = new URLSearchParams(window.location.search)
  return {
    active: params.get('active'),
    refer: params.get('refer')
  }
})

// 计算属性
const captchaImageUrl = computed(() => {
  return `/api/vendor/captcha?w=280&h=72&${itemKey.value}`
})

const getPageTitle = () => {
  switch (activeTab.value) {
    case 0:
      return wx.value ? '绑定手机' : '登录'
    case 1:
      return '微信登录'
    case 2:
      return '完善信息'
    default:
      return '登录'
  }
}

// 监听器
watch(activeTab, (newVal) => {
  if (newVal === 1) {
    getLoginQr()
  } else if (wxTimer.value) {
    clearTimeout(wxTimer.value)
  }
}, { immediate: true })

// 方法函数
// 记录函数 (保留以备后用)
// const countHighlight = (row: any, type: string = 'view') => {
//   // 创建 FormData 对象
//   const form = new FormData()
//   form.append('type', type)
//   form.append('hash', row.hash)
//   
//   $fetch('/api/vendor/countHighlightV2', {
//     method: 'POST',
//     body: form,
//     headers: {
//       'X-Requested-With': 'XMLHttpRequest',
//       'Client-Type': '2'
//     }
//   }).catch(() => { })
// }

// 信息登录/短信注册登录 tab切换
const handleClick = (event: any) => {
  if (event && event.name && event.name != activeName.value) {
    activeName.value = event.name
  }
  // 更改url定位到注册
  if (event) {
    const url = new URL(window.location.href)
    url.searchParams.set('active', event.name)
    window.history.replaceState(null, '', url.toString())
  }
}

// tab样式调整 (保留以备后用)
// const resetActivePosition = (_el: HTMLElement) => {
//   // 保留注释的原始逻辑，如果需要可以实现
// }

// 切换登录方式
const tabForm = (index: number) => {
  activeTab.value = index
}

// 账号密码登录
const submitLogin = async (refName: string) => {
  const formRef = refName === 'loginForm' ? loginFormRef.value : phoneLoginFormRef.value
  if (!formRef) return

  await formRef.validate(async (valid: boolean) => {
    if (!valid) return

    try {
      loading.value = true
      const formData = refName === 'loginForm' ? loginForm.value : phoneLoginForm.value
      
      // 创建 FormData 对象
      const form = new FormData()
      Object.keys(formData).forEach(key => {
        form.append(key, (formData as any)[key])
      })
      
      const response = await $fetch<any>('/api/login/ajax', {
        method: 'POST',
        body: form
      })

      if (response.status === 1) {
        $message.success('登录成功')
        goRefer()
      } else {
        $message.error(response.errors.join(''))
        loading.value = false
      }
    } catch (error) {
      loading.value = false
      $message.error('登录失败')
    }
  })
}

// 刷新图片验证码
const freshCaptcha = () => {
  itemKey.value = Math.random()
}

// 短信验证码计时
const getPhoneCaptcha = async () => {
  if (!phoneLoginFormRef.value) return

  phoneLoginFormRef.value.validateField('cellphone', async (isOK: string) => {
    if (isOK) return false

    try {
      // 创建 FormData 对象
      const form = new FormData()
      form.append('cellphone', phoneLoginForm.value.cellphone)
      form.append('captcha', phoneLoginForm.value.captcha)
      form.append('type', 'login')
      
      const response = await $fetch<any>('/api/vendor/sendPhoneCaptcha', {
        method: 'POST',
        body: form,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      if (response.status === 1) {
        // 开始倒计时
        getPhoneCaptchaBtnStatus.value = true
        let countdown = countDown.value
        captchaTime.value = countdown

        const timer = setInterval(() => {
          countdown--
          captchaTime.value = countdown
          getPhoneCaptchaBtnTxt.value = `${countdown}s后重新发送`

          if (countdown <= 0) {
            clearInterval(timer)
            endTimeing()
          }
        }, 1000)

        $message.success('发送成功')
      } else {
        $message.error(response.errors.join(''))
        if (response.fresh === 1) {
          freshCaptcha()
        }
      }
    } catch (error) {
      $message.error('发送失败')
    }
  })
}

// 解禁短信验证码按钮
const isCaptchaOK = (_val?: any) => {
  if (!phoneLoginFormRef.value) return

  let canGetPhoneCaptcha = 0
  phoneLoginFormRef.value.validateField(['captcha', 'cellphone'], (error: string) => {
    if (error) {
      getPhoneCaptchaBtnStatus.value = true
    } else {
      canGetPhoneCaptcha++
      if (canGetPhoneCaptcha === 2) {
        getPhoneCaptchaBtnStatus.value = false
      }
    }
  })
}

// 短信验证码计时结束
const endTimeing = (timer?: any) => {
  if (timer) clearTimeout(timer)
  getPhoneCaptchaBtnTxt.value = '发送验证码'
  captchaTime.value = countDown.value
  isCaptchaOK()
}

// 短信登录 并根据获取的信息判断是需要完善资料
const submitPhoneForm = async () => {
  if (!phoneLoginFormRef.value) return

  await phoneLoginFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return false

    try {
      loading.value = true
      
      // 创建 FormData 对象
      const form = new FormData()
      form.append('phone', phoneLoginForm.value.cellphone)
      form.append('phone_captcha', phoneLoginForm.value.phone_captcha)
      
      const response = await $fetch<any>('/api/login/byPhoneCaptcha', {
        method: 'POST',
        body: form
      })

      if (response.status === 1) {
        loading.value = false
        // 这里需要进行判断 是否是注册
        if (response.user.has_password) {
          $message.success('登录成功')
          goRefer()
        } else {
          tabForm(2)
        }
      } else {
        $message.error(response.errors.join(''))
        loading.value = false
      }
    } catch (error) {
      loading.value = false
      $message.error('登录失败')
    }
  })
}

// 获取微信登录图片
const getLoginQr = async () => {
  try {
    const response = await $fetch<any>('/api/vendor/getYqszLoginQr', {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    if (response.status === 1) {
      wxLoading.value = false
      wxCodeSrc.value = base64 + response.data.img
      // 开始轮询
      polling()
    } else {
      $message.error(response.errors || response)
    }
  } catch (error) {
    console.log(error)
    $message.error('获取二维码失败')
  }
}

// 完善资料
const setFillInfo = async (_refName: string) => {
  if (!fillInfoFormRef.value) return

  await fillInfoFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return false

    try {
      loading.value = true
      
      // 创建 FormData 对象
      const form = new FormData()
      Object.keys(fillInfoForm.value).forEach(key => {
        form.append(key, (fillInfoForm.value as any)[key])
      })
      
      const response = await $fetch<any>('/api/member/fillInfo?scene=m_user', {
        method: 'POST',
        body: form
      })

      if (response.status === 1) {
        $message.success('登录成功')
        goRefer()
      } else {
        $message.error(response.errors.join(''))
        loading.value = false
      }
    } catch (error) {
      loading.value = false
      $message.error('信息保存失败')
    }
  })
}

// 根据不同页面进行不同处理
const goRefer = () => {
  if (paramUrl.value.refer) {
    window.location.href = decodeURIComponent(paramUrl.value.refer)
  } else {
    // 没有refer参数，跳转到首页(根据配置会重定向到/merchant)
    router.push('/')
  }
}

// 轮询查询
const polling = () => {
  const interval = () => {
    wxTimer.value = setTimeout(async () => {
      try {
        const response = await $fetch<any>('/api/vendor/checkGzhLogin', {
          method: 'GET'
        })

        if (response.status === 1) {
          interval()
          // 执行代码块
        } else if (response.status === 2) {
          if (wxTimer.value) clearTimeout(wxTimer.value)
          // 扫码成功
          if (response.data.status === 1) {
            if (response.data.has_user) {
              $message.success('登录成功')
              // 成功跳转
              goRefer()
            } else {
              // 绑定手机号
              tabForm(0) // 切换到登录
              handleClick({ name: 'reg' }) // 切换到手机登录/注册/完善手机号
              wx.value = true
            }
          } else {
            // 失败
            $message.error('扫码失败！')
          }
        } else {
          if (wxTimer.value) clearTimeout(wxTimer.value)
          // 失败
          $message.error('扫码失败！')
        }
      } catch (error) {
        if (wxTimer.value) clearTimeout(wxTimer.value)
      }
    }, 2000)
  }

  interval()
  // 清除 60s后结束
  setTimeout(() => {
    if (wxTimer.value) clearTimeout(wxTimer.value)
  }, 60000)
}

// 生命周期 - mounted
onMounted(() => {
  if (paramUrl.value.active && ['login', 'reg'].indexOf(paramUrl.value.active) !== -1) {
    activeName.value = paramUrl.value.active
  }
})

// 生命周期 - unmounted
onUnmounted(() => {
  if (wxTimer.value) {
    clearTimeout(wxTimer.value)
  }

})
</script>

<style lang="scss">
@import '@/assets/scss/pages/login.scss';
</style>