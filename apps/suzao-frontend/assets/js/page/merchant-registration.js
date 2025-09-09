addEventListener('load', () => {
  if (suzao.userAgent !== 'PC') $axios.defaults.headers['Client-Type'] = 2
  const generateQRCodeBase64 = (url, typeNumber, errorCorrectLevel) => {
    // return new QRCode(document.getElementById('QRCode'), url)
    return new QRCode('QRCode', {
      text: url,
      errorCorrectionLevel: 'H',
      version: 2,
      width: 158,
      height: 158
    })

    // return document.getElementById('QRCode').innerHTML
    // return new Promise(async (resolve, reject) => {
    //   try {
    //     const div = document.createElement('div')
    //     const qcCode = await new QRCode(div, url)
    //     const base64Image = qcCode.querySelector('canvas').toDataURL('image/png')
    //     return resolve(base64Image)
    //   } catch (err) {
    //     reject(err)
    //   }
    // })
  }

  const statusInformation = 0 // 填写资料
  const statusExamine = 1 // 审核中
  const statusExamineSuccess = 2 // 审核成功
  const statusBuy = 4 // 初始买牌号
  const statusOrder = 5 // 订单预览/支付

  // 入驻初始表单
  const initMerchantForm = {
    id: '',
    surname: '', // 姓
    fame: '', // 名
    gender: '1', // 性别
    companyname: '', // 公司
    cellphone: '', // 电话
    businessLicence: '', // 公司营业执照
    contactEmail: '', // 邮箱地址
    invitationCode: '', // 邀请码
    companyFullAddress: '', // 公司地址
    // proxyCardUrl: [], // 上传代理证
    // ticketImageUrl: '', // 开票图片

    ticketName: '', // 单位名称*
    ticketRegistrationNo: '', // 税务登记号
    ticketBankDeposit: '', // 开户银行
    ticketAccount: '', // 账号
    ticketAddress: '', // 地址
    ticketPhone: '', // 电话
    moneyVerify: '', // 激活码

    ticketExamineFields: [], // 错误字段
    ticketExamineInfo: '', // 错误信息

    enterprisePutStatus: 1, // 商家资料提交状态 初始1，提交后2。取消审核后变回1。
    ticketExamineStatus: 0 // 审批状态
  }

  // 选择牌号区域初始表单
  const initBindProductForm = {
    key: '', // 牌号
    cid: '', // 种类
    mid: '', // 制造商
    category: '', // 选择套餐
    rmb: '',
    usd: '',
    saleScopeArr: []
  }

  // 选择牌号区域提交初始表单enterpriseMarketV2VOList
  const initEnterpriseMarketV2VO = {
    mid: '',
    mfrsName: '',
    rmb: undefined, //人民币
    usd: undefined, //美元
    baseId: '', //物性表id
    uuid: '',
    gradeName: '', //牌号
    speciesName: '', //种类
    trademark: '' //商品名
  }
  let controller = ''
  const initErrorVisibleData = {
    title: '牌号冲突提示',
    msg: '尊敬的用户非常抱歉，您选择的牌号已经被其他供应商买断，请选择其他牌号',
    button: '重新选择'
  }
  const merchantRegistration = new Vue({
    el: '#merchant-registration',
    data() {
      return {
        baseURL: 'https://suzaov2.oss-cn-shenzhen.aliyuncs.com/enterprise/',
        params: suzao.paramObj(),
        enterprisePutStatus: statusBuy,
        // stepList: [{ title: '填写入驻信息' }, { title: '资料审核' }, { title: '实体认证' }],
        merchantForm: suzao.deepClone(initMerchantForm),
        businessLicence: [],
        proxyCardUrl: [],
        ticketImageUrl: [],
        rulesMerchantForm: {
          surname: [{ required: true, trigger: 'blur', message: '姓为必填' }],
          fame: [{ required: true, trigger: 'blur', message: '名为必填' }],
          gender: [{ required: true, trigger: 'blur', message: '性别为必填' }],
          companyname: [{ required: true, trigger: 'blur', message: '公司名称为必填' }],
          businessLicence: [{ required: true, trigger: 'change', message: '公司营业执照为必填' }],
          companyFullAddress: [{ required: true, trigger: 'blur', message: '公司地址为必填' }]
          // contactEmail: [
          //   {
          //     pattern:
          //       /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          //     trigger: 'blur',
          //     message: '请输入正确的邮箱地址'
          //   }
          // ],
          // invitationCode: [{ trigger: 'blur', pattern: /^\d+$/, message: '邀请码格式不正确' }],
          // // ticketName: [{ required: true, trigger: 'blur', message: '单位名称为必填' }],
          // // ticketRegistrationNo: [{ required: true, trigger: 'blur', message: '税务登记号为必填' }],
          // ticketBankDeposit: [{ required: true, trigger: 'blur', message: '开户银行为必填' }],
          // ticketAccount: [
          //   { required: true, trigger: 'blur', message: '银行账号为必填' }
          //   // { trigger: 'blur', pattern: /^(?:(?:[A-Za-z0-9]{4}\s?)+[A-Za-z0-9]{1,4})$/, message: '银行账号格式不正确' }
          // ],
          // ticketAddress: [], // 如果需要验证，可以添加规则
          // // ticketPhone: [{ pattern: /^1[0-9]{10}$|^0\d{2,3}-\d{7,8}$/, trigger: 'blur', message: '请输入正确的手机号' }],
          // moneyVerify: [
          //   { required: true, trigger: 'blur', message: '激活码为必填' },
          //   { trigger: 'blur', pattern: /^(([1-9]{1}\d{0,4})|(0{1}))(\.\d{1,2})?$/, message: '格式不正确，激活码为纯数字' }
          // ]
        },
        isVerification: true, // 是否验证
        checked: false,
        countdownNum: 5,
        submitForm: {
          agree: false
        },
        rulesSubmitForm: {
          agree: [{ required: true, message: '您必须同意协议', trigger: 'change' }]
        },
        btnText: '确认协议并支付',
        bindProductForm: suzao.deepClone(initBindProductForm),
        rulesBindProductForm: {
          saleScopeArr: [{ required: true, message: '绑定区域必选', trigger: 'change' }],
          category: [{ required: true, message: '推广周期必选', trigger: 'change' }],
          key: [
            { required: true, message: '请选择牌号', trigger: 'blur' } // 牌号
          ],
          cid: [
            { required: true, message: '请选择种类', trigger: 'change' } // 种类
          ],
          mid: [
            { required: true, message: '请选择制造商', trigger: 'change' } // 制造商
          ],
          rmb: [
            {
              pattern: /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,2})?$/,
              message: '请输入合法的金额数字，最多两位小数',
              trigger: 'blur'
            }
          ],
          usd: [
            {
              pattern: /^(([1-9]{1}\d{0,9})|(0{1}))(\.\d{1,2})?$/,
              message: '请输入合法的金额数字，最多两位小数',
              trigger: 'blur'
            }
          ]
        },
        enterpriseMarketV2VO: Object.assign({}, initEnterpriseMarketV2VO),
        pay: 'wx', // 支付方式 wx ali
        QRCode: '',
        tipWarning: false, // 没有牌号的时候提示
        visibleTip2: false,
        visibleTip3: false,
        visibleTip6: false,
        dialogVisible: false,
        errorVisibleData: Object.assign({}, initErrorVisibleData),
        dialogImageUrl: '',
        initOptionsGetGoodsList: [],
        optionsGetGoodsList: [],
        initOptionsRegion: [],
        optionsRegion: [],
        optionsMfrsList: [],
        optionsSpeciesList: [],
        initOptionsMfrsList: [],
        initOptionsSpeciesList: [],
        client: undefined,
        aliOss: {},
        clientErrorIndex: 0,
        orderDetail: {},
        wxTimer: null,
        preEnterOrder: {
          // 生成商家绑定预支付临时订单
          bindEnd: '',
          bindStart: '',
          preOrderNo: '',
          totalPrice: ''
        },
        loading: false,
        isEnterprise: undefined,
        toOrderErrorIndex: 0
      }
    },
    created() {
      this.init()
    },
    watch: {
      'bindProductForm.saleScopeArr': {
        handler: function(newVal, oldVal) {
          // 地址变更
          this.getGoodsList()
          this.createPreEnterOrder()
        }
      },
      'bindProductForm.category': {
        handler: function(newVal, oldVal) {
          this.createPreEnterOrder()
        }
      }
    },
    computed: {
      validityTime() {
        const data = this.optionsGetGoodsList.find(item => {
          return item.id === this.bindProductForm.category
        })
        if (data) return data.validityTime
        return ''
      }
    },
    filters: {
      formattedTime(timestamp) {
        if (!timestamp) return ''
        try {
          return suzao.parseTime(timestamp)
        } catch (error) {
          return timestamp
        }
      },
      daysSinceEpoch(timestamp) {
        if (!timestamp) return ''
        try {
          return timestamp / 24 / 60 / 60 / 1000
        } catch (error) {
          return timestamp
        }
      },
      join(arr) {
        if (!arr || !Array.isArray(arr) || !arr.length) return ''
        return arr.join(',')
      }
    },
    methods: {
      async init() {
        try {
          // if (suzao.userAgent === 'PC') this.initQuery()
          await this.authenticationOrder()
          this.authentication()
        } catch (error) {
          console.error(error)
        }
      },
      initQuery() {
        // 需要带参数
        const url = new URLSearchParams(this.params).toString()
      },
      authentication() {
        // 认证身份
        this.isEnterprise = localStorage.getItem('isEnterprise')
        if (!this.isEnterprise) this.btnText = '下一步（上传营业执照）'
      },
      async authenticationOrder() {
        let isEnd = false
        // 带订单的情况
        if (this.params.orderNo) {
          isEnd = this.isParamsOrderNo(this.params.orderNo)
        }
        if (!isEnd) {
          this.getGoodsList()
          await this.getRegion()
          await this.getSpeciesList()
          await this.getMfrsList()
        }
        if (this.params.uuid) {
          this.isParamsUuid(this.params.uuid)
        }
      },
      async isParamsOrderNo(paramsOrderNo) {
        try {
          // 查询订单
          const { code, data = {} } = await this.getOrderDetail(paramsOrderNo)
          // 有订单 看状态
          if (code === 101) {
            if (data.status === 'create') {
              // 待支付：create，支付成功：success，过期：expire，退款申请中：refund_apply，退款成功：refund_success
              this.enterprisePutStatus = statusOrder
              suzao.changeURLStatic({
                enterprisePutStatus: statusOrder
              })
              this.orderDetail = data
              this.getPay(paramsOrderNo)
              return 1
            } else if (data.bingGoodsPriceVOList && data.bingGoodsPriceVOList.length) {
              // 根据订单返回的数据赋值
              this.bindProductForm.saleScopeArr = data.bindScopes
              this.bindProductForm.key = data.bingGoodsPriceVOList[0].gradeName
              this.bindProductForm.cid = data.bingGoodsPriceVOList[0].speciesId + ''
              this.bindProductForm.mid = data.bingGoodsPriceVOList[0].mid
              this.bindProductForm.rmb = data.bingGoodsPriceVOList[0].rmb
              this.bindProductForm.usd = data.bingGoodsPriceVOList[0].usd
              Object.keys(initEnterpriseMarketV2VO).map(key => {
                this.enterpriseMarketV2VO[key] = data.bingGoodsPriceVOList[0][key]
              })

              await this.getRegion()
              // 处理地区
              this.getNotAvailableRegion({
                gradeId: data.bingGoodsPriceVOList[0].baseId,
                speciesId: this.bindProductForm.cid,
                mid: this.bindProductForm.mid
              })

              this.getSpeciesList()
              this.getMfrsList()
              return 1
            }
          }
        } catch (error) { }
        console.error(error)
        // 没有return 就是订单问题，直接重置url 并走绑牌号流程
        suzao.changeURLStatic({
          orderNo: undefined
        })
      },
      isParamsUuid(uuid) {
        const param = {
          can_show: 1,
          nd: 1,
          lite: 1,
          m: 0,
          v: 2,
          id: uuid
        }
        fetch('/plastic/detail?' + new URLSearchParams(param).toString(), {
          headers: {
            'x-requested-with': 'XMLHttpRequest'
          }
        })
          .then(request => request.json())
          .then(({ info: data }) => {
            const item = {
              p_base_cid: data.p_base_cid,
              p_base_mid: data.p_base_mid,
              zhname: data.zhname,
              enname: data.enname,
              p_base_id: data.id,
              uuid: data.uuid,
              p_base_gradeno: data.p_base_gradeno,
              sp_name: data.species_en,
              name: data.name
            }
            this.searchRelateGradeNoSelect(item)
          })
          .catch(console.error)
      },
      filterParams(data, initData) {
        const params = {}
        Object.entries(initData).map(([key, value]) => {
          params[key] = data[key] || value
        })
        return params
      },
      itemQuerySearch(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        if (queryString.length < 2) {
          return cb([])
        }
        var formData = new URLSearchParams()
        formData.append('key', queryString)
        fetch('/vendor/autocompleteAddress?act=company', {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(({ status, data }) => {
            if (status === 1) {
              if (data.length === 0) {
                return cb([])
              }
              var arr = data.map(item => {
                return {
                  value: item
                }
              })
              return cb(arr)
            }
            return cb([])
          })
          .catch(error => {
            console.error('Error:', error)
            return cb([])
          })
      },
      async handleSelect(value, key) {
        const { result } = await this.getTaxCredit(value)
        if (result && result.items && result.items.length) {
          const { name, idNumber } = result.items[0]
          if (key === 'companyname') {
            this.merchantForm[key] = name
            this.merchantForm.ticketName = name
            this.merchantForm.ticketRegistrationNo = idNumber
          } else if (key === 'ticketName') {
            this.merchantForm.ticketName = name
            this.merchantForm.ticketRegistrationNo = idNumber
          }
        } else {
          if (key === 'companyname') {
            this.merchantForm.ticketName = value
          }
        }
      },
      async getTaxCredit(keyword) {
        try {
          const response = await fetch('http://open.api.tianyancha.com/services/open/m/taxCredit/2.0?keyword=' + keyword, {
            headers: {
              Authorization: 'c7034c44-e721-4f83-88b6-ad79dbcbdb69'
            }
          })
          return await response.json()
        } catch (error) {
          console.error(error)
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 png JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 10MB!')
        }
        return isJPG
      },
      // 上传
      async businessLicenceSubmitUpload(e) {
        try {
          // 上传并记录
          const data = await this.uploadFile(e.file)
          if (data) {
            callRecognizeBankCard(this.baseURL + data, this.aliOss, result => {
              if (result && result.Data) {
                this.merchantForm.companyname = result.Data.Name || ''
                this.merchantForm.companyFullAddress = result.Data.Address || ''
                this.merchantForm.ticketName = result.Data.Name || ''
                this.merchantForm.ticketAddress = result.Data.Address || ''
                this.merchantForm.ticketRegistrationNo = result.Data.RegisterNumber || ''
              }
            })
            this.merchantForm.businessLicence = this.baseURL + data
            this.businessLicence.push({ url: this.baseURL + data })
            this.$refs.refMerchantForm && this.$refs.refMerchantForm.validateField('businessLicence')
          }
        } catch (error) {
          console.error(error)
          this.$message({
            typeof: 'error',
            message: '识别失败，请提供清晰的营业执照照片!'
          })
        }
      },
      // 删除图片
      businessLicenceHandleRemove(file) {
        this.merchantForm.businessLicence = ''
        this.businessLicence = []
      },
      proxyCardUrlHandleRemove(file) {
        const index = this.proxyCardUrl.indexOf(file)
        if (index !== -1) {
          this.proxyCardUrl.splice(index, 1)
          this.merchantForm.proxyCardUrl.splice(index, 1)
        }
      },
      ticketImageUrlHandleRemove(file) {
        this.merchantForm.ticketImageUrl = ''
        this.ticketImageUrl = []
      },
      // 去填认证资料
      async toMerchantForm() {
        if (this.tipWarning) {
          return false
        }
        if (!this.$refs.refBindProductForm) return false
        const valid = await this.$refs.refBindProductForm.validate()
        if (!valid) {
          return false // 如果验证失败，直接返回 false
        }
        if (!this.submitForm.agree) {
          this.isVerification = true
          this.visibleTip3 = true
          this.countdown()
          return false // 如果未同意，返回 false
        }
        if (!this.isEnterprise) {
          this.enterprisePutStatus = statusInformation
        } else {
          this.toOrder()
        }
      },
      async toOrder() {
        // 如果表单提交成功，更新状态并更改 URL
        const isOK = await this.setBindRegion()
        if (isOK) {
          if (!isOK.code) {
            suzao.changeURLStatic({ orderNo: isOK.orderNo })
            const { code, data } = await this.getOrderDetail(isOK.orderNo)
            if (code === 101) {
              this.orderDetail = data
              this.enterprisePutStatus = statusOrder
              this.toOrderErrorIndex = 0
            }
            if (this.pay === 'ali') {
              this.goPay(isOK.payReturn)
              return
            } else if (this.pay === 'wx') {
              setTimeout(() => {
                this.goPay(isOK.payReturn)
              })
            }
          } else {
            this.errorVisibleData = Object.assign({}, isOK.errorVisibleData)
            this.visibleTip6 = true
          }
        } else {
          if (this.toOrderErrorIndex < 1) {
            this.toOrderErrorIndex++
            await this.createPreEnterOrder()
            await this.toOrder()
          } else {
            this.toOrderErrorIndex = 0
          }
        }
      },
      // 提交资料，然后提交到订单
      async submitMerchantFormToOrder() {
        this.loading = true
        try {
          let next = await this.enterprisePutStatusSubmitForm()
          // 检查企业状态并提交表单
          if (next) {
            if (!this.merchantForm.id) this.merchantForm.id = next
            this.$message({
              type: 'success',
              message: '提交成功！'
            })
            this.toOrder()
          } else {
            this.$message({
              type: 'error',
              message: '上传提交失败！'
            })
          }
          this.loading = false
        } catch (error) {
          this.loading = false
          console.error('发生错误:', error)
        }
      },
      // 支付操作
      async getPay(orderNo) {
        const paramsOrderNo = orderNo || suzao.paramObj('orderNo')
        const data = await this.payForOrderNo(paramsOrderNo)
        if (data) {
          if (data.payReturn) {
            await this.goPay(data.payReturn)
            // 开启定时
            return true
          }
        }
        return false
      },
      async goPay(payReturn) {
        if (this.pay === 'wx') {
          if (suzao.userAgent === 'PC') {
            this.QRCode = await generateQRCodeBase64(payReturn)
          } else {
            // 判断是不是移动端
            // 如果是的话 调起微信支付
            // 移动端链接跳转
            this.QRCode = payReturn
          }
        }
        if (this.pay === 'ali') {
          let divForm = document.getElementsByTagName('divform')
          if (divForm.length) {
            document.body.removeChild(divForm[0])
          }
          const div = document.createElement('divform')
          div.innerHTML = payReturn // res.data就是sb支付宝返回给你的form
          document.body.appendChild(div)
          // document.forms[0].setAttribute('target', '_blank') // 加了_blank可能出问题所以我注释了
        }
        if (suzao.userAgent === 'PC') {
          if (this.pay === 'ali') {
            this.mobilePay()
          }
          this.polling()
        }
      },
      tabPay() {
        this.pay = 'ali'
        this.getPay()
      },
      // 轮询查询
      polling() {
        const orderNo = suzao.paramObj('orderNo')
        class Interval {
          constructor() {
            this.startPolling()
          }
          async startPolling() {
            merchantRegistration.wxTimer = setTimeout(async () => {
              const { code, data } = await merchantRegistration.getOrderDetail(orderNo)
              if (code === 101) {
                merchantRegistration.orderDetail = data
                if (data.status === 'create') {
                  this.startPolling() // 继续轮询
                } else {
                  clearTimeout(merchantRegistration.wxTimer)
                  merchantRegistration.wxTimer = null
                  location.href = '/buy/success?orderNo=' + orderNo
                }
              } else {
                // 支付过期
                merchantRegistration.$message({
                  type: 'error',
                  message: '支付失败！'
                })
              }
            }, 2000)
          }
        }

        if (!merchantRegistration.wxTimer) new Interval()

        // 清除 60s后结束
        setTimeout(() => {
          clearTimeout(merchantRegistration.wxTimer)
          location.reload()
        }, 3 * 60 * 1000)
      },
      // 商家入驻验证
      async enterprisePutStatusSubmitForm() {
        if (this.$refs.refMerchantForm) {
          const valid = await this.$refs.refMerchantForm.validate()
          if (!valid) {
            return false // 如果验证失败，直接返回 false
          }
          if (!this.submitForm.agree) {
            this.visibleTip3 = true
            return false // 如果未同意，返回 false
          }
        }
        try {
          const params = { ...this.merchantForm, enterprisePutStatus: statusExamineSuccess }
          params.ticketAccount = params.ticketAccount.split(/[\t\r\f\n\s]*/g).join('')
          const formData = suzao.parseFormData(params)
          // 商家申请
          const { code, data, msg } = await this.setSmallBusinessApplication(formData)
          if (code === 101) return data // 返回数据
          console.error(msg)
        } catch (error) {
          console.error(error)
        }
      },
      // 临时提交
      async temporaryEnterprisePutStatusSubmitForm() {
        if (this.merchantForm.ticketExamineStatus < 2 && this.merchantForm.enterprisePutStatus < 3) {
          const params = { ...this.merchantForm, enterprisePutStatus: statusExamine }
          params.ticketAccount = params.ticketAccount.split(/[\t\r\f\n\s]*/g).join('')
          const formData = suzao.parseFormData(params)
          // 商家申请
          const { code, data, msg } = await this.setSmallBusinessApplication(formData)
          if (code === 101 && data && !this.merchantForm.id) this.merchantForm.id = data
        }
      },
      // 绑定商品区域
      async setBindRegion() {
        try {
          this.enterpriseMarketV2VO.rmb = Number(this.bindProductForm.rmb)
          this.enterpriseMarketV2VO.usd = Number(this.bindProductForm.usd)
          const params = {
            saleScopeArr: this.bindProductForm.saleScopeArr,
            startDate: this.preEnterOrder.bindStart,
            endDate: this.preEnterOrder.bindEnd,
            preOrderNo: this.preEnterOrder.preOrderNo,
            payType: this.pay + '_pay',
            enterpriseMarketV2VOList: [
              {
                ...this.enterpriseMarketV2VO
              }
            ]
          }
          // 商家申请
          const { code, data, ...errorVisibleData } = await $axios({
            url: '/core/enterprise/bindRegion',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            data: JSON.stringify(params)
          })
          if (code === 101) return data // 返回数据
          if (code === 4010) return { code, errorVisibleData }
        } catch (error) {
          console.error(error)
        }
      },
      // 倒计时5s
      countdown() {
        if (this.isEnterprise) {
          this.submitForm.agree = true
          this.checked = true
          this.countdownNum = 0
          return
        }
        this.countdownNum = 5
        const interval = setInterval(() => {
          if (!this.visibleTip3) {
            clearInterval(interval)
          }
          this.countdownNum--
          this.submitForm.agree = false
          this.checked = false
          if (this.countdownNum <= 0) {
            clearInterval(interval)
            this.submitForm.agree = true
            this.checked = true
          }
        }, 1000)
        this.$on('destroy', () => {
          clearInterval(interval)
        })
      },
      // 打开弹窗，并进入倒计时
      openTip3(agree) {
        if (agree) {
          // 通过点击同意协议
          this.isVerification = false
          this.visibleTip3 = true
          this.countdown()
        } else {
          this.isVerification = true
          this.checked = false
        }
      },
      // 弹窗同意权限
      btnAgreeAndContinue() {
        // 有2种情况
        // 1种是点击确认支付 进行校验
        // 2种是单纯的同意协议 不进行校验
        this.submitForm.agree = true
        this.visibleTip3 = false
        if (this.isVerification) {
          this.toMerchantForm()
        }
      },
      // debounceSearchRelateGradeNo() {},
      async searchRelateGradeNoSearch(queryString, cb) {
        if (controller) controller.abort()
        if (!this.bindProductForm.cid && !this.bindProductForm.mid && queryString.length < 2) {
          return cb([])
        }
        try {
          const data = await this.searchRelateGradeNo(queryString)
          this.tipWarning = !Boolean(data.length)
          return cb(data)
        } catch (error) {
          return cb([])
        }
      },
      // 点击选择下拉牌号
      async searchRelateGradeNoSelect(item) {
        const cid = this.optionsSpeciesList.find(list => {
          return list.name === item.sp_name || (item.p_base_cid && list.id === item.p_base_cid)
        })
        const mid = this.optionsMfrsList.find(list => {
          return list.name === item.zhname || (item.p_base_mid && list.id === item.p_base_mid)
        })
        if (cid === undefined || mid === undefined) return
        // 点选牌号列表 绑定相关数据
        this.enterpriseMarketV2VO = {
          mid: item.p_base_mid,
          mfrsName: item.zhname,
          // rmb: this.bindProductForm.rmb, //人民币
          // usd: this.bindProductForm.usd, //美元
          baseId: item.p_base_id, //物性表id
          uuid: item.uuid,
          gradeName: item.p_base_gradeno, //牌号
          speciesName: item.sp_name, //种类
          trademark: item.name, //商品名
          speciesId: cid.id
        }

        this.bindProductForm.cid = cid.id
        this.bindProductForm.mid = mid.id
        this.bindProductForm.key = item.p_base_gradeno
        this.tipWarning = false
        this.$nextTick(() => {
          this.$refs.refBindProductForm.clearValidate(['key', 'cid', 'mid'])
        })
        // 处理地区
        this.getNotAvailableRegion({
          gradeId: item.p_base_id,
          speciesId: cid.id,
          mid: mid.id
        })
      },
      async getNotAvailableRegion(params) {
        const { code, data } = await $axios({ url: '/core/enterprise/getNotAvailableRegion', method: 'get', params })
        if (code === 101) {
          if (Array.isArray(data) && data.length) {
            if (data.length === this.initOptionsRegion.length) {
              this.errorVisibleData = Object.assign({}, initErrorVisibleData)
              this.visibleTip6 = true
            }
            this.optionsRegion = this.initOptionsRegion.map(item => {
              const newItem = {
                ...item
              }
              newItem.disabled = data.includes(newItem.label)
              return newItem
            })
            this.bindProductForm.saleScopeArr = suzao.deepClone(initBindProductForm.saleScopeArr)
            this.$nextTick(() => {
              this.$refs.refBindProductForm.clearValidate(['saleScopeArr'])
            })
          } else {
            this.optionsRegion = this.initOptionsRegion.map(item => {
              const newItem = {
                ...item
              }
              return newItem
            })
          }
        }
      },
      searchRelateGradeNoBlur(e) {
        if (this.enterpriseMarketV2VO.gradeName !== e.target.value) {
          this.tipWarning = true
        }
      },
      // 物性表牌号关联搜索
      async searchRelateGradeNo(key) {
        controller = new AbortController()
        if (!(key || this.bindProductForm.key)) {
          return false
        }
        const params = {
          start: 0,
          length: 9999,
          draw: 1,
          cond: 1,
          page: 1,
          key: key || this.bindProductForm.key
        }
        if (this.bindProductForm.cid) {
          params.cid = this.bindProductForm.cid
        }
        if (this.bindProductForm.mid) {
          params.mid = this.bindProductForm.mid
        }
        const {
          data: { search, data }
        } = await axios({ url: '/core/plastic/searchRelateGradeNo', method: 'get', params, signal: controller.signal })
        if (data.items && data.items.length) {
          if (search && search.species && search.mfrs) {
            this.optionsSpeciesList = search.species
            this.optionsMfrsList = search.mfrs
          }
          return data.items
        } else {
          this.optionsSpeciesList = suzao.deepClone(this.initOptionsSpeciesList)
          this.optionsMfrsList = suzao.deepClone(this.initOptionsMfrsList)
          return []
        }
      },
      // 初始牌号列表
      async getSpeciesList() {
        const response = await fetch('/vendor/getSpeciesList?v=3')
        const data = await response.json()
        if (data) {
          this.initOptionsSpeciesList = Object.entries(data).map(([key, value]) => {
            return {
              id: key,
              name: value
            }
          })
          this.optionsSpeciesList = suzao.deepClone(this.initOptionsSpeciesList)
        }
      },
      // 初始种类列表
      async getMfrsList() {
        const response = await fetch('/vendor/getMfrsList')
        const { data } = await response.json()
        if (data) {
          this.initOptionsMfrsList = data
          this.optionsMfrsList = data
        }
      },
      // 获取商家套餐列表
      async getGoodsList() {
        try {
          const { data } = await $axios({
            url: '/core/trade/getGoodsList',
            method: 'get',
            params: { category: 'bindEnterprise', scopes: this.bindProductForm.saleScopeArr.join(',') }
          })
          if (data) {
            if (!(this.initOptionsGetGoodsList && this.initOptionsGetGoodsList.length)) {
              this.optionsGetGoodsList = data
            }
            this.optionsGetGoodsList = data || []
            const isDefaultItem = data.find(item => {
              return item.isDefault
            })
            if (isDefaultItem) {
              this.bindProductForm.category = isDefaultItem.id
            } else if (data[0]) {
              this.bindProductForm.category = data[0].id
            }
          }
        } catch (error) {
          console.error(error)
        }
      },
      // 获取地区列表
      async getRegion() {
        try {
          const { data } = await $axios({ url: '/core/enterprise/getRegion', method: 'get' })
          if (data) {
            if (!(this.initOptionsRegion && this.initOptionsRegion.length)) {
              this.initOptionsRegion = data.map(item => {
                return { label: item }
              })
            }
            this.optionsRegion = data.map(item => {
              return { label: item }
            })
          }
        } catch (error) {
          console.error(error)
        }
      },
      // 生成商家绑定预支付订单
      async createPreEnterOrder() {
        if (this.bindProductForm.category) {
          try {
            const { data, code } = await $axios({
              url: '/core/trade/createPreEnterOrder',
              method: 'post',
              data: {
                scopes: this.bindProductForm.saleScopeArr,
                gradeId: this.enterpriseMarketV2VO.baseId,
                goodsIds: [this.bindProductForm.category]
              }
            })
            if (code === 101) {
              this.preEnterOrder = data
            } else if (code === 5002) {
              this.createPreEnterOrder()
            }
          } catch (error) {
            console.error(error)
            // this.$message({
            //   type: 'error',
            //   message: error.message || '生成商家绑定预支付订单失败，请刷新后再试'
            // })
          }
        }
      },
      // 获取商家申请
      async getSmallBusinessApplication() {
        try {
          const { data } = await $axios({ url: '/core/enterprise/getSmallBusinessApplication' })
          return data // 直接返回数据
        } catch (error) {
          console.error(error)
        }
      },
      async setSmallBusinessApplication(params) {
        try {
          return await $axios({
            url: '/core/enterprise/smallBusinessApplication',
            method: 'POST',
            data: params
          })
        } catch (error) {
          console.error(error)
        }
      },
      // 获取账单详情
      getOrderDetail(orderNo) {
        return $axios({
          url: '/core/trade/getOrderDetail',
          method: 'get',
          params: {
            orderNo: orderNo
          }
        })
      },
      // 根据账单号提交支付
      async payForOrderNo(orderNo) {
        const formData = new FormData()
        formData.append('orderNo', orderNo)
        formData.append('payType', this.pay + '_pay')
        const { code, data } = await $axios({
          url: '/core/trade/payForOutTradeNo',
          method: 'post',
          data: formData
        })
        if (code !== 101) return false
        return data
      },
      // 查看图片
      handlePictureCardPreview(url) {
        this.dialogImageUrl = url
        this.dialogVisible = true
      },
      // 获取oss设置信息
      async getSTSToken() {
        try {
          const res = await $axios({
            url: '/core/STSToken/getSTSToken',
            method: 'get',
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
          const config = {
            bucket: 'suzaov2',
            region: 'oss-cn-shenzhen',
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            stsToken: res.data.securityToken,
            refreshSTSTokenInterval: 3600 * 1000
          }
          this.aliOss = {
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            securityToken: res.data.securityToken
          }
          return new OSS(config)
        } catch (error) {
          console.error(error)
        }
      },
      // 上传文件
      async uploadFile(file) {
        try {
          if (!this.client) {
            this.client = await this.getSTSToken()
          }
          const { fileMd5, rcFile } = await suzao.md5Count(file)
          await this.client.put(`enterprise/${fileMd5}${rcFile.name}`, file)
          this.clientErrorIndex = 0
          return `${fileMd5}${rcFile.name}`
        } catch (error) {
          if (this.clientErrorIndex < 1) {
            this.clientErrorIndex++
            this.client = undefined
            this.uploadFile(file)
          } else {
            this.clientErrorIndex = 0
            console.error(error)
            this.$message({
              type: 'error',
              message: error.message || '文件上传失败，请刷新后重试！'
            })
          }
        }
      },
      mobilePay() {
        document.querySelector('divform form').submit()
      },
      validateTicketAccount(value) {
        this.merchantForm.ticketAccount = value
          .replace(/\D/g, '') // 删除非数字
          .replace(/(.{4})/g, '$1 ') // 每4位后添加空格
          .trim()
      }
    }
  })
})
