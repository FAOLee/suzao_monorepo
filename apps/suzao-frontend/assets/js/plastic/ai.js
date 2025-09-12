addEventListener('load', () => {
  var app = new Vue({
    el: '#app',
    data() {
      var that = this
      var validateName = function (rule, value, callback) {
        if (!that.showCorrectForm.suggestContent && !that.showCorrectForm.suggestType.length && !that.showCorrectForm.imagesUrl) {
          callback(new Error('请至少填写一项'))
        } else {
          //任意值被填写，清除验证提示
          if (!that.showCorrectForm.suggestContent || !that.showCorrectForm.suggestType.length || !that.showCorrectForm.imagesUrl) {
            that.$refs.showCorrectForm.clearValidate()
          }
          callback()
        }
      }
      return {
        info: {
          company_logo: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
          name: CHAT_TEXT.welcome
        },
        colorString: '',
        titleList: [],
        tipList: [],
        aiHomeQueryList: [],
        btn: {
          url: '',
          text: ''
        },
        byShare: [], // 广告
        byKyeIds: [],
        showCorrectVisible: false, // 纠错弹窗
        initShowCorrectForm: { suggestContent: '', suggestType: [], operateType: 2, imagesUrl: '' },
        showCorrectForm: {}, // 纠错表单
        suggestSettingText: {
          title: [],
          radioList: []
        },
        initShowCorrectRules: {
          suggestContent: [{ trigger: 'blur', message: '反馈内容不能为空', validator: validateName }],
          suggestType: [{ trigger: 'change', message: '反馈内容不能为空', validator: validateName }],
          imagesUrl: [{ trigger: 'change', message: '反馈内容不能为空', validator: validateName }]
        },
        showCorrectRules: {
          suggestContent: [{ trigger: 'blur', message: '反馈内容不能为空', validator: validateName }],
          suggestType: [{ trigger: 'change', message: '反馈内容不能为空', validator: validateName }],
          imagesUrl: [{ trigger: 'change', message: '反馈内容不能为空', validator: validateName }]
        }, // 纠错表单验证
        formData: {
          name: '', // 姓名
          company: '', // 公司
          industry: '', // 行业
          supply: '', // 产品
          company_full_address: '' // 地址
        }, // 完善资料表单
        memberIndustry: [],

        viewLoading: true,
        tipShow: false, // 提示
        aiHistory: { pageNum: 1, pageSize: 10 }, // 右边
        aiHistoryLeft: { pageNum: 1, pageSize: 30 }, // 左边
        aiTotalEndLeft: false, // 左侧聊天记录是否加载完毕
        aiTotalEnd: false, // 右聊天记录是否加载完毕
        aiTotalLength: 0, // 右边一共多少条
        aiTotalLengthLeft: 0, // 左边一共多少条
        aiTotalLoadingLeft: false,
        aiTotalLoading: false, // 右聊天记录加载
        chatLoading: false, // 渲染等待
        transitionLoading: false, // 问完问题，开启等待提示，有回答了，关闭等待提示
        scrollHeight: 0, // 聊天记录滚动高度
        eventSource: null, // 聊天记录连接
        isFloor: true, // 用户是否滚动到底部
        chatList: [], // ai聊天记录 右边
        recordList: [], // ai聊天列表 左边
        typeList: {
          display: {
            type: 'display',
            className: 'plastic-content',
            htmlString: '',
            ansId: '',
            convId: '',
            transitionLoading: false,
            answerType: '',
            ansResultType: ''
          },
          // llm通讯方式
          llm: {
            type: 'display',
            className: 'text-message-content',
            htmlString: '',
            ansId: '',
            convId: '',
            transitionLoading: false
          },
          // 提问
          question: {
            type: 'display',
            className: 'user text-message-content',
            htmlString: '',
            ansId: '',
            convId: '',
            transitionLoading: false
          },
          // 新对话
          init: {
            type: 'init',
            className: 'init-content',
            colorString: '',
            titleTip: '',
            title: '',
            tip: '',
            text: [],
            transitionLoading: false
          },
          // 推荐问题框
          recommend: {
            type: 'recommend',
            className: 'recommend-content',
            htmlString: '',
            text: [], // 问题  <p class="text"></p>
            tip: '' // 提示词 <div class="tip"></div> 1.初始提示 你可以像这样试着问我：2.回答提示 你是不是还想了解以下信息：
          },
          // 反馈框 重试复制
          feedback: {
            type: 'feedback',
            className: 'feedback-content',
            answerType: '',
            ansId: '',
            convId: '',
            isLike: false,
            isDiss: false,
            queryContent: '',
            total: 0,
            ansResultType: '',
            length: 0
          },
          // 表单
          form: {
            type: 'form',
            className: 'form-content',
            industry: false,
            company: false,
            name: false,
            ansId: '',
            convId: ''
          },
          // 商家
          business: {
            type: 'business',
            className: 'business-content',
            list: [],
            ansId: '',
            convId: ''
          },
          compare: {
            type: 'compare',
            className: 'compare-content',
            code: '',
            spInfoList: '',
            ansId: '',
            convId: ''
          },
          commodity: {
            type: 'commodity',
            className: 'commodity-content',
            ansId: '',
            convId: '',
            ansShowTips: '',
            commodityVOList: []
          },
          replace: {
            type: 'replace',
            className: 'replace-content',
            ansId: '',
            convId: '',
            answerType: '',
            ansResultType: '',
            ansShowTips: '',
            ansShowType: '',
            foldingState: false,
            ansLines: []
          },
          replaceCompare: {
            type: 'replace-compare',
            className: 'replace-compare-content',
            queryContent: '',
            ansId: '',
            convId: '',
            ansResultType: '',
            ansShowType: '',
            uuid: '',
            firstItemLine: {}
          },
          formula: {
            type: 'formula',
            className: 'formula-content',
            ansId: '',
            convId: '',
            ansResultType: '',
            ansShowType: '',
            ansShowTips: '',
            formulas: []
          }
        },
        allChatList: {}, // 所有的聊天记录
        convId: 0, // 左边
        ansId: 0, // 右边
        search: '',
        nextToChatList: [], // 后面用来加入chatList的操作
        receive: null,
        params: suzao.paramObj(),
        client: undefined,
        accept: 'image/jpeg,image/png',
        autocompleteClassName: '',

        compareList: JSON.parse(localStorage.getItem('compareList') || '[]'), // 对比
        compareMax: 5,
        replaceObj: [],
        replaceListActive: {},
        replaceList: []
      }
    },
    provide() {
      return {
        backBottom: this.backBottom,
        backBottom2: this.backBottom2,
        chatList: this.chatList,
        handleSearch: this.handleSearch,
        renderEnd: this.renderEnd,
        renderStart: this.renderStart,
        openShowCorrect: this.openShowCorrect,
        replaceFormList: this.replaceFormList,
        memberIndustry: this.memberIndustry,
        openBecomeDialog: this.openBecomeDialog,
        myRandom: this.myRandom,
        questionAgain: this.questionAgain,
        copyText: this.copyText,
        openReplaceDialog: this.openReplaceDialog,
        openList: this.openList
      }
    },
    created() {
      this.init()
    },
    mounted() {
      this.getByShare() // 获取广告
      this.initEventListener() // 事件委托
    },
    watch: {},
    computed: {},
    filters: {
      myRandom: this.myRandom,
      toIndex(arr, index) {
        return arr[index]
      }
    },
    methods: {
      // 事件委托
      initEventListener() {
        const chatContent = this.$refs.chatContent
        chatContent.addEventListener(
          'click',
          e => {
            const dom = e.target
            const classList = dom.classList
            const parentDom = dom.parentElement
            const parentClassList = parentDom.classList
            // 加入对比
            if (classList.contains('compareBtn') && dom.getAttribute('data-label')) {
              this.changeCompare(dom)
            }
            if (parentClassList.contains('compareBtn') && parentDom.getAttribute('data-label')) {
              this.changeCompare(parentDom)
            }
          },
          false
        )
      },
      // 加入/取消对比 改变dom 全部
      changeCompare(dom) {
        const label = dom.getAttribute('data-label')
        if (this.compareList.includes(label)) {
          this.compareList = this.compareList.filter(item => item !== label)
        } else {
          if (this.compareList.length < this.compareMax) {
            this.compareList.push(label)
          } else {
            this.$message.error('最多只能添加' + this.compareMax + '个对比')
            return false
          }
        }
        this.handleCompareState(dom)
      },
      // 删除对比
      removeCompare(idx) {
        const compareBtnDomAll = document.querySelectorAll('.chat-content .compareBtn')
        if (typeof idx !== 'undefined') {
          const removeCompare = this.compareList.splice(idx, 1)
          for (let i = 0; i < compareBtnDomAll.length; i++) {
            const dom = compareBtnDomAll[i]
            const label = dom.getAttribute('data-label')
            if (label === removeCompare[0]) {
              dom.classList.remove('active')
            }
          }
        } else {
          this.compareList = []
          for (let i = 0; i < compareBtnDomAll.length; i++) {
            const classList = compareBtnDomAll[i].classList
            // if (classList.contains('active')) {
            classList.remove('active')
            // }
          }
        }
      },
      // 取消/加入对比 根据dom 来改变所有dom状态
      handleCompareState(dom) {
        const label = dom.getAttribute('data-label')
        const isActive = dom.classList.contains('active')
        const compareBtnDomAll = document.querySelectorAll('.chat-content .compareBtn')
        for (let i = 0; i < compareBtnDomAll.length; i++) {
          const dom = compareBtnDomAll[i]
          const labelDom = dom.getAttribute('data-label')
          if (labelDom === label) {
            if (isActive) {
              dom.classList.remove('active')
            } else {
              dom.classList.add('active')
            }
          }
        }
      },
      // 看看有没有对比条件
      viewCompare() {
        if (this.compareList.length) {
          const compareBtnDomAll = document.querySelectorAll('.chat-content .compareBtn')
          for (let i = 0; i < compareBtnDomAll.length; i++) {
            const dom = compareBtnDomAll[i]
            const label = dom.getAttribute('data-label')
            if (this.compareList.includes(label)) {
              dom.classList.add('active')
            }
          }
        }
      },
      openBecomeDialog(item) {
        if (window.openSettledDialog) {
          window.openSettledDialog()
          return false
        }
      },
      goLogin() {
        if (window.openLoginDialog) {
          window.openLoginDialog()
          return
        }
        location.href = '/login?refer=' + location.pathname + encodeURIComponent(location.search)
      },
      init() {
        if (_SZ_HAS_LOGIN) {
          this.getMember()
          this.handleScrollLeft()
          this.getSTSToken()
          this.getSuggestSetting()
        }
        this.showCorrectForm = JSON.parse(JSON.stringify(this.initShowCorrectForm))
        try {
          // 获取推荐文本
          this.getAiHomeQueryList()
            .then(data => {
              this.viewLoading = false
              if (this.params.question) {
                // 看看有没有带问题过来
                // 如果有的话 直接问问题
                // 没有的话 正常去请求
                this.handleSearch({ key: this.params.question })
                // 搜索完 清空问题
                this.params.question = ''
                suzao.changeURLStatic(this.params, true)
              } else {
                data.forEach(item => {
                  if (item.type === 1) {
                    this.aiHomeQueryList.push(item.content)
                  } else if (item.type === 4) {
                    this.tipList.push(item.content)
                  } else if (item.type === 8) {
                    this.titleList.push(item.content)
                  } else if (item.type === 9) {
                    const colorArr = item.content.split('-')
                    if (colorArr.length === 2) {
                      this.colorString = ` background: linear-gradient(228deg,rgba(${colorArr[0]}) 0%, rgba(${colorArr[1]}) 100%)`
                    }
                  } else if (item.type === 11) {
                    this.btn = {
                      content: item.content,
                      url: item.url
                    }
                  }
                })
                this.initChatList() // 初始化新对话
              }
            })
            .catch(function (error) {
              console.error(error)
              this.viewLoading = false
            })
        } catch (error) {
          console.error(error)
          this.viewLoading = false
        }
      },
      // 获取oss设置信息
      getSTSToken() {
        var that = this
        return new Promise(function (resolve, reject) {
          $axios({
            url: '/core/STSToken/getSTSToken',
            method: 'get',
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            }
          })
            .then(function (res) {
              if (res.code === 101) {
                var config = {
                  bucket: 'suzaov2',
                  region: 'oss-cn-shenzhen',
                  accessKeyId: res.data.accessKeyId,
                  accessKeySecret: res.data.accessKeySecret,
                  stsToken: res.data.securityToken,
                  refreshSTSTokenInterval: 3600 * 1000
                }
                that.client = new OSS(config)
                resolve()
              } else {
                reject()
              }
            })
            .catch(function () {
              reject()
            })
        })
      },
      beforeUpload(file) {
        var that = this
        return new Promise(function (resolve, reject) {
          var typeOk = that.accept.includes(file.type)
          if (!typeOk) {
            this.$message.error('只能上传jpg/png文件')
            reject()
          }
          var isLt = file.size / 1024 / 1024 < 6
          if (!isLt) {
            this.$message.error('上传图片大小不能超过 6MB!')
            reject()
          }
          resolve()
        })
      },
      submitUpload(e) {
        const fileList = this.$refs.refUpload.uploadFiles
        this.uploadAndDownloadFile(fileList[fileList.length - 1].raw)
      },
      uploadAndDownloadFile(file) {
        // 上传文件到OSS，'object'是OSS中的文件名，'localfile'是本地文件的路径。
        var that = this
        if (!this.client) {
          this.getSTSToken()
        }

        this.client
          .put('suggestion/' + file.uid + file.name, file)
          .then(function (uploadResult) {
            that.showCorrectForm.imagesUrl = uploadResult.url
          })
          .then(function (getResult) {})
          .catch(function (error) {
            // console.error('发生错误:', error)
            // 在此处添加错误处理逻辑。
          })
      },
      removeFile(file, fileList) {
        this.showCorrectForm.imagesUrl = ''
      },
      // 获取用户信息
      getMember() {
        var that = this
        axios({
          url: '/member',
          method: 'get',
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
          .then(function (data) {
            if (data.status === 200) {
              var res = data.data
              if (res.need_login) {
                that.goLogin()
              }
              if (res.member) {
                res.member.company_logo && (that.info.company_logo = 'https://logo.bkt.17suzao.com/' + res.member.company_logo)
                if (!res.member.industry) {
                  that.getMemberIndustry()
                }
                if (that.info.name) {
                  that.info.name = res.member.name
                } else if (that.info.cellphone) {
                  that.info.name = that.hidePhone(that.info.cellphone)
                }
              }
            }
          })
          .catch(function (err) {})
      },
      // 隐藏中间4位
      hidePhone(phone) {
        const reg = /(\d{3})\d{4}(\d{4})/
        return String(phone).replace(reg, '$1****$2')
      },
      // 获取反馈文本
      getSuggestSetting() {
        var that = this
        $axios({
          url: '/core/dm/botAPI/getSuggestSetting',
          method: 'get'
        })
          .then(function (res) {
            if (res.code === 101) {
              res.data.forEach(function (item) {
                if (item.type === 2) {
                  that.suggestSettingText.radioList.push(item.content)
                } else if (item.type === 3) {
                  that.suggestSettingText.title.push(item.content)
                }
              })
            } else {
              that.$message.error(res.msg)
            }
          })
          .catch(function (err) {})
      },
      // 获取推荐文本
      getAiHomeQueryList() {
        return new Promise((resolve, reject) => {
          $axios({
            url: '/core/dm/botAPI/aiHomeQuery?num=12',
            method: 'get'
          })
            .then(res => {
              if (res.code === 101) {
                return resolve(res.data)
              } else {
                this.$message.error(res.msg)
                reject(res.msg)
              }
            })
            .catch(function (error) {
              reject(error)
            })
        })
      },
      // 获取行业
      getMemberIndustry() {
        var that = this
        if (this.memberIndustry.length) return
        axios({ url: '/vendor/getMemberIndustry' }).then(function (data) {
          if (data.data && data.data.status === 1) that.memberIndustry = data.data.data
        })
      },
      // s==广告
      requestData(id, num, key) {
        var params = {
          id: id,
          num: num || 1
        }

        if (this.byKyeIds.length) {
          params.byKyeIds = this.byKyeIds.join(',')
        }
        if (key) {
          // params.key = encodeURIComponent(key)
          params.key = key
        }
        $axios({
          url: '/core/adv2/getAdvertising?' + new URLSearchParams(params).toString(),
          method: 'get'
        }).then(function (data) {
          if (data.code === 101) {
            if (data.data.advertisingList.length) {
              app['byShare'] = data.data.advertisingList.map(function (item) {
                item.image = JSON.parse(item.image)
                item.video = JSON.parse(item.video)
                return item
              })
              app['byKyeIds'] = data.data.byKyeIds
            }
          } else {
            app.$message.error(data.msg)
          }
        })
      },
      toLink(item) {
        // 处理 link逻辑
        if (item.link) {
          return item.link + (item.link.includes('?') ? '&' : '?') + 'hash=' + item.hash
        } else if (item.has_content) {
          // link为空 has_cont为1
          return 'page/highlightV2?id=' + item.id
        } else {
          return ''
        }
      },
      getByShare(key) {
        var i = parseInt(parseInt(getComputedStyle(this.$refs.recommend).height, 10) / 230, 10)
        this.requestData(100008, i > 4 ? 4 : i, key)
      },
      // e===广告
      // 提交聊天内容
      submitChat(queryObj, queryType) {
        if (
          this.search.trim() === '' ||
          this.chatLoading ||
          this.nextToChatList.length ||
          (this.chatList.length && this.chatList[0].className === 'user text-message-content') ||
          this.receive
        )
          return
        const param = { key: this.search.trim() }
        if (queryType) {
          param.queryType = queryType
        } else if (queryObj.value && queryType === undefined) {
          param.queryType = 3
        }
        this.handleSearch(param)
        this.search = ''
        this.autocompleteClassName = 'popperClassName'
        this.$nextTick(this.backBottom2)
      },
      handleSearch(obj) {
        if (!_SZ_HAS_LOGIN) {
          this.goLogin()
          return
        }
        // 1.当前chatList没有执行完 2.最近的chatList为提问 3.还有接下来的chatList
        if (
          this.chatLoading ||
          this.nextToChatList.length ||
          (this.chatList.length && this.chatList[0].className === 'user text-message-content') ||
          this.receive
        ) {
          console.error('错误')
          return
        }

        this.chatList.unshift(this.questionToComponentItem(obj))
        this.getEventSource(obj.key, obj.queryType, obj.uuid)
      },
      // 聊天联想
      querySearch(queryString, cb) {
        var that = this
        // 调用 callback 返回建议列表的数据
        if (that.search === '') return cb([])
        $axios({
          url: '/core/dm/botAPI/getSearchSuggest',
          method: 'get',
          params: {
            queryKey: queryString
          }
        })
          .then(function (res) {
            if (res.code === 101) {
              if (res.data && res.data.length) {
                var data = res.data.map(function (item) {
                  return {
                    value: item
                  }
                })
                if (that.search) {
                  that.autocompleteClassName = ''
                  return cb(data)
                }
              }
            } else {
              that.$message.error(res.msg)
            }
            return cb([])
          })
          .catch(() => {
            return cb([])
          })
      },
      // s==ai记录
      // 左边
      handleScrollLeft() {
        if (!this.aiTotalEndLeft) this.getAiHistoryLeft()
      },
      // 滚动加载更多记录 右边
      handleScroll(e) {
        var chatContent = this.$refs.chatContent
        if (chatContent.scrollTop === 0 && !this.aiTotalLoading && !this.aiTotalEnd) {
          // 滚动到顶部且不在加载中时触发加载更多记录
          this.getScrollHeight(this.$refs.chatContent)
          this.getAiHistory(this.restoreScrollPosition, false)
        }
        this.isFloor = chatContent.scrollHeight - chatContent.scrollTop - 30 < chatContent.clientHeight
      },
      getScrollHeight(dom) {
        this.scrollHeight = dom.scrollHeight
      },
      restoreScrollPosition(data, reset) {
        //  页面+1
        this.jsonToHtmlString(data, reset)
        // 保持滚动位置不变
        this.$nextTick(function () {
          var chatContent = app.$refs.chatContent
          chatContent.scrollTop = chatContent.scrollHeight - app.scrollHeight
        })
      },
      jsonToHtmlString(data, reset) {
        if (data.dataList.length === 0) {
          this.initChatList(this.convId)
          return
        }
        if (reset) this.chatList = []
        // this.aiTotalEnd = data.totalEnd
        this.$nextTick(() => {
          // 这里历史记录展示
          data.dataList.forEach(this.classification)
        })
      },
      // 处理列表数据
      classification(item) {
        const process = []
        // 反馈记录
        const flowResult = []
        // 其他 比如说
        // ['commodity']
        const other = []
        const answerType = item.answerType && item.answerType.trim()
        const type = item.contentType // 类型
        const ansId = item.ansId
        const convId = item.convId
        // const createAt = item.createAt
        const isDiss = item.isDiss
        const isLike = item.isLike
        const queryContent = item.queryContent // queryContent // 问题
        let contain = item.answerContent // answerContent // 回答
        let llmContent = item.llmContent // llm // 回答
        const TYPE_LIST = 'list'
        const TYPE_TEXT = 'text'
        const RESULT_COMPARE = 'COMPARE'
        const REPLACE = 'REPLACE02'
        const FORMULA = 'FORMULA'

        try {
          contain = JSON.parse(item.answerContent)
        } catch (error) {
          console.error(error)
        }

        if (contain.extraData && typeof contain.extraData === 'object') {
          if (answerType === REPLACE) {
            this.setReplaceCompare(contain.extraData, contain.ansLines, contain.total)
            // 替代对比
            other.push(
              this.jsonToComponentItem('replaceCompare', {
                ansId: ansId,
                convId: ansId,
                queryContent: queryContent,
                answerType: contain.answerType && contain.answerType.trim(),
                ansResultType: contain.ansResultType && contain.ansResultType.trim(),
                ...contain.extraData
              })
            )
          } else if (answerType === FORMULA) {
            process.unshift(
              this.jsonToComponentItem('formula', {
                ansId: ansId,
                convId: ansId,
                ansShowType: contain.ansShowType,
                ansShowTips: contain.ansShowTips,
                ansResultType: contain.ansResultType && contain.ansResultType.trim(),
                ...contain.extraData
              })
            )
          }
        }

        let length = 0
        if (contain.ansLines) {
          length = contain.ansLines.length
        } else if (contain.enterpriseInfoList) {
          length = contain.enterpriseInfoList.length
        }
        const feedback = {
          ansId: ansId,
          convId: ansId,
          answerType: contain.answerType && contain.answerType.trim(),
          ansResultType: contain.ansResultType && contain.ansResultType.trim(),
          queryContent: queryContent,
          total: contain.total,
          length: length,
          isDiss: isDiss,
          isLike: isLike
        }

        if (contain.ansResultType === REPLACE && contain.extraData && contain.extraData['uuid']) {
          feedback['uuid'] = contain.extraData['uuid']
        }
        // 记录反馈
        flowResult.push(this.jsonToComponentItem('feedback', feedback))

        if (llmContent) {
          const llm = this.decodeSpaces(item.llmContent)
          llmContent = this.jsonToComponentItem('display', {
            htmlString: marked(llm),
            ansId: ansId,
            convId: convId
          }) // 回答
          process.push(llmContent)
        }

        let answerArr = []
        if (type === TYPE_LIST || (type === TYPE_TEXT && contain.ansResultType === RESULT_COMPARE)) {
          answerArr = this.listToComponentItem(contain)
        }

        if (Array.isArray(answerArr)) {
          // 多个需要去查看 是否有特殊数据
          if (answerArr.length >= 2) {
            const answer = []
            answerArr.map(item => {
              const newItem = {
                ...item
              }
              if (['commodity'].includes(item.type)) {
                newItem.className += ' overflow-x'
                other.push(newItem)
              } else {
                answer.push(newItem)
              }
            })
            process.unshift(...answer)
          } else {
            process.unshift(...answerArr)
          }
        }

        const question = this.questionToComponentItem({ key: queryContent, ansId: ansId, convId: convId }) // 提问

        const chatList = []
        if (other.length) {
          chatList.push(...other)
        }
        if (flowResult.length) {
          chatList.push(...flowResult.slice(-1))
        }
        if (process.length) {
          chatList.push(...process)
        }
        // 问题
        chatList.push(question)
        this.chatList.push(...chatList)
        this.renderEnd()
      },
      // 获取历史记录
      getAiHistory(callBack, reset) {
        var that = this
        return new Promise(function (resolve, reject) {
          if (!that.convId) {
            resolve()
          }
          // 请求用户聊天记录
          // 页数 一页多少条
          var data = { convId: that.convId }
          for (var key in that.aiHistory) {
            if (that.aiHistory[key] !== '') {
              data[key] = that.aiHistory[key]
            }
          }
          that.aiTotalLoading = true
          $axios({
            url: '/core/dm/botAPI/getLogByPage',
            method: 'get',
            params: data
          })
            .then(function (res) {
              that.aiTotalLoading = false
              if (res.code === 101) {
                that.aiHistory.pageNum++
                var questionLength = that.chatList.filter(function (item) {
                  return item.className === 'user text-message-content'
                })
                that.aiTotalEnd = res.data.total <= questionLength.length + res.data.dataList.length
                if (callBack && typeof callBack === 'function') {
                  callBack(res.data, reset)
                }
                resolve()
              } else {
                that.$message.error(res.msg)
                reject()
              }
            })
            .catch(function (error) {
              that.aiTotalLoading = false
              that.$message.error(error.message)
              reject()
            })
        })
      },
      getAiHistoryLeft() {
        this.aiTotalLoadingLeft = true
        var that = this
        var data = {}
        for (var key in this.aiHistoryLeft) {
          if (this.aiHistoryLeft[key] !== '') {
            data[key] = this.aiHistoryLeft[key]
          }
        }
        $axios({
          url: '/core/dm/botAPI/getConvByPage',
          method: 'get',
          params: data
        })
          .then(function (res) {
            that.aiTotalLoadingLeft = false
            that.aiHistoryLeft.pageNum++
            if (res.code === 101) {
              res.data.dataList.forEach(function (item) {
                that.recordList.push(item)
              })
              if (that.recordList.length === res.data.total) {
                that.aiTotalEndLeft = true
              }
            } else {
              that.$message.error(res.msg)
            }
          })
          .catch(function (error) {
            that.$message.error(error.message)
          })
      },
      // e==ai记录
      // 聊天滚动到底 有限制
      backBottom() {
        this.isFloor && this.$refs.chatContent && (this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight)
      },
      // 聊天滚动到底 无限制
      backBottom2() {
        // this.$refs.chatContent && (this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight)
        if (this.$refs.chatContent) {
          this.$refs.chatContent.scrollTo({ top: this.$refs.chatContent.scrollHeight + 200, behavior: 'smooth' })
        }
      },
      // s==聊天
      // 请求数据 sse
      getEventSource(text, queryType, uuid) {
        const that = this

        // 开启聊天提示
        const param =
          '?key=' +
          encodeURIComponent(text) +
          (this.convId ? '&convId=' + this.convId : '') +
          (typeof queryType === 'number' ? '&queryType=' + queryType : '') +
          (uuid ? '&uuid=' + uuid : '')
        this.transitionLoading = true
        this.ansId = 0
        this.eventSource = new EventSource('/core/dm/botAPI/v2' + param)

        // 结果流程记录
        // 1.llm需要直接开始，其他的等llm结束后再出
        // 2.没有llm，结束直接全出
        const process = []
        // 反馈记录
        const flowResult = []
        // 推荐
        const recommend = []
        // 其他 比如说
        // ['commodity']
        const other = []
        // 表单记录
        let isSupplement = false
        // list事件处理
        const update_list = e => {
          // that.getByShare(text)
          const data = JSON.parse(e.data)

          // 是否有新的对话记录
          this.addRecordList(data)

          // 给问题赋值ID标识
          this.chatList.filter(item => {
            if (item.convId === '' || item.ansId === '') {
              item.convId = data.convId
              item.ansId = data.ansId
              return item
            }
          })

          // 记录表单
          if (data.supplement && !isSupplement) {
            this.addSupplement(data.supplement)
            isSupplement = true
          }

          // 存入流程
          const answerArr = this.listToComponentItem(data)
          if (Array.isArray(answerArr)) {
            // 多个需要去查看 是否有特殊数据
            if (answerArr.length >= 2) {
              const answer = []
              answerArr.map(item => {
                const newItem = {
                  ...item
                }
                if (['commodity'].includes(item.type)) {
                  newItem.className += ' overflow-x'
                  other.push(newItem)
                } else {
                  answer.push(newItem)
                }
              })
              process.push(...answer)
            } else {
              process.push(...answerArr)
            }
          }
          let length = 0
          if (data.ansLines) {
            length = data.ansLines.length
          } else if (data.enterpriseInfoList) {
            length = data.enterpriseInfoList.length
          }
          // 记录反馈
          flowResult.push(
            this.jsonToComponentItem('feedback', {
              ansId: data.ansId,
              convId: data.convId,
              answerType: data.answerType && data.answerType.trim(),
              ansResultType: data.ansResultType && data.ansResultType.trim(),
              queryContent: text,
              total: data.total,
              length: length,
              uuid: uuid
            })
          )

          const REPLACE = 'REPLACE02'
          const FORMULA = 'FORMULA'
          const ansResultType = data.ansResultType && data.ansResultType.trim()
          if (data.extraData && typeof data.extraData === 'object') {
            if (ansResultType === REPLACE) {
              this.setReplaceCompare(data.extraData, data.ansLines, data.total)
              // 替代对比
              other.push(
                this.jsonToComponentItem('replaceCompare', {
                  ansId: data.ansId,
                  convId: data.convId,
                  answerType: data.answerType && data.answerType.trim(),
                  ansResultType: ansResultType,
                  ...data.extraData
                })
              )
            } else if (ansResultType === FORMULA) {
              process.push(
                this.jsonToComponentItem('formula', {
                  ansId: data.ansId,
                  convId: data.convId,
                  ansShowType: data.ansShowType,
                  ansShowTips: data.ansShowTips,
                  ansResultType: ansResultType,
                  ...data.extraData
                })
              )
            }
          }
        }

        // 大模型
        let receive = false // llm开始接收
        let result = '' // llm先接收到result 然后再开始分发给chatList
        let htmlString = '' // 渲染时的字符串
        let i = 1 // result对应序号

        // 打印字符串
        const updated = (i, time) => {
          if (that.receive !== null) {
            let startTime = null
            const frame = timestamp => {
              if (!startTime) startTime = timestamp
              const progress = timestamp - startTime

              if (progress > time && i <= result.length) {
                // 判断有没有未完成的代码块
                htmlString += result.slice(i - 1, i)
                // let end = countBackticks(htmlString)
                that.chatList[0].htmlString = marked(htmlString)
                i++
                setTimeout(that.backBottom, 300)
                startTime = timestamp
              }

              if (receive || i <= result.length) {
                that.receive = requestAnimationFrame(frame)
              } else {
                that.receive = null
                if (that.nextToChatList.length) {
                  that.renderEnd()
                }
              }
            }

            that.receive = requestAnimationFrame(frame)
          }
        }

        // 异常事件处理
        const update_error = e => {
          console.error(e)
          this.transitionLoading = false
          if (this.receive || result) {
            receive = false
            window.cancelAnimationFrame(this.receive)
          } else {
            try {
              const data = JSON.parse(e.data)
              if (data && data.code === 5007) {
                // 充值
                this.$message({
                  type: 'error',
                  message: data.msg,
                  customClass: 'z-index-max'
                })
                window.openMemberInterest()
                var obj = Object.assign({}, this.typeList['llm'], {
                  htmlString: '<p class="text open-member-interest">' + (data.msg || CHAT_TEXT.error) + '</p>',
                  ansId: this.ansId,
                  convId: this.convId
                })
                this.chatList.unshift(obj)
              }
            } catch (error) {
              var obj = Object.assign({}, this.typeList['llm'], {
                htmlString: '<p class="text">' + (e.data || CHAT_TEXT.error) + '</p>',
                ansId: this.ansId,
                convId: this.convId
              })
              this.chatList.unshift(obj)
            }
          }
          this.eventSource.close()
        }
        // 推荐事件处理
        const update_recommend = e => {
          recommend.push(e.data)
        }

        const end_llm = e => {
          const nextToChatList = []
          if (process.length) {
            // process 判断有没有commodity
            nextToChatList.push(...process)
          }
          if (flowResult.length) {
            nextToChatList.push(...flowResult.slice(-1))
          }

          if (recommend.length) {
            const recommendObj = this.jsonToComponentItem('recommend', {
              text: suzao.deepClone(recommend),
              tip: CHAT_TEXT.recommend,
              ansId: this.ansId,
              convId: this.convId
            })
            nextToChatList.push(recommendObj)
          }

          if (other.length) {
            nextToChatList.push(...other)
          }

          if (receive) receive = false
          // 表单
          if (isSupplement) {
            // 有llm
            if (result) {
              nextToChatList.unshift(
                this.jsonToComponentItem('display', {
                  ansResultType: 'LLM',
                  answerType: 'text',
                  htmlString: marked(result),
                  ansId: this.ansId,
                  convId: this.convId
                })
              )
              // 没有反馈，就加入llm反馈
              if (!flowResult.length) {
                nextToChatList.push(
                  this.jsonToComponentItem('feedback', { ansResultType: 'LLM', answerType: 'text', ansId: this.ansId, convId: this.convId })
                )
              }
            }
            // this.setFormJsonToList(nextToChatList.reverse())
            if (this.receive) {
              this.closeChat()
            }
          } else {
            this.nextToChatList.push(...nextToChatList)
          }

          this.transitionLoading = false
          this.eventSource.close()
          if (!this.receive) {
            this.renderEnd()
          }
        }
        // 事件监控
        this.eventSource.addEventListener('ES', update_list) // 通用
        this.eventSource.addEventListener('NL2SQL', update_list) // 通用
        this.eventSource.addEventListener('FUZZY_QUERY', update_list) // 通用
        this.eventSource.addEventListener('ENTERPRISE', update_list) // 商家
        this.eventSource.addEventListener('COMPARE', update_list) // 对比
        this.eventSource.addEventListener('BRL', update_list) // 对比
        this.eventSource.addEventListener('COMMODITY', update_list) // 测试仪
        this.eventSource.addEventListener('REPLACE01', update_list) // 替代牌号
        this.eventSource.addEventListener('REPLACE02', update_list) // 替代牌号
        this.eventSource.addEventListener('FORMULA', update_list) // 配方

        this.eventSource.addEventListener('satisfactionSurvey', e => {
          // const data = JSON.parse(e.data)
        }) // 满意度 pc不做

        // 报错
        this.eventSource.addEventListener('SYSTEM_ERROR', update_error)
        this.eventSource.addEventListener('error', update_error)
        this.eventSource.addEventListener('103', e => {
          update_error(e)
          this.goLogin()
        })
        // 推荐
        this.eventSource.addEventListener('RECOMMEND', update_recommend)
        // 标识符 右
        this.eventSource.addEventListener('ansId', e => {
          this.ansId = Number(e.data)
          this.chatList.filter(item => {
            if (item.ansId === '') {
              item.ansId = this.ansId
              return item
            }
          })
        })

        // 标识符 左
        this.eventSource.addEventListener('convId', e => {
          this.addRecordList({ convId: Number(e.data) })
          this.chatList.filter(item => {
            if (item.convId === '') {
              item.convId = this.convId
              return item
            }
          })
        })

        // 表单
        this.eventSource.addEventListener('supplement', e => {
          if (!isSupplement) {
            this.addSupplement(e.data)
            isSupplement = true
          }
        })

        // llm
        this.eventSource.addEventListener('LLM', e => {
          if (result === '' && !receive) {
            // 这里判断是否有form
            if (!isSupplement) {
              receive = true // 开始接收数据
              this.transitionLoading = false // 关闭聊天等待
              this.chatList.unshift(
                this.jsonToComponentItem('display', {
                  ansResultType: 'LLM',
                  ansShowType: 'text',
                  htmlString: '',
                  ansId: this.ansId,
                  convId: this.convId
                  // transitionLoading: true
                })
              ) // 先把bot的消息放进去

              // 反馈
              flowResult.push(
                this.jsonToComponentItem('feedback', {
                  ansResultType: 'LLM',
                  answerType: 'text',
                  ansId: this.ansId,
                  convId: this.convId
                })
              )

              this.receive = 0
              updated(i, 16)
            } else {
              end_llm()
            }
          }
          result += e.data
          result = this.decodeSpaces(result)
        })

        // 结束
        this.eventSource.addEventListener('end', end_llm)
      },
      // 表单信息
      addSupplement(data) {
        const obj = {
          ansId: data.ansId,
          convId: data.convId
        }
        // 1：行业信息，2：公司名称
        var supplement = data.split(',')
        if (supplement.includes('1')) {
          obj.industry = true
        }
        if (supplement.includes('2')) {
          obj.company = true
        }
        if (supplement.includes('3')) {
          obj.name = true
        }
        const form = this.jsonToComponentItem('form', obj)
        // this.setFormJsonList(form)
        this.nextToChatList.push(form)
      },
      // 关闭sse
      closeEventSource() {
        if (this.eventSource) this.eventSource.close()
        this.chatLoading = false
      },
      // 关闭聊天
      closeChat() {
        this.closeEventSource()
        if (this.transitionLoading) {
          // 没有出来值 这里插入已暂停
          this.nextToChatList.push(this.jsonToComponentItem('display', { htmlString: '已停止回答', ansId: this.ansId, convId: this.convId }))
          this.nextToChatList.push(this.jsonToComponentItem('feedback', { ansId: this.ansId, convId: this.convId }))
        } else if (this.receive) {
          // this.chatList[0].transitionLoading = false
          // rafInstance.clearTimeout(this.receive)
          if (this.nextToChatList.length === 0) {
            this.nextToChatList.push(
              this.jsonToComponentItem('feedback', { ansResultType: 'LLM', answerType: 'text', ansId: this.ansId, convId: this.convId })
            )
          }
          window.cancelAnimationFrame(this.receive)
          this.receive = null
        }
        this.transitionLoading = false
        this.nextTickChatList()
      },
      // e==聊天
      // s== 聊天类型操作
      // 初始化chatList
      initChatList(convId) {
        // 新增对话
        this.chatList = []
        this.viewLoading = false
        this.aiTotalEnd = true
        this.ansId = ''
        this.convId = convId || ''
        this.isFloor = true
        var initObj = this.jsonToComponentItem('init', {
          colorString: this.colorString,
          titleTip: this.myRandom(this.titleList, 1),
          title: this.myRandom(this.tipList, 1),
          text: suzao.deepClone(this.aiHomeQueryList),
          tip: CHAT_TEXT.recommend,
          btn: this.btn
        })
        this.nextToChatList.push(initObj)
        this.nextTickChatList()
      },
      // 新增左边聊天
      addRecordList(data) {
        if (this.convId === '') {
          var question = this.chatList.find(function (item) {
            if (item.className === 'user text-message-content') return true
          })
          this.convId = data.convId
          // 如果为空 则新增记录
          this.recordList.unshift({
            convTitle: this.stripHtmlTags(question.htmlString),
            convId: data.convId
          })
        }
      },
      // 从arr数组中，随机获取length个值
      myRandom(arr, length) {
        var newArr = [] // 组成的新数组初始化
        var oldArr = JSON.parse(JSON.stringify(arr))
        for (var i = 0; i < length; i++) {
          var index = Math.floor(Math.random() * oldArr.length)
          var item = oldArr[index]
          newArr.push(item)
          oldArr.splice(index, 1)
        }
        if (length === 1) return newArr[0]
        return newArr
      },
      // 使用正则表达式去除HTML标签
      stripHtmlTags(string) {
        return string.replace(/<[^>]*>/g, '')
      },
      decodeSpaces(str) {
        try {
          return str.replace(/&lt;br&gt;/g, '\t\n\t\n').replace(/&nbsp;/g, ' ')
        } catch (error) {
          return str
        }
      },
      // list转换组件
      listToComponentItem(data) {
        const that = this
        const ansResultType = data.ansResultType
        const ansLines = data.ansLines
        const enterpriseInfoList = data.enterpriseInfoList
        const compareInfo = data.compareInfo
        const commodityVOList = data.commodityVOList
        const recommendedSmallBusiness = suzao.arrayToObjectByKey(data.recommendedSmallBusiness, 'uuid')
        const arr = []
        if (ansLines) {
          const componentParams = {}
          if (['REPLACE01'].includes(ansResultType)) {
            Object.entries(this.typeList['replace']).forEach(([key, value]) => {
              if (key === 'ansLines') {
                componentParams[key] = ansLines
              } else {
                componentParams[key] = data[key] ? data[key] : value
              }
            })
          } else {
            // 物性表
            Object.entries(this.typeList['display']).forEach(([key, value]) => {
              if (key === 'htmlString') {
                componentParams.htmlString = that.listToHtml(ansLines, data.ansShowTips || CHAT_TEXT.list, recommendedSmallBusiness)
              } else {
                componentParams[key] = data[key] ? data[key] : value
              }
            })
          }

          arr.push(componentParams)
        }
        if (enterpriseInfoList) {
          const componentParams = {}
          // 制造商
          Object.entries(this.typeList['business']).forEach(function (item) {
            var key = item[0],
              value = item[1]
            if (key === 'list') {
              componentParams[key] = enterpriseInfoList.map(function (it) {
                return it
              })
            } else {
              componentParams[key] = data[key] ? data[key] : value
            }
          })
          arr.push(componentParams)
        }
        if (compareInfo) {
          const componentParams = {}
          // 对比
          Object.entries(this.typeList['compare']).forEach(function (item) {
            var key = item[0],
              value = item[1]
            if (key === 'code') {
              componentParams[key] = compareInfo.code
            } else if (key === 'spInfoList') {
              componentParams[key] = compareInfo.spInfoList.join(',')
            } else {
              componentParams[key] = data[key] ? data[key] : value
            }
          })
          arr.push(componentParams)
        }
        if (commodityVOList) {
          const componentParams = {}
          Object.entries(this.typeList['commodity']).forEach(function (item) {
            var key = item[0],
              value = item[1]
            componentParams[key] = data[key] ? data[key] : value
          })
          arr.push(componentParams)
        }
        return arr
      },
      // json转html格式转换
      listToHtml(data, title, recommendedSmallBusiness) {
        if (!Array.isArray(data)) {
          return ''
        }
        let htmlString = '<div class="tip">' + title + '</div>'
        data.find((item, index) => {
          const compareObj = { uuid: item.lineUuId, dataPlasticId: item.pBaseId }
          if (item.firstItemLine && item.firstItemLine.length > 0) {
            htmlString += '<a href="/plastic/detail?id=' + item.lineUuId + '" target="_blank" class="title">'
            item.firstItemLine.forEach(function (it) {
              if (it.itemValue) {
                compareObj[it.itemLabel] = it.itemValue
                // suzao.escapeHtml()
                htmlString += it.itemValue
              }
            })
            htmlString += '</a>'
          }
          if (item.secondItemLine && item.secondItemLine.length > 0) {
            htmlString += '<div class="details">'
            item.secondItemLine.forEach(function (it) {
              if (it.itemValue) htmlString += suzao.escapeHtml(it.itemValue)
            })
            htmlString += '</div>'
          }
          if (item.thirdItemLine && item.thirdItemLine.length > 0) {
            htmlString += '<div class="info">'
            let showUnit = false
            item.thirdItemLine.forEach(function (it) {
              if (it.itemValue) {
                let start = ''
                let value = suzao.escapeHtml(it.itemValue)
                let end = ''
                if (it.itemClass === '\n') {
                  end = ' \n'
                }
                if (showUnit) {
                  start += '\n'
                }
                if (it.itemLabel === 'unit_price' && value === '价格询购') {
                  showUnit = true
                }
                if (it.itemLabel === 'cellphone') {
                  compareObj[it.itemLabel] = suzao.formatPhone(value)
                }
                if (['market_id', 'cellphone'].includes(it.itemLabel) || (showUnit && it.itemLabel === 'unit')) {
                  value = ''
                }
                if (showUnit && it.itemLabel === 'unit') {
                  showUnit = false
                }

                htmlString += start + value + end
              }
            })
            htmlString += '</div>'
          }
          let recommendedSmallBusinessStr = ''
          if (recommendedSmallBusiness[item.lineUuId]) {
            recommendedSmallBusiness[item.lineUuId].find(it => {
              if (it.uuid === item.lineUuId) {
                return (compareObj['enterpriseId'] = it.enterpriseId)
              }
            })
            recommendedSmallBusinessStr = this.recommendedSmallBusinessHtml(recommendedSmallBusiness, item) // 商家列表
          }
          const compareStr = this.compareHTML(compareObj) // 物性对比
          const cellphoneStr = this.cellphoneHTML(compareObj) // 电话

          const feedbackHTML = '<div class="feedback">' + cellphoneStr + compareStr + recommendedSmallBusinessStr + '</div>'
          htmlString += feedbackHTML
        })
        htmlString += '</div>'
        return htmlString
      },
      compareHTML(obj) {
        if (!obj['uuid']) return ''
        const label = `${obj['uuid']}|${obj['sp_name']} ${obj['p_base_gradeno']}`
        let className = ''
        if (this.compareList.length && this.compareList.includes(label)) {
          className = 'active'
        }
        return `<span class="compareBtn ${className}" data-label="${label}">
          <span class="join">物性对比</span>
          <span class="cancel">取消对比</span>
        </span>`
      },
      cellphoneHTML(obj) {
        if (!obj['cellphone']) return ''
        const cellphone = suzao.formatPhone(obj['cellphone'])
        const uuid = obj['uuid']
        const dataPlasticId = obj['dataPlasticId']
        const enterpriseId = obj['enterpriseId']
        return `<span class="formatPhone smallBusinessObserver" 
                  data-sensors-click
                  data-plastic-id="${dataPlasticId}"
                  data-enterprise-id="${enterpriseId}"
                  data-id="${uuid}"
                  data-phone="${cellphone}">
                  <i class="iconfont icon-icon_dianhua"></i>查看电话
                </span>`
      },
      priceHTML(obj) {
        let html = ''
        if (obj.rmb) {
          html += `<strong>含税CNY ${obj.rmb}/吨</strong>`
        }
        if (obj.usd) {
          html += `<strong>USD ${obj.usd}/吨</strong>`
        }
        if (!(obj.rmb || obj.usd)) {
          html += `<strong>价格询购</strong>`
        }
        return html
      },
      companyHTML(obj) {
        if (!obj['companyname']) return ''
        if (obj['type']) return `<span>${obj['type']}: </span>${obj['companyname']}`
        return `${obj['companyname']}`
      },
      recommendedSmallBusinessHtml(recommendedSmallBusiness, propItem) {
        let contBox = ''
        const lineUuId = propItem['lineUuId']
        const dataPlasticId = propItem['pBaseId']
        for (let index = 0; index < recommendedSmallBusiness[lineUuId].length; index++) {
          const item = recommendedSmallBusiness[lineUuId][index]
          const priceStr = this.priceHTML(item)
          const companyStr = this.companyHTML(item)
          const cellphoneStr = this.cellphoneHTML({ ...item, dataPlasticId: dataPlasticId })
          contBox += `<div class="li">
            <div class="left">
              <div class="price">${priceStr}</div>
              <div class="company">${companyStr}</div>
            </div>
            <div class="right">
              <div class="others">${cellphoneStr}</div>
            </div>
          </div>`
        }
        return `<span class="recommendedSmallBusinessBtn">
         <div class="box"><img src="/static/ai/icon-company.png" alt=""> <span class="red">${recommendedSmallBusiness[lineUuId].length}</span>个商家 <i class="el-icon-arrow-right"></i></div>
         <div class="cont-box">${contBox}</div>
        </span>`
      },
      // 提问 特殊处理
      questionToComponentItem(obj) {
        const newObj = this.jsonToComponentItem('question', obj || {})
        newObj.htmlString = '<p class="text">' + newObj.key + '</p>'
        return newObj
      },
      // 通用方法
      jsonToComponentItem(type, obj) {
        return Object.assign({}, this.typeList[type], obj || {})
      },
      // e== 聊天类型操作
      // s==纠错弹窗提交
      openShowCorrect(ansId) {
        var that = this
        this.showCorrectVisible = true
        if (ansId) {
          this.showCorrectRules = {}
          this.showCorrectForm.ansId = ansId
        } else {
          this.showCorrectRules = this.initShowCorrectRules
        }
        this.$nextTick(function () {
          that.$refs.showCorrectForm && that.$refs.showCorrectForm.clearValidate()
        })
      },
      showCorrectOnSubmit() {
        var that = this
        this.$refs.showCorrectForm.validate(function (valid) {
          if (!valid) return
          var data = {}
          Object.entries(that.showCorrectForm).forEach(function (item) {
            var key = item[0]
            var value = item[1]
            if (key === 'suggestType') {
              if (value.length) data[key] = value.join(',')
            } else if (value) {
              data[key] = value
            }
          })

          $axios({ url: '/core/dm/botAPI/likeOrDis', method: 'post', data: data })
            .then(function (res) {
              if (res.code === 101) {
                that.$message({
                  type: 'success',
                  message: '感谢你的反馈'
                })
                that.showCorrectVisible = false
                if (that.showCorrectForm.ansId) {
                  that.chatList.find(function (item) {
                    if (item.ansId === that.showCorrectForm.ansId && item.type === 'feedback') {
                      item.isDiss = true
                      item.isLike = false
                      return true
                    }
                  })
                }
                that.showCorrectForm = JSON.parse(JSON.stringify(that.initShowCorrectForm))
              } else {
                that.$message.error(res.msg)
              }
            })
            .catch(function (error) {
              that.$message.error(error.message)
            })
        })
      },
      closeFeedbackDialog() {
        if (this.showCorrectForm.ansId) {
          this.showCorrectOnSubmit()
        } else {
          this.showCorrectForm = JSON.parse(JSON.stringify(this.initShowCorrectForm))
        }
      },
      // 切换聊天记录窗口 右边
      tabChatContent(convId) {
        var that = this
        if (convId === this.convId) {
          return
        }

        this.viewLoading = true
        this.closeChat()

        // 记录改列表的历史记录及相关
        this.allChatList[this.convId] = {
          chatList: suzao.deepClone(this.chatList),
          aiHistory: suzao.deepClone(this.aiHistory),
          aiTotalEnd: this.aiTotalEnd,
          aiTotalLength: this.aiTotalLength
        }

        if (convId) {
          this.recordConvId(convId)
          if (this.allChatList[convId]) {
            // 还原
            var data = suzao.deepClone(this.allChatList[convId])
            this.chatList = data.chatList
            this.aiHistory = data.aiHistory
            this.aiTotalEnd = data.aiTotalEnd
            this.aiTotalLength = data.aiTotalLength

            that.viewLoading = false
            that.$nextTick(() => {
              that.backBottom2()
              suzao.observer.call(suzao, 2)
            })
          } else {
            // 没有记录清零
            this.aiHistory.pageNum = 1
            this.aiTotalEnd = false
            this.aiTotalLength = 0
            // 切换记录
            this.getAiHistory(this.jsonToHtmlString, true).then(() => {
              that.viewLoading = false
              that.$nextTick(() => {
                that.backBottom2()
                suzao.observer.call(suzao, 2)
              })
            })
          }
          // 切换到最底部
        } else {
          // 新增对话
          this.initChatList()
        }
        setTimeout(this.viewCompare)
      },
      // 删除聊天记录列表
      removeConvId(convId, index) {
        var that = this
        var formData = new FormData()
        if (convId) {
          formData.append('convId', convId)
        }
        $axios({ url: '/core/dm/botAPI/removeConvId', method: 'post', data: formData })
          .then(function (res) {
            if (res.code === 101) {
              that.$message({
                type: 'success',
                message: '删除成功'
              })
              if (index !== undefined) {
                // 有index 是某一个
                that.recordList.splice(index, 1)
                if (convId === that.convId) {
                  // 是不是当前 1.不是，不作为 2.如果是，新开聊天页面
                  that.initChatList()
                }
              } else {
                if (convId === undefined) {
                  // 没有convId和index 删除全部
                  that.recordList = []
                  that.initChatList()
                }
              }
            } else {
              that.$message({
                type: 'error',
                message: '删除失败'
              })
            }
          })
          .catch(function (error) {
            that.$message.error(error.message)
          })
      },
      // 记录操作锚点
      recordConvId(convId) {
        // 左边
        this.convId = convId
      },
      recordAnsId(ansId) {
        // 右边
        this.ansId = ansId
      },
      // 开始渲染
      renderStart() {
        this.chatLoading = true
      },
      // 结束渲染
      renderEnd() {
        this.chatLoading = false
        this.nextTickChatList()
      },
      nextTickChatList() {
        // 开始下一个操作
        if (this.nextToChatList.length) {
          var flag = this.nextToChatList.shift()
          // 定义一个规则，如果有的话，只取出，不执行
          if (flag) this.chatList.unshift(flag)
        }
      },
      // 将表单替换成答案
      replaceFormList() {
        // 清空allChatList
        var that = this
        this.allChatList = {}
        this.aiHistory.pageNum = 1
        this.aiTotalEnd = false
        this.getAiHistory(this.jsonToHtmlString, true).then(function () {
          that.$nextTick(that.backBottom2)
        })
      },
      // 重试
      questionAgain(ansId, conId) {
        let queryContent = ''
        const arr = this.chatList.filter(function (it) {
          return it.ansId === ansId && it.conId === conId
        })
        if (arr.at(-1).key) {
          queryContent = arr.at(-1).key
        }
        if (arr.length && queryContent) {
          this.chatList.splice(0, arr.length)

          setTimeout(() => {
            this.handleSearch({ key: queryContent, queryType: 0 })
          })
        }
      },
      // 复制
      copyText(item) {
        // const arr = this.chatList.filter(function (it) {
        //   return it.ansId === item.ansId && it.conId === item.conId
        // })
      },
      // 展开更多
      openList(ansId, conId) {
        const obj = this.chatList.find(it => {
          return it.ansId === ansId && it.conId === conId && it.ansResultType === 'REPLACE01' && it.ansShowType === 'list'
        })
        if (obj) obj.foldingState = !obj.foldingState
      },
      closeReplaceDialog() {
        this.replaceListActive = {}
        this.replaceList = []
      },
      openReplaceDialog(item) {
        const replaceObj = this.replaceObj[item.uuid]
        if (replaceObj && typeof replaceObj === 'object') {
          if (replaceObj.replaceList.length === replaceObj.total) {
            this.replaceListActive = replaceObj.replaceListActive
            this.replaceList = replaceObj.replaceList
            return true
          }
        }
        this.getSuccess(item)
      },
      setReplaceCompare(replaceListActive, replaceList, total) {
        const uuid = replaceListActive.uuid
        // 在这里处理 看看需不需要处理
        if (uuid) {
          // 处理replaceList
          const list = replaceList.map(item => {
            const param = {}
            if (item.firstItemLine) {
              item.firstItemLine.filter(it => {
                param[it.itemLabel] = it.itemValue
              })
            }
            return {
              firstItemLine: param,
              uuid: item.lineUuId
            }
          })
          this.replaceObj[uuid] = {
            replaceListActive: suzao.deepClone(replaceListActive),
            replaceList: list,
            total: total
          }
        }
      },
      getSuccess(item) {
        const paramsData = {}
        try {
          paramsData.key = decodeURIComponent(item.queryContent)
        } catch (error) {
          paramsData.key = item.queryContent
        }
        paramsData.ansResultType = item.ansResultType
        paramsData.ansId = item.ansId
        paramsData.convId = item.convId
        paramsData.uuid = item.uuid
        paramsData.pageNum = 1
        paramsData.pageSize = 1000
        const eventSource = new EventSource('/core/dm/botAPI/v2?' + new URLSearchParams(paramsData).toString())

        const replaceObj = this.replaceObj[item.uuid]
        eventSource.addEventListener('REPLACE02', e => {
          const { data } = JSON.parse(e.data)
          if (data && data.items && data.items.length) {
            this.replaceObj[item.uuid] = {
              replaceListActive: replaceObj.replaceListActive,
              replaceList: data.items,
              total: data.total
            }
          }
          this.replaceListActive = replaceObj.replaceListActive
          this.replaceList = data.items
          if (eventSource) eventSource.close()
        })
      }
    }
  })
})

window.addEventListener('error', event => {
  console.error(event, 'error')
})
window.addEventListener('unhandledrejection', event => {
  console.error(event, 'unhandledrejection')
})
