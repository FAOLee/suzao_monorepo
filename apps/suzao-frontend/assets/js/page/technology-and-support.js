addEventListener('load', () => {
  const attractingMerchants = new Vue({
    el: '#technology-and-support',
    data() {
      const ver = `?ver=2025051001`
      const src = `/static/page/technology-and-support/`
      return {
        tabList: [
          {
            label: '改性技术服务',
            value: 'rnd',
            bannerWap: `${src}rnd-banner-wap.png${ver}`,
            bannerPc: `${src}rnd-banner-pc.png${ver}`,
            text: [
              {
                content: '1.配方研发与优化',
                className: 'bold'
              },
              {
                content: '○定制配方开发',
                className: 'bold'
              },
              {
                content: '根据客户的特定需求，如产品的使用环境、性能要求等，开发全新的塑料配方。',
                className: ''
              },
              {
                content: '○配方优化',
                className: 'bold'
              },
              {
                content: '对现有的塑料配方进行性能改进。分析现有配方中各种原料的成本和性能，寻找性价比更高的替代原料。',
                className: ''
              },
              {
                content: '2.工艺改进与故障排除',
                className: 'bold'
              },
              {
                content: '3.技术咨询',
                className: 'bold'
              },
              {
                content: '为企业提供塑料配方工艺方面的咨询服务。包括解答企业在配方开发、生产工艺选择等方面的疑问。提供行业动态和新技术信息。',
                className: ''
              }
            ]
          },
          {
            label: '企业申请UL技术指导',
            value: 'ul',
            bannerWap: `${src}ul-banner-wap.png${ver}`,
            bannerPc: `${src}ul-banner-pc.png${ver}`,
            text: [
              {
                content: '根据企业申请的UL项目，如RTI、阻燃等级、F1等相关申请项目，',
                className: ''
              },
              {
                content: '我们将提供相关技术辅导，内容包括以下：',
                className: ''
              },
              {
                content: '①协助配方合理性',
                className: 'bold mt30'
              },
              {
                content: '②协助材料的制造工艺',
                className: 'bold'
              },
              {
                content: '③协助后期检测试样流程',
                className: 'bold'
              }
            ]
          },
          {
            label: '广告招商',
            value: 'advertise',
            bannerWap: `${src}advertise-banner.png${ver}`,
            bannerPc: `${src}advertise-banner.png${ver}`
          }
        ],
        settled: {
          label: '改性企业推广服务',
          value: 'settled',
          bannerWap: `${src}settled-banner-wap.png${ver}`,
          href: '/activities/settled/index.html?hash=a6a18e0b311647b2af0075f388bc662a'
        },
        params: suzao.paramObj(),
        tab: '',
        banner: null,
        paginationIndex: 0,
        swiper: null,
        loading: true,
        form: {
          username: '',
          cellphone: '',
          position: '',
          companyName: '',
          projectName: '',
          detail: ''
        },
        rules: {
          username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          cellphone: [
            {
              required: true,
              message: '请输入电话号码',
              trigger: 'blur'
            },
            {
              validator: function (rule, value, callback) {
                if (/^((0\d{2,3}-\d{5,8})|(1[34578]\d{9}))$/.test(value) == false) {
                  callback(new Error('电话格式错误'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ],
          companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
          projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }]
        },
        visible: false
      }
    },
    computed: {
      show() {
        return document.body.clientWidth > 992
      }
    },
    methods: {
      init() {
        if (this.params.tab) this.tab = this.params.tab
        // this.tabChange(this.params.tab)
        if (!this.show) {
          const activeTab = this.tabList.find(item => this.params.tab === item.value)
          const title = activeTab ? activeTab.label : '技术服务'
          document.title = title
          if (this.tab === 'advertise') {
            this.visible = true
          }
        }
        this.loading = false
      },
      tabChange(value) {
        if (value && !this.show) {
          if (suzao.paramObj('tab') === value) return
          this.loading = true
          const isTab = this.tabList.find(item => item.value === value)
          if (isTab) {
            this.tab = value
          }
          this.loading = false
          // suzao.changeURLStatic({ tab: value })
          location.href = `${location.origin}${location.pathname}?tab=${value}`
        }
      },
      backToTop() {
        // 返回顶部
        const topBtn = document.getElementById('to-top')
        topBtn.addEventListener('click', e => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        })
        window.addEventListener('scroll', scrollFunction)
        function scrollFunction() {
          if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            topBtn.classList.remove('dn')
          } else {
            topBtn.classList.add('dn')
          }
        }
      },
      // initSwiper(id) {
      //   const dom = document.querySelector(id)
      //   if (dom) {
      //     const swiper = new Swiper(id, {
      //       noSwiping: true,
      //       autoHeight: true,
      //       pagination: {
      //         el: '.swiper-pagination'
      //       }
      //     })
      //   }
      // },
      submitForm() {
        this.$refs.form.validate(async valid => {
          if (valid) {
            const params = {
              ...this.form,
              type: this.tab
            }
            try {
              const response = await fetch('/core/tech/booking', {
                method: 'POST',
                body: JSON.stringify(params),
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              const { code, msg } = await response.json()
              if (code === 101) {
                this.$message.success(msg)
                this.form = {
                  username: '',
                  cellphone: '',
                  position: '',
                  companyName: '',
                  projectName: '',
                  detail: ''
                }
                this.visible = false
                return
              }
              this.$message.error(msg)
            } catch (error) {
              this.$message.error('提交失败，请稍后再试')
            }
          }
        })
      },
      closeForm(event) {
        if (this.tab === 'advertise') {
          this.visible = true
        } else if (event.srcElement.classList.contains('form-mask')) {
          this.visible = false
        }
      },
      clickUpload(buttonName) {
        if (!this.show) {
          this.uploadClick({
            buttonName: buttonName
          })
        }
      },
      uploadClick(data) {
        fetch('/core/Click/upload', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
    },
    created() {
      this.init()
    },
    mounted() {
      this.backToTop()
    }
  })
})
