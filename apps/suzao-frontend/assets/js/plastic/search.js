addEventListener('load', () => {
  var app = new Vue({
    el: '#plastic',
    data: {
      currency: {
        1: '未税RMB',
        2: '含税RMB',
        3: 'USD',
        4: 'HKD',
        5: 'NTD',
        6: 'EUR',
        7: 'JPY'
      },
      items: [], // 当前页数据
      total: 0, // 一共多少条
      pageSize: 20, // 每页多少条pageSize
      currentPage: 1, // 当前页码pageNum
      compareList: JSON.parse(localStorage.getItem('compareList') || '[]'), // 对比
      compareCoordinate: { x: 0, y: 0 },
      compareMax: 5,
      outViewsShow: false,
      outViewsTicket: '', // 二维码
      activeFixed: 'top', // 可视区域状态
      transitionLoading: true,
      byShare: [],
      browser: suzao.browser,
      params: suzao.paramObj(),
      scrollHeight: 0,
      eventSource: null,
      chatLoading: false,
      isFloor: true,
      paramsData: {},
      paddingTop: 0,
      mfrsSpeciesList: [],
      selected: {
        mid: '',
        cid: ''
      },
      searchOpt: {},
      initSearch: {
        mfrs: [],
        species: []
      },
      search: {
        mfrs: [],
        species: []
      },
      suggest: [],
      empty: 0,
      market: [], // 商品信息列表
      market_uuid: {}, // 记录商品推荐情况
      enCompanyName: '',
      hide: false,
      channel: undefined
    },
    watch: {},
    computed: {
      isFullScreen: function () {
        if (this.$refs.left && this.$refs.footer) return Boolean(this.$refs.left.offsetHeight + this.$refs.footer.offsetHeight < window.innerHeight)
      }
    },
    methods: {
      init: function (idName) {
        if (idName) {
          this.currentPage = 1
        }
        if (idName === 'mid') {
          this.mfrsSpeciesListFilter()
        }
        if (this.params.queryContent) {
          this.getEventSource(idName)
        } else {
          this.getMarketPlasticList(idName)
        }
      },
      toLink: function (item) {
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
      // 登录页广告
      requestData: function (id, byShare, num) {
        $axios({
          url: '/core/adv2/getAdvertising?id=' + id + '&num=' + (num || 1) + '&key=' + this.paramsData.key,
          method: 'get'
        }).then(function (data) {
          if (data.code === 101) {
            if (data.data.advertisingList.length) {
              app[byShare] = data.data.advertisingList.map(function (item) {
                item.image = JSON.parse(item.image)
                item.video = JSON.parse(item.video)
                return item
              })
            }
          } else {
            app.$message.error(data.msg)
          }
        })
      },
      // ai搜索
      // 请求数据 sse
      getEventSource: function (idName) {
        var that = this
        try {
          this.paramsData.key = decodeURIComponent(this.params.queryContent)
        } catch (error) {
          this.paramsData.key = this.params.queryContent
        }
        this.paramsData.convId = this.params.convId
        this.paramsData.ansResultType = this.params.ansResultType
        this.paramsData.ansId = this.params.ansId

        if (this.params.uuid) {
          this.paramsData.uuid = this.params.uuid
        }
        this.paramsData.pageNum = this.currentPage
        this.paramsData.pageSize = this.pageSize
        if (this.selected.mid) {
          this.paramsData.mid = this.selected.mid
        } else {
          delete this.paramsData.mid
        }
        if (this.selected.cid) {
          this.paramsData.cid = this.selected.cid
        } else {
          delete this.paramsData.cid
        }
        // 开启聊天提示
        var params = new URLSearchParams(this.paramsData).toString()
        this.eventSource = new EventSource('/core/dm/botAPI/v2?' + params)
        this.transitionLoading = true

        this.eventSource.addEventListener('ES', update_list)
        this.eventSource.addEventListener('NL2SQL', update_list)
        this.eventSource.addEventListener('FUZZY_QUERY', update_list)
        this.eventSource.addEventListener('REPLACE02', update_list) // 替代牌号
        function update_list(e) {
          that.transitionLoading = false
          try {
            var data = JSON.parse(e.data)
            that.getSuccess(data)
            if (data.search) {
              Object.keys(that.search).forEach(function (key) {
                if (data.search[key] && data.search[key].length >= that.search[key].length) {
                  that.search[key] = data.search[key].map(function (it) {
                    return {
                      label: it.name,
                      value: String(it.id)
                    }
                  })
                }
              })
            }
          } catch (error) {}
          if (that.eventSource) that.eventSource.close()
        }

        this.eventSource.addEventListener('SYSTEM_ERROR', error)
        this.eventSource.addEventListener('error', error)
        function error(e) {
          console.log(e)
          that.$message.error(e.data)
          if (that.eventSource) that.eventSource.close()
        }
      },
      getMarketPlasticList: function (cid) {
        if (this.params.eid) {
          this.paramsData.eid = this.params.eid
        } else {
          delete this.paramsData.eid
        }
        if (this.params.convId) {
          this.paramsData.convId = this.params.convId
        } else {
          delete this.paramsData.convId
        }
        if (this.params.ansId) {
          this.paramsData.ansId = this.params.ansId
        } else {
          delete this.paramsData.ansId
        }

        if (this.selected.mid) {
          this.paramsData.mid = this.selected.mid || this.params.mid
        } else {
          delete this.paramsData.mid
        }
        if (this.selected.cid) {
          this.paramsData.cid = this.selected.cid || this.params.cid
        } else {
          delete this.paramsData.cid
        }

        this.paramsData.pageNum = this.currentPage
        this.paramsData.pageSize = this.pageSize
        var params = new URLSearchParams(this.paramsData).toString()
        var that = this
        $axios({ url: '/core/dm/botAPI/getMarketPlasticList?' + params, method: 'get' }).then(function (res) {
          if (res.code === 101) {
            that.getSuccess(res.data)
            if (res.data.data.mfrsSpeciesList && that.mfrsSpeciesList.length === 0) {
              that.mfrsSpeciesList = res.data.data.mfrsSpeciesList
              that.search.mfrs = that.mfrsSpeciesList.map(function (item) {
                return {
                  value: String(item.mfrsId),
                  label: item.mfrsName
                }
              })
              that.mfrsSpeciesListFilter()
            }
          } else {
            that.$message.error(res.msg)
          }
        })
      },
      getSuccess: function (fb) {
        if (fb.status === 1) {
          this.suggest = []
          if (fb.data.total < 1) {
            this.empty = 1
            if (fb.suggest && fb.suggest.length) {
              this.suggest = fb.suggest
            }
          } else {
            this.empty = 0

            let market_plastic = {}
            let recommendedSmallBusiness = {}
            let smallBusiness = {}
            if (fb.market_plastic) {
              market_plastic = suzao.arrayToObjectByKey(fb.market_plastic, 'uuid')
            }
            if (fb.recommendedSmallBusiness) {
              recommendedSmallBusiness = suzao.arrayToObjectByKey(fb.recommendedSmallBusiness, 'uuid')
            }
            if (fb.smallBusiness) {
              smallBusiness = suzao.arrayToObjectByKey(fb.smallBusiness, 'uuid')
            }
            // var re_count = 0 //记录当前页已推荐的商品数量
            // var use_uuid = {} //记录当前页已推荐的物性表uuid
            this.items = fb.data.items.map(item => {
              let newItem = { ...item }
              if (item.uuid in market_plastic) {
                newItem = Object.assign(item, market_plastic[item.uuid][0], {
                  merchantType: 'market_plastic'
                })
                return this.processItem(newItem)
              } else if (item.uuid in recommendedSmallBusiness) {
                newItem = Object.assign(item, recommendedSmallBusiness[item.uuid][0], {
                  merchantType: 'recommendedSmallBusiness'
                })
                if (item.uuid in smallBusiness) {
                  newItem = Object.assign(newItem, {
                    smallBusiness: smallBusiness[item.uuid],
                    merchantType: 'smallBusiness'
                  })
                }
                return newItem
              }
              return this.processItem(newItem)
            })

            var type = ''
            if (fb.data.type === 1) {
              type = '代理商'
            } else if (fb.data.type === 2) {
              type = '生产厂家'
            }
            this.enCompanyName = type + ': ' + fb.data.enCompanyName
          }
          this.total = fb.data.total
          this.$nextTick(() => {
            suzao.observer.call(suzao, this.channel)
          })
        } else if (fb.need_login) {
          window.location.href = '/login?refer=' + location.pathname + location.search
        } else if (fb.status === 0) {
          this.empty = 2
        }
        suzao.scrollTop()
        this.transitionLoading = false
      },
      // 筛选
      mfrsSpeciesListFilter: function () {
        if (this.mfrsSpeciesList.length === 0) return
        var that = this
        var index = that.search.mfrs.findIndex(function (item) {
          return item.value === that.selected.mid
        })
        if (index > -1) {
          if (that.mfrsSpeciesList[index].speciesList) {
            that.search.species = that.mfrsSpeciesList[index].speciesList.map(function (item) {
              return {
                value: String(item.speciesId),
                label: item.speciesName
              }
            })
            const ind = that.search.species.findIndex(item => {
              return item.value === that.selected.cid
            })
            if (ind === -1) that.selected.cid = that.search.species[0].value
          }
        }
      },
      // 处理数据
      processItem: function (item) {
        var price = []
        if (item.unit_price) {
          price.push(this.currency[item.currency] + ' ' + parseFloat(item.unit_price) + '/' + item.unit)
        }
        if (item.unit_price_foreign) {
          price.push(this.currency[item.currency_foreign] + ' ' + parseFloat(item.unit_price_foreign) + '/' + item.unit)
        }
        if (price.length) {
          item.unit_price = price.join(',')
        } else {
          item.unit_price = '价格面议'
        }

        if (item.certs) {
          item.certs = item.certs.split(',')
        } else {
          item.certs = []
        }

        return item
      },
      // 删除对比
      removeCompare: function (idx) {
        if (typeof idx !== 'undefined') {
          this.compareList.splice(idx, 1)
        } else {
          this.compareList = []
        }
      },
      // 切换一页多少条
      handleSizeChange: function (val) {
        this.pageSize = val
        this.currentPage = 1
        this.init()
        setTimeout(suzao.scrollTop, 300)
      },
      // 切到某一页
      handleCurrentChange: function (val) {
        this.currentPage = val
        this.init()
        setTimeout(suzao.scrollTop, 300)
      },
      // 监听页面滚动
      watchScroll: function (event) {
        if (this.$refs.main && this.$refs.thTitle && this.$refs.footer) {
          var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
          if (scrollTop > this.$refs.main.getBoundingClientRect().top - this.$refs.thTitle.offsetHeight + this.paddingTop) {
            if (window.innerHeight < this.$refs.footer.getBoundingClientRect().top) {
              // 离开顶部
              this.activeFixed = 'active'
            } else {
              // 到达底部
              this.activeFixed = 'bottom'
            }
          } else {
            // 顶部
            this.activeFixed = 'top'
          }
        } else {
          this.activeFixed = 'bottom'
        }

        // recommend
      },
      // 聊天滚动到底
      backBottom: function () {
        this.isFloor && this.$refs.chatContent && (this.$refs.chatContent.scrollTop = this.$refs.chatContent.scrollHeight)
      },
      //  初始化
      initCompare: function () {
        // 对比框
        if (window.innerWidth < 1720) {
          if (this.$refs.compareWarp) {
            // 小屏第一次
            this.$refs.compareWarp.style.transform = 'translate(35vw, 20vh)'
            this.$refs.compareWarp.style.display = 'block'
            var transformMatrix = getComputedStyle(this.$refs.compareWarp).transform
            if (transformMatrix !== 'none') {
              var matrixValues = transformMatrix.match(/matrix.*\((.+)\)/)[1].split(', ')
              this.compareCoordinate = { x: parseFloat(matrixValues[4]), y: parseFloat(matrixValues[5]) }
            }
            this.$refs.compareWarp.style.display = 'none'
          }
        }

        if (this.$refs.compareList) this.paddingTop = parseFloat(getComputedStyle(this.$refs.compareList.$el).getPropertyValue('padding-top'))
        window.addEventListener('scroll', this.watchScroll)
        setTimeout(suzao.scrollTop, 300)
        var resizeTimer
        window.addEventListener('resize', function () {
          clearTimeout(resizeTimer)
          resizeTimer = setTimeout(function () {
            suzao.scrollTop()
          }, 500)
        })

        // 根据页面高度请求广告
        this.getByShare()
      },
      // 获取广告
      getByShare: function () {
        var i = 2
        if (this.$refs.right) {
          if (this.$refs.chatContent) {
            i = parseInt((parseInt(getComputedStyle(this.$refs.right).height, 10) - 450) / 190, 10)
          } else {
            i = parseInt((parseInt(getComputedStyle(this.$refs.right).height, 10) - 50) / 190, 10)
          }
        }
        this.requestData(100008, 'byShare', i > 4 ? 4 : i)
      },
      // 兼容ie
      emailHtml: function (email) {
        if (this.browser === 'ie') return email
        return '<a href="mailto:' + email + '?cc=service@17suzao.com">' + email + '</a>'
      },
      // 关闭提示
      setHide: function (e) {
        e.stopPropagation()
        e.preventDefault()
        this.hide = true
      },
      toSubstitute(item) {
        this.uploadClick({
          dataPlasticId: item.p_base_id,
          buttonName: '替代牌号'
        })
        const refer = location.origin + `/plastic/search?uuid=${item.uuid}`
        this.goLogin(refer)
        if (_SZ_HAS_LOGIN && item.uuid) {
          location.href = refer
        }
      },
      toQuotation(item) {
        const refer = `${location.origin}/page/merchantRegistration??uuid=${item.uuid}`
        this.goLogin(refer)
        if (_SZ_HAS_LOGIN && item.uuid) {
          console.log(refer)
          window.open(refer, '_blank')
        }
      },
      goLogin(refer) {
        if (!_SZ_HAS_LOGIN) {
          if (window.openLoginDialog) {
            return window.openLoginDialog(typeof refer === 'string' ? refer : '')
          }
          location.href = '/login?refer=' + location.pathname + encodeURIComponent(location.search)
        }
      },
      uploadClick(data) {
        return fetch('/core/Click/upload', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
    },
    filters: {
      filter_formatPhone: function (value, hide) {
        return suzao.formatPhone(value, hide)
      }
    },
    created: function () {
      if (this.params.mid && this.params.mid !== 'undefined') {
        this.selected.mid = this.params.mid
      }
      if (this.params.cid && this.params.cid !== 'undefined') {
        this.selected.cid = this.params.cid
      }
      this.init()
    },
    mounted: function () {
      this.initCompare()
      setTimeout(() => {
        this.hide = true
      }, 8000)

      window.addEventListener('pushState', () => {
        this.channel = suzao.getChannel()
      })
      this.channel = suzao.getChannel()
    },
    destroyed: function () {
      //销毁滚动事件
      window.removeEventListener('scroll', this.watchScroll)
    }
  })
})
