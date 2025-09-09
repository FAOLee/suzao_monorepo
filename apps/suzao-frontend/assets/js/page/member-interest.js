addEventListener('load', () => {
  const merchantRegistration = new Vue({
    el: '#memberInterest',
    data() {
      const iconSrc = '/frontend/assets/layout/icon-member'
      const ver = '.png?ver=20250220'
      return {
        loading: true,
        btnLoading: true,
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
        vipStatus: 'off',
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
    watch: {
      goodsPayId: {
        async handler(newVal, oldVal) {
          if (newVal) {
            try {
              this.btnLoading = true
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
            this.btnLoading = false
          }
        }
      }
    },
    computed: {
      goodsPayId() {
        return this.goodsId + this.payId
      },
      payBtnDay() {
        return this.isDefaultGoodsList.validityTime
      },
      payBtnPrice() {
        return this.isDefaultGoodsList.price
      }
    },
    filters: {},
    methods: {
      async init() {
        this.openMemberInterest()
        this.polymerizationInfo()
        this.loading = false
      },
      async polymerizationInfo() {
        try {
          const request = await fetch('/core/enterprise/polymerizationInfo')
          const { data } = await request.json()
          if (data && data.vipStatus) {
            this.vipStatus = data.vipStatus
          }
        } catch (error) {
          console.error(error)
        }
      },
      getGoodsList() {
        return new Promise((resolve, reject) => {
          fetch('/core/vipTrade/getGoodsList', {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Client-Type': 2
            }
          })
            .then(response => response.json())
            .then(resolve)
            .catch(reject)
        })
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
            return
          }
          this.$message.error(msg)
        } catch (error) {
          console.error(error)
        }
      },
      tabGoodsList(item) {
        this.goodsId = item.id
        this.isDefaultGoodsList = item
      },
      async tabPayTab(id) {
        if (this.payId === id) return
        try {
          const { code, data } = await this.createVipOrder(this.goodsId, id)
          if (code === 101 && data) {
            this.vipOrder = data
            this.goPay(data.payReturn, id)
          }
        } catch (error) {
          console.error(error)
          this.vipOrder = { orderNo: '', payReturn: '' }
        }
      },
      getOrderDetail(orderNo) {
        if (!orderNo) return
        return new Promise((resolve, reject) => {
          fetch('/core/vipTrade/getVipOrderDetail?orderNo=' + orderNo, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Client-Type': 2
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
              'Content-Type': 'application/json',
              'Client-Type': 2
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
          this.QRCode = payReturn
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
        }
      },
      mobilePay() {
        document.querySelector('divform form').submit()
      }
    }
  })
})
