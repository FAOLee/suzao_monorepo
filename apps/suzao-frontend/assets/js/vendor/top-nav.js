addEventListener('load', () => {
  document.body.classList.add('suzao')
  const initMerchantForm = {
    companyName: null,
    ename: null,
    enterprisePutStatus: null,
    exposure: 0,
    ticketExamineStatus: null,
    userName: null
  }

  const becomeSettledList = [
    {
      text: '资料审核中',
      icon: '/frontend/assets/layout/icon-settled-loading.png'
    },
    {
      text: '审核失败',
      icon: '/frontend/assets/layout/icon-settled-error.png'
    },
    {
      text: '审核成功(立即激活)',
      icon: '/frontend/assets/layout/icon-settled-ok.png'
    },
    {
      text: '申请成为供应商',
      icon: '/frontend/assets/layout/icon-settled.png'
    }
  ]
  const pathnameListPos = {
    '/plastic/advanceSearchResult': 'advsearch.result',
    '/plastic/detail': 'detail',
    '/plastic/search': 'list',
    '/plastic/ai': 'ai.search',
    '/': 'ai.search',
    other: 'search.result'
  }
  const pathnameListEvent = {
    '/plastic/ai': 'ai.search',
    '/': 'ai.search',
    other: 'enterprise.market.phone'
  }
  let qrCodeInstance = null
  const destroyQRCode = () => {
    if (qrCodeInstance) {
      // 获取二维码所在的容器
      const qrCodeDiv = document.getElementById('QRCode')
      // 清空容器内的内容
      qrCodeDiv.innerHTML = ''
      // 释放实例引用
      qrCodeInstance = null
    }
  }
  const generateQRCodeBase64 = (url, typeNumber, errorCorrectLevel) => {
    if (qrCodeInstance) {
      qrCodeInstance.makeCode(url)
    } else {
      qrCodeInstance = new QRCode('QRCode', {
        text: url,
        errorCorrectionLevel: 'H',
        version: 2,
        width: 108,
        height: 108
      })
    }
    return qrCodeInstance
  }

  const settledApp = new Vue({
    el: '#settledApp',
    data() {
      const iconSrc = '/frontend/assets/layout/icon-member'
      const ver = '.png?ver=20250220'
      return {
        // 申请成为商家
        // becomeVisible: false,
        byShare: [],
        shareVisible: false,
        becomeTitle: becomeSettledList.at(-1),
        tips: {},
        unread: {
          message: 0,
          suggestion: 0,
          upOrderCount: 0
        },
        vipStatus: 'off',
        isEnterprise: false,
        merchantForm: Object.assign({}, initMerchantForm),
        ticketVisible: false,
        memberVisible: false,
        contentData: {
          title: '会员尊享以下免费权益',
          list: [
            {
              img: iconSrc + '1' + ver,
              title: '物性表详情',
              tip: '免费无限查看'
            },
            {
              img: iconSrc + '2' + ver,
              title: '物性表下载',
              tip: '免费无水印下载'
            },
            {
              img: iconSrc + '3' + ver,
              title: '高级性能搜索',
              tip: '免费无限使用'
            },
            {
              img: iconSrc + '4' + ver,
              title: 'AI智能选材',
              tip: '免费无限使用'
            },
            {
              img: iconSrc + '5' + ver,
              title: '对比功能/下载',
              tip: '支持无水印'
            }
          ]
        },
        goodsList: [],
        payTab: [
          {
            icon: '/frontend/assets/page/pay/' + 'pay-wx.png',
            text: '微信支付',
            id: 'wx_pay'
          },
          {
            icon: '/frontend/assets/page/pay/' + 'pay-zfb.png',
            text: '支付宝支付',
            id: 'ali_pay'
          }
        ],
        goodsId: '',
        payId: 'wx_pay',
        wxTimer: null,
        QRCode: '',
        vipOrder: {
          orderNo: '',
          payReturn: ''
        },
        isDefaultGoodsList: {},
        agree: true
      }
    },
    created() {
      this.init()
    },
    computed: {
      unreadTotal() {
        return Number(this.unread.suggestion || 0) + Number(this.unread.message || 0)
      }
    },
    watch: {
      goodsId: {
        async handler(newVal, oldVal) {
          if (newVal) {
            try {
              const { code, data } = await this.createVipOrder(this.goodsId, this.payId)
              if (code === 101 && data) {
                this.vipOrder = data
                this.goPay(data.payReturn, this.payId)
              } else {
                this.vipOrder = { orderNo: '', payReturn: '' }
              }
            } catch (error) {
              console.error(error)
              this.vipOrder = { orderNo: '', payReturn: '' }
            }
          }
        }
      }
    },
    methods: {
      async init() {
        this.openShare()
        if (_SZ_HAS_LOGIN) {
          this.computedUnreadTotal()
          this.polymerizationInfo()
        } else {
          localStorage.removeItem('advanceSearch')
          localStorage.removeItem('unreadTotal')
          localStorage.removeItem('isEnterprise')
          localStorage.removeItem('ticketVisible')
        }
      },
      getItem() {
        const unreadTotal = localStorage.getItem('unreadTotal')
        try {
          if (unreadTotal) {
            this.unread = JSON.parse(unreadTotal)
          }
        } catch (error) {
        } finally {
          return this.unread
        }
      },
      async computedUnreadTotal(event) {
        if (!event || event.key === 'unreadTotal') {
          const unreadTotal = (event && event.newValue) || localStorage.getItem('unreadTotal')
          if (unreadTotal) {
            this.unread = JSON.parse(unreadTotal) || {
              message: 0,
              suggestion: 0
            }
          }
          if (!this.unread.suggestion) {
            window.member = await this.getMember()
            const { unread_msg, unread_suggestion } = window.member
            this.unread.message = unread_msg
            this.unread.suggestion = unread_suggestion
            localStorage.setItem('unreadTotal', JSON.stringify(this.unread))
          }
          this.sendValue(this.unread)
        }
      },
      openDialog(becomeForm) {
        location.href = '/page/merchantRegistration'
      },
      requestData() {
        return new Promise((resolve, reject) => {
          fetch('/core/adv2/getAdvertising?id=16&num=1&isGetTopAdvertising=false', {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
            .then(response => response.json())
            .then(({ code, data }) => {
              if (code === 101) {
                if (data && data.advertisingList && data.advertisingList.length) {
                  settledApp['byShare'] = data.advertisingList.filter((item, index) => {
                    item.image = JSON.parse(item.image)
                    item.video = JSON.parse(item.video)
                    suzao.countHighlight(item.hash, 'view')
                    return item
                  })
                  return resolve(data)
                }
                return resolve()
              }
              reject()
            })
            .catch(error => {
              reject(error)
            })
        })
      },
      // 判断cookie里面有没有
      openShare() {
        const getStore = suzao.getStorage('byShare')
        if (['PC', 'others'].includes(suzao.userAgent) && !getStore) {
          this.requestData()
            .then(data => {
              if (data) this.shareVisible = true
            })
            .catch(console.error)
          const tomorrow = suzao.forwardTimestamp(suzao.parseTime(new Date(), '{y}-{m}-{d}')) + 24 * 60 * 60 * 1000
          suzao.setStorage('byShare', 1, tomorrow)
        }
      },
      getSuggestion() {
        return new Promise((resolve, reject) => {
          fetch('/member/suggestion?type=list&size=0', {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
            .then(response => response.json())
            .then(({ status, errors, data }) => {
              if (status) {
                return resolve(data)
              }
              reject(errors.join(','))
            })
            .catch(error => {
              reject(error)
            })
        })
      },
      getMember() {
        return new Promise((resolve, reject) => {
          fetch('/member', {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
            .then(response => response.json())
            .then(resolve)
            .catch(reject)
        })
      },
      getGoodsList() {
        return new Promise((resolve, reject) => {
          fetch('/core/vipTrade/getGoodsList', {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
            .then(response => response.json())
            .then(resolve)
            .catch(reject)
        })
      },
      sendValue(data) {
        const event = new CustomEvent('valueSent', { detail: data })
        window.dispatchEvent(event)
      },
      async polymerizationInfo() {
        try {
          const request = await fetch('/core/enterprise/polymerizationInfo')
          const { data } = await request.json()
          if (data) {
            // ticketExamineStatus  0审核中 1审核失败 2 审核成功
            this.merchantForm = data
            if (data.vipStatus) {
              this.vipStatus = data.vipStatus
            }
            // 2资料提交 3已激活
            if (data.enterprisePutStatus === 3) {
              this.isEnterprise = true // 供应商审核成功 并且 实体认证激活码填了
              localStorage.setItem('isEnterprise', 1)
            } else {
              localStorage.setItem('isEnterprise', '')
              if (data.enterprisePutStatus === 2) {
                this.becomeTitle = becomeSettledList[data.ticketExamineStatus]
                const ticketVisible = localStorage.getItem('ticketVisible')
                if (data.ticketExamineStatus === 2 && !['/member', '/page/merchantRegistration'].includes(location.pathname) && !ticketVisible) {
                  this.ticketVisible = true
                  localStorage.setItem('ticketVisible', 1)
                }
              }
            }
          }
        } catch (error) {
          console.error(error)
        }
      },
      statisticsLog() {
        const dom = document.querySelector('body')
        dom.addEventListener('click', async e => {
          const dom = e.target
          const classList = dom.classList
          // 电话
          if (classList.contains('formatPhone') && dom.getAttribute('data-phone')) {
            e.stopPropagation()
            e.preventDefault()
            dom.textContent = dom.getAttribute('data-phone')
            dom.removeAttribute('data-phone')
            // pos
            // 物性表详情页	wxb.detail
            // 物性表列表页	wxb.list
            // 物性表搜索结果页	wxb.search.result
            // 物性表性能搜索结果页	wxb.advsearch.result  /plastic/advanceSearchResult
            // 物性表AI搜索页	wxb.ai.search

            // event
            // 入驻代理商产品联系电话的拨打	wxb.enterprise.market.phone
            // AI搜索	wxb.ai.search
            let pathname = location.pathname
            if (pathname === '/plastic/search') {
              if (suzao.paramObj('key')) {
                pathname = 'other'
              }
            }
            const event = 'pc.wxb.' + (pathnameListEvent[pathname] || pathnameListEvent['other'])
            const pos = 'pc.wxb.' + (pathnameListPos[location.pathname] || pathnameListPos['other'])
            let id = dom.getAttribute('data-id')
            if (!id) {
              id = suzao.paramObj('id')
            }
            const logEnterprise = dom.getAttribute('data-log-enterprise-id')
            const dataPlasticId = dom.getAttribute('data-plastic-id')
            if (logEnterprise && dataPlasticId) {
              suzao.clickCellphone({
                dataPlasticId: dataPlasticId,
                logEnterpriseShowId: logEnterprise
              })
            } else {
              suzao.statisticsLog({
                event: event,
                pos: pos,
                id: id
              })
            }
          }

          try {
            let smallBusinessCollapse = ''
            if (classList.contains('smallBusinessCollapse')) {
              smallBusinessCollapse = dom
            } else if (dom.parentElement) {
              if (dom.parentElement.classList.contains('smallBusinessCollapse')) {
                smallBusinessCollapse = dom.parentElement
              } else if (dom.parentElement.classList.contains('is-active')) {
                smallBusinessCollapse = dom.parentElement.querySelector('.smallBusinessCollapse')
              }
            }
            if (smallBusinessCollapse) {
              e.stopPropagation()
              e.preventDefault()
              if (smallBusinessCollapse.parentElement.classList.contains('is-active')) {
                const listArr = smallBusinessCollapse.parentElement.parentElement.parentElement.querySelectorAll('.li')
                const listData = []
                Array.prototype.forEach.call(listArr, $item => {
                  if (!$item.classList.contains('smallBusinessCollapse')) {
                    const dataPlasticId = $item.getAttribute('data-plastic-id')
                    const enterpriseId = $item.getAttribute('data-enterprise-id')
                    if (enterpriseId) listData.push({ dataPlasticId, enterpriseId, channel: 2 })
                  }
                })
                if (listData.length) {
                  const { code, data: list } = await suzao.logEnterprise({ list: listData })
                  if (code === 101) {
                    list.map((li, index) => {
                      if (li.id) {
                        const formatPhone = listArr[index].querySelector('.formatPhone')
                        if (formatPhone) {
                          formatPhone.setAttribute('data-log-enterprise-id', li.id)
                        } else {
                          listArr[index].setAttribute('data-log-enterprise-id', li.id)
                        }
                      }
                    })
                  }
                }
              }
            }
          } catch (error) {
            console.error(error)
          }
        })
      },
      clickUpload(buttonName) {
        this.uploadClick({
          buttonName: buttonName
        })
      },
      uploadClick(data) {
        fetch('/core/Click/upload', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      },
      tabGoodsList(item) {
        this.goodsId = item.id
        this.isDefaultGoodsList = item
      },
      async tabPayTab(item) {
        if (item.id === 'ali_pay') {
          try {
            const { code, data } = await this.createVipOrder(this.goodsId, 'ali_pay')
            if (code === 101 && data) {
              this.vipOrder = data
              this.goPay(data.payReturn, 'ali_pay')
            } else {
              this.vipOrder = { orderNo: '', payReturn: '' }
            }
          } catch (error) {
            console.error(error)
            this.vipOrder = { orderNo: '', payReturn: '' }
          }
        }
      },
      async openMemberInterest() {
        try {
          const { code, data, msg } = await this.getGoodsList()
          if (code === 101 && data) {
            this.goodsList = data
            const isDefault = data.find(item => {
              return item.isDefault
            })
            if (isDefault) {
              this.tabGoodsList(isDefault)
            } else {
              this.tabGoodsList(data[0])
            }
            this.memberVisible = true
            return
          }
          this.$message.error(msg)
        } catch (error) {
          console.error(error)
        }
      },
      getOrderDetail(orderNo) {
        if (!orderNo) return
        return new Promise((resolve, reject) => {
          fetch('/core/vipTrade/getVipOrderDetail?orderNo=' + orderNo, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
            .then(response => response.json())
            .then(resolve)
            .catch(reject)
        })
      },
      createVipOrder(goodsId, payType) {
        return new Promise((resolve, reject) => {
          fetch('/core/vipTrade/createVipOrder', {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
              goodsId: goodsId,
              payType: payType
            })
          })
            .then(response => response.json())
            .then(resolve)
            .catch(reject)
        })
      },
      goPay(payReturn, payId) {
        if (!this.agree) {
          // 先勾选
          this.$message({
            message: '请阅读并同意《平台信息服务协议》',
            type: 'success'
          })
        }
        if (payId === 'wx_pay') {
          this.QRCode = generateQRCodeBase64(payReturn)
        }
        if (payId === 'ali_pay') {
          let divForm = document.getElementsByTagName('divform')
          if (divForm.length) {
            document.body.removeChild(divForm[0])
          }
          const div = document.createElement('divform')
          div.innerHTML = payReturn // res.data就是sb支付宝返回给你的form

          div.querySelector('form').setAttribute('target', '_blank')
          document.body.appendChild(div)
          // document.forms[0].setAttribute('target', '_blank') // 加了_blank可能出问题所以我注释了
          document.querySelector('divform form').submit()
        }

        this.polling()
      },
      // 轮询查询
      polling() {
        class Interval {
          constructor() {
            this.startPolling()
          }
          async startPolling() {
            settledApp.wxTimer = setTimeout(async () => {
              try {
                if (settledApp.memberVisible === false) {
                  clearTimeout(settledApp.wxTimer)
                  settledApp.wxTimer = null
                  return
                }
                const { code, data, msg } = await settledApp.getOrderDetail(settledApp.vipOrder.orderNo)
                if (code === 101) {
                  if (data && data.status === 'success') {
                    clearTimeout(settledApp.wxTimer)
                    settledApp.wxTimer = null
                    // window.open('/buy/memberSuccess?orderNo=' + settledApp.vipOrder.orderNo, '_blank')
                    location.reload()
                    return
                  }
                  this.startPolling() // 继续轮询
                } else if (code === 102) {
                  settledApp.$message({
                    type: 'error',
                    message: msg
                  })
                } else {
                  settledApp.$message({
                    type: 'error',
                    message: '支付失败！'
                  })
                }
              } catch (error) {
                settledApp.$message({
                  type: 'error',
                  message: '支付失败！'
                })
              }
            }, 2000)
          }
        }

        if (!settledApp.wxTimer) new Interval()

        // 清除 60s后结束
        setTimeout(() => {
          clearTimeout(settledApp.wxTimer)
          settledApp.wxTimer = null
          // location.reload()
          settledApp.goPay(settledApp.vipOrder.payReturn, settledApp.payId)
        }, 3 * 60 * 1000)
      },
      initMemberDialog() {
        destroyQRCode()
        clearTimeout(this.wxTimer)
        this.wxTimer = null
        this.vipOrder = {
          orderNo: '',
          payReturn: ''
        }
        this.QRCode = ''
        this.goodsId = ''
      }
    },
    mounted() {
      this.statisticsLog()
    }
  })

  const reg = /^[1][0-9]{10}$/
  const loginApp = new Vue({
    el: '#loginApp',
    data: function() {
      var checkPhone = function(rule, value, callback) {
        if (!value) {
          return callback(new Error('手机号不能为空'))
        } else {
          if (reg.test(value)) {
            callback()
          } else {
            return callback(new Error('请输入正确的手机号'))
          }
        }
      }

      var validatePass = function(rule, value, callback) {
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

      var validatePass2 = function(rule, value, callback) {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== loginApp.fillInfoForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }

      return {
        loading: false,
        activeTab: 0, // 0账号密码 1微信登录 2完善信息
        activeName: 'login', // login账号密码 reg短信/注册
        byShare: [],
        // 账号密码登录
        loginForm: { username: '', password: '' },
        loginRules: {
          username: [{ required: true, trigger: 'blur', message: '账号不能为空' }],
          password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
        },
        // 短信验证码登录
        itemKey: Math.random(), // 图片验证码
        phoneLoginForm: {
          cellphone: '',
          captcha: '123456',
          phone_captcha: ''
        },
        phoneLoginRules: {
          // captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
          captcha: [],
          phone_captcha: [
            { required: true, message: '请输入短信验证码', trigger: 'blur' },
            { pattern: /^[0-9]{6}$/, message: '请填写正确的短信验证码', trigger: 'blur' }
          ],
          cellphone: [{ validator: checkPhone, trigger: 'blur' }]
        },
        getPhoneCaptchaBtnStatus: true, // 短信验证码禁用
        getPhoneCaptchaBtnTxt: '发送验证码',
        countDown: 120, // 倒计时
        captchaTime: 120, // 倒计时数字显示
        wxCodeSrc: '',
        wxLoading: true,
        fillInfoForm: {
          name: '', // 姓名
          password: '', // 密码
          password_rep: '' // 重复密码
        },
        fillInfoRules: {
          password: [{ validator: validatePass, trigger: 'blur' }],
          password_rep: [{ validator: validatePass2, trigger: 'blur' }]
        },
        base64: 'data:image/png;base64,',
        paramUrl: suzao.paramObj(),
        wx: false,
        wxTimer: null,
        loginVisible: false,

        captcha: null,
        isCaptcha: false,

        refer: ''
      }
    },
    watch: {
      activeTab: {
        handler: function(newVal, oldVal) {
          if (newVal === 1) {
            this.getLoginQr()
          } else if (this.wxTimer) {
            clearTimeout(this.wxTimer)
          }

          this.initAliyunCaptcha()
        },
        immediate: true
      }
    },
    mounted() { },
    methods: {
      closeDialog() {
        // 必须删除相关元素，否则再次mount多次调用 initAliyunCaptcha 会导致多次回调 captchaVerifyCallback
        // document.getElementById('aliyunCaptcha-mask')?.remove()
        // const embed = document.getElementById('aliyunCaptcha-window-embed')
        // embed && embed.remove()
      },
      openDialog(refer) {
        if (document.getElementById('login')) {
          return
        }
        this.refer = ''
        if (!this.byShare.length) {
          this.requestData()
        }
        if (typeof refer === 'string') this.refer = refer
        this.loginVisible = true
      },
      // 信息登录/短信注册登录 tab切换
      handleClick: function(event) {
        if (event && event.name && event.name != this.activeName) {
          this.activeName = event.name
        }
        this.initAliyunCaptcha()
        if (this.$refs.tabs && this.$refs.tabs.$el) this.resetActivePosition(this.$refs.tabs.$el)

        // 更改url定位到注册
        event &&
          suzao.changeURLStatic({
            active: event.name
          })
      },
      // tab样式调整
      resetActivePosition: function(el) {
        // this.$nextTick(function () {
        //   var activeEl = $(el).find('.el-tabs__item.is-active')[0]
        //   var lineEl = $(el).find('.el-tabs__active-bar')[0]
        //   var style = window.getComputedStyle(activeEl)
        //   var w = style.width.match(/\d+/)[0] * 1
        //   lineEl.style.transform = 'translateX(' + activeEl.offsetLeft + 'px)'
        //   lineEl.style.width = w + 'px'
        // })
      },
      // 切换登录方式
      tabForm: function(index) {
        this.activeTab = index
      },
      // 账号密码登录
      submitLogin: function(ref) {
        this.$refs[ref].validate(function(valid) {
          if (valid) {
            loginApp.loading = true
            fetch('/login/ajax', {
              method: 'POST',
              body: suzao.parseFormData(loginApp[ref])
            })
              .then(response => response.json())
              .then(data => {
                if (data.status === 1) {
                  loginApp.goRefer()
                } else {
                  loginApp.$message({
                    type: 'error',
                    message: data.errors.join('')
                  })
                  loginApp.loading = false
                }
              })
          }
        })
      },
      async getYunDunCheck(data) {
        const response = await fetch('/core/yunDun/checkV2', {
          method: 'POST',
          body: data,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        })
        return await response.json()
      },
      async sendPhoneCaptcha() {
        const response = await fetch('/vendor/sendPhoneCaptcha', {
          method: 'POST',
          body: suzao.parseFormData({
            cellphone: loginApp.phoneLoginForm.cellphone,
            captcha: loginApp.phoneLoginForm.captcha,
            type: 'login'
          }),
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
        return await response.json()
      },
      // 解禁短信验证码按钮
      isCaptchaOK: function(value) {
        this.getPhoneCaptchaBtnStatus = !reg.test(value)
      },
      // 短信验证码计时结束
      endTiming: function(timer) {
        if (timer) clearTimeout(timer)
        this.getPhoneCaptchaBtnTxt = '发送验证码'
        this.captchaTime = this.countDown
        this.isCaptchaOK(loginApp.phoneLoginForm.cellphone)
      },
      // 短信登录 并根据获取的信息判断是需要完善资料
      submitPhoneForm: function(ref) {
        this.$refs.phoneLoginForm.validate(async function(valid) {
          if (!valid) return false
          loginApp.loading = true
          const data = await loginApp.byPhoneCaptcha()
          if (data.status === 1) {
            loginApp.loading = false
            // 这里需要进行判断 是否是注册
            if (data.user.has_password) {
              loginApp.goRefer()
            } else {
              loginApp.tabForm(2)
            }
          } else {
            loginApp.$message({
              type: 'error',
              message: data.errors.join('')
            })
            loginApp.loading = false
          }
        })
      },
      // 登录
      async byPhoneCaptcha() {
        const response = await fetch('/login/byPhoneCaptcha', {
          method: 'POST',
          body: suzao.parseFormData({
            phone: loginApp.phoneLoginForm.cellphone,
            phone_captcha: loginApp.phoneLoginForm.phone_captcha
          })
        })
        return await response.json()
      },
      // 获取微信登录图片
      getLoginQr: function() {
        fetch('/vendor/getYqszLoginQr', {
          // dataType: 'json',
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.status === 1) {
              loginApp.wxLoading = false
              loginApp.wxCodeSrc = loginApp.base64 + data.data.img
              // 开始轮询
              loginApp.polling()
            } else {
              loginApp.$message({
                type: 'error',
                message: data.errors || data
              })
            }
          })
      },
      // 完善资料
      setFillInfo: function(ref) {
        this.$refs[ref].validate(function(valid) {
          if (!valid) return false
          loginApp.loading = true
          fetch('/member/fillInfo?scene=m_user', {
            method: 'POST',
            body: JSON.stringify(loginApp[ref])
          })
            .then(response => response.json())
            .then(data => {
              if (data.status === 1) {
                loginApp.goRefer()
              } else {
                loginApp.$message({
                  type: 'error',
                  message: data.errors.join('')
                })
                loginApp.loading = false
              }
            })
        })
      },
      // 根据不同页面进行不同处理
      goRefer: function() {
        this.$message({
          type: 'success',
          message: '登录成功'
        })
        this.loginVisible = false
        if (suzao.isValidURL(this.refer)) {
          window.location.href = this.refer
        } else {
          window.location.reload()
        }
        // if (this.paramUrl.refer) {
        //   window.location.href = decodeURIComponent(this.paramUrl.refer)
        // } else {
        //   window.location.reload()
        // }
      },
      // 轮询查询
      polling: function() {
        const polling = function() {
          fetch('/vendor/checkGzhLogin')
            .then(response => response.json())
            .then(data => {
              if (data.status === 1) {
                loginApp.wxTimer = setTimeout(polling, 2000)
                // 执行代码块
              } else if (data.status === 2) {
                clearTimeout(loginApp.wxTimer)
                // 扫码成功
                if (data.data.status === 1) {
                  if (data.data.has_user) {
                    loginApp.goRefer()
                  } else {
                    // 绑定手机号
                    loginApp.tabForm(0) // 切换到登录
                    loginApp.handleClick({ name: 'reg' }) // 切换到手机登录/注册/完善手机号
                    loginApp.wx = true
                  }
                } else {
                  // 失败
                  loginApp.$message({
                    type: 'error',
                    message: '扫码失败！'
                  })
                }
              } else {
                clearTimeout(loginApp.wxTimer)
                // 失败
                loginApp.$message({
                  type: 'error',
                  message: '扫码失败！'
                })
              }
            })
        }

        loginApp.wxTimer = setTimeout(polling, 2000)
        // 清除 60s后结束
        setTimeout(function() {
          clearTimeout(loginApp.wxTimer)
        }, 60000)
      },
      // 登录页广告
      requestData: function() {
        fetch('/core/adv2/getAdvertising?id=100004&num=1&isGetTopAdvertising=false', {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
          .then(response => response.json())
          .then(data => {
            if (data.code === 101) {
              if (data.data.advertisingList.length) {
                loginApp['byShare'] = data.data.advertisingList.filter((item, index) => {
                  item.image = JSON.parse(item.image)
                  item.video = JSON.parse(item.video)
                  return item
                })
              }
            }
          })
      },
      getInstance(instance) {
        this.captcha = instance
      },
      async captchaVerifyCallback(captchaVerifyParam) {
        // 1.向后端发起业务请求，获取验证码验证结果和业务结果
        const { code, msg } = await this.getYunDunCheck(captchaVerifyParam)
        const isOK = code === 101
        this.isCaptcha = isOK
        return {
          captchaResult: isOK,
          bizResult: isOK
        }
      },
      // 验证通过后调用
      onBizResultCallback(bizResult) {
        this.$refs.phoneLoginForm.validateField(['cellphone'], async errorMessage => {
          if (errorMessage || !this.isCaptcha || !bizResult) {
            return false
          }
          this.isCaptcha = false
          try {
            const data = await this.sendPhoneCaptcha()
            if (data.status === 1) {
              suzao.countdownTimer({
                startCallback: function() {
                  loginApp.getPhoneCaptchaBtnStatus = true
                  loginApp.getPhoneCaptchaBtnTxt = loginApp.captchaTime + 's后重新发送'
                },
                callback: function(timer) {
                  loginApp.captchaTime--
                  loginApp.getPhoneCaptchaBtnTxt = loginApp.captchaTime + 's后重新发送'
                },
                endCallback: loginApp.endTiming,
                endTime: loginApp.countDown,
                timeInterval: 1
              })
              this.$message({
                type: 'success',
                message: '发送成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: data.errors.join('')
              })
            }
          } catch (error) {
            console.error(error)
          }
        })
      },
      initAliyunCaptcha() {
        if (this.activeName !== 'reg' || this.activeTab !== 0) return false
        window.initAliyunCaptcha({
          SceneId: 'vs4yhveq', // 场景ID。通过步骤一添加验证场景后，您可以在验证码场景列表，获取该场景的场景ID
          prefix: 'f0n0ey', // 身份标。开通阿里云验证码2.0后，您可以在控制台概览页面的实例基本信息卡片区域，获取身份标
          mode: 'embed', // 验证码模式。embed表示要集成的验证码模式为嵌入式。无需修改
          element: '#captcha-element', // 页面上预留的渲染验证码的元素，与原代码中预留的页面元素保持一致。
          button: '#captcha-img', // 触发业务请求的元素。button表示单击登录按钮后，触发captchaVerifyCallback函数。您可以根据实际使用的元素修改element的值
          captchaVerifyCallback: this.captchaVerifyCallback, // 业务请求(带验证码校验)回调函数，无需修改
          onBizResultCallback: this.onBizResultCallback, // 业务请求结果回调函数，无需修改
          getInstance: this.getInstance, // 绑定验证码实例函数，无需修改
          slideStyle: {
            width: 394,
            height: 50
          }, // 滑块验证码样式，支持自定义宽度和高度，单位为px。其中，width最小值为320 px
          immediate: false, // 完成验证后，是否立即发送验证请求（调用captchaVerifyCallback函数）
          language: 'cn' // 验证码语言类型，支持简体中文（cn）、繁体中文（tw）、英文（en）
        })
      }
    }
  })

  window.openSettledDialog = function(becomeForm) {
    if (window.suzao && window.suzao.hasScrollbar) {
      window.suzao.hasScrollbar()
    }
    if (settledApp && settledApp.openDialog) {
      if (becomeForm && becomeForm.target === undefined) {
        settledApp.openDialog(becomeForm)
      } else {
        settledApp.openDialog()
      }
    }
  }
  window.openLoginDialog = function(refer) {
    if (window.suzao && window.suzao.hasScrollbar) {
      window.suzao.hasScrollbar()
    }
    if (loginApp && loginApp.openDialog) {
      loginApp.openDialog(refer || '')
    }
  }

  window.getItem = function() {
    if (settledApp && settledApp.getItem) {
      return settledApp.getItem('getItem')
    }
  }

  window.openMemberInterest = function() {
    if (window.suzao && window.suzao.hasScrollbar) {
      window.suzao.hasScrollbar()
    }
    if (settledApp && settledApp.openMemberInterest) {
      settledApp.openMemberInterest()
    }
  }

  addEventListener('click', function(event) {
    const clickDom = event.target
    if (event.target.classList.contains('open-member-interest') || clickDom.closest('.open-member-interest')) {
      window.openMemberInterest()
    }
  })
})
