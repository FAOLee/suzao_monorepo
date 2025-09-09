addEventListener('load', () => {
  Vue.component('search-filter', {
    data() {
      return {
        isActive: false,
        fKey: '全部',
        bKey: null,
        fObj: [],
        bObj: []
      }
    },
    props: ['income', 'type', 'searchOpt', 'opener'],
    methods: {
      more() {
        this.isActive = !this.isActive
      },
      setFKey(k) {
        this.fKey = k
      },
      setBKey(item) {
        this.bKey = item.id
        this.$parent.searchOpt = suzao.deepClone(this.$parent.searchOpt)
        this.$parent.searchOpt[this.type] = item.id
        this.$parent.searchOpt.draw = 1
        this.$parent.searchOpt.cond = 1
        this.$parent.currentPage = 1
        this.$parent.getData()
        this.$parent.selected[this.type] = item.name
      }
    },
    watch: {
      income: {
        handler(n) {
          var fObj = ['全部']
          var bObj = []
          var i
          for (i = 0; i < n.length; i++) {
            if (n[i].name === null) continue
            var chr = checkCh(n[i].name).substring(0, 1).toUpperCase()
            var chrCode = chr.charCodeAt(0)
            if (chrCode < 65 || chrCode > 90) {
              n[i].key = '#'
              fObj[1] = '#'
            } else {
              n[i].key = chr
              fObj[chrCode] = chr
            }
            bObj.push(n[i])
          }
          fObj = fObj.filter(function(s) {
            return s && s.trim()
          })
          this.fObj = fObj
          this.bObj = bObj
          this.fKey = '全部'
          this.bKey = null
        },
        immediate: true
      },
      searchOpt(n) {
        if (typeof n[this.type] === 'undefined') {
          this.bKey = null
        }
      }
    },
    template:
      '\
      <dd class=\'dd\'>\
        <div :class="{hidden: !isActive,div:true}">\
          <span v-for="(item, idx) in fObj" @click="setFKey(item)" :class="{active: item === fKey, span:true}">{{item}}</span>\
        </div>\
        <div :class="{one: !isActive,div:true}">\
          <span v-for="(item, idx) in bObj" @click="setBKey(item)" :class="{active: item.id === bKey, hidden: fKey !== \'全部\' && fKey !== item.key, span:true}" >{{item.name}}</span>\
        </div>\
        <el-button class="suzao-border-btn" size="mini" @click="more">{{isActive ? \'收起\' : \'更多\'}}</el-button>\
      </dd>'
  })
  const initSearch = {
    mfrs: [],
    species: [],
    enterprise: []
  }
  const searchFun = () => {
    const key = suzao.paramObj('key')
    if (key) {
      try {
        return decodeURIComponent(key) || ''
      } catch (e) {
        return ''
      }
    } else {
      return ''
    }
  }

  const selectedList = {
    mid: '制造商',
    cid: '种类',
    enterpriseId: '公司'
  }

  const app = new Vue({
    el: '#merchant',
    data: {
      items: [], // 当前页数据
      total: 0, // 一共多少条
      pageSize: 20, // 每页多少条
      currentPage: 1, // 当前页码
      empty: 0, // 列表展示状态
      suggest: [], // 没有符合条件您要找的是不是
      search: suzao.deepClone(initSearch),
      loading: true,
      byShare: [],
      byKyeIds: [],
      searchOpt: {
        draw: 1,
        cond: 1
      },
      selected: {
        mid: '',
        cid: '',
        enterpriseId: ''
      },
      selectedList: selectedList,
      cb: null,
      params: suzao.paramObj(),
      searchKey: searchFun(),
      channel: undefined,
      btnContent: {}
    },
    computed: {
      isFullScreen() {
        if (this.$refs.left && this.$refs.footer) return Boolean(this.$refs.left.offsetHeight + this.$refs.footer.offsetHeight < window.innerHeight)
      },
      hasFilter() {
        return this.search.mfrs.length > 1
          || this.search.species.length > 1
          || this.search.enterprise.length > 1
          || this.selected.mid
          || this.selected.cid
          || this.selected.enterpriseId
      }
    },
    methods: {
      init() {
        this.getButtonNavigation()
        if (this.searchKey) {
          this.searchOpt['key'] = this.searchKey
        }
        this.getData()
      },
      // 登录页广告
      requestData(id, num, key) {
        const params = {
          id: id,
          num: num || 1
        }
        if (this.byKyeIds.length && this.currentPage > 1) {
          params.byKyeIds = this.byKyeIds.join(',')
        }
        if (key !== undefined) {
          params.key = key
        }
        fetch(`/core/adv2/getAdvertising?${new URLSearchParams(params).toString()}`)
          .then(request => request.json())
          .then((data) => {
            if (data.code === 101) {
              if (data.data && data.data.advertisingList.length) {
                this.byShare = data.data.advertisingList.map((item) => {
                  item.image = JSON.parse(item.image)
                  item.video = JSON.parse(item.video)
                  item.link = this.toLink(item)
                  this.countHighlight(item, 'view')
                  return item
                })
                this['byKyeIds'] = data.data.byKyeIds
              }
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      },
      // 广告记录
      countHighlight(row, type) {
        return suzao.countHighlight(row.hash, type)
      },
      async getData() {
        this.viewBox = [] // 重置key
        this.loading = true
        let url = '/core/merchant/recommend'
        const params = Object.assign(
          {
            draw: this.searchOpt.draw,
            cond: this.searchOpt.cond,
            pageNum: this.currentPage,
            pageSize: this.pageSize
          },
          this.searchOpt
        )
        if (this.searchKey) {
          params['key'] = this.searchKey
        }
        if (this.searchOpt.mid
          || this.searchOpt.cid
          || this.searchOpt.enterpriseId
          || this.searchOpt.key
          || this.searchKey) {
          url = '/core/merchant/searchV2'
        }

        fetch(`${url}?${new URLSearchParams(params).toString()}`)
          .then(request => request.json())
          .then(this.getSuccess)
          .catch(error => {
            console.error('Error:', error);
            this.loading = false
          })
      },
      getSuccess(fb) {
        this.getByShare(this.searchKey)
        // 根据页面高度请求广告
        if (this.cb !== null) {
          this.cb([])
          this.cb = null
        }
        if (fb.code === 102) {
          this.$message({
            type: 'error',
            message: fb.msg,
            customClass: 'z-index-max'
          })
          this.loading = false
          return
        }
        if (fb.status === 1) {
          this.suggest = []
          if (fb.data.total < 1) {
            this.resetSearchFilter()
            this.empty = 1
            if (fb.suggest && fb.suggest.length) {
              this.suggest = fb.suggest
            }
          } else {
            this.empty = 0
            if (this.searchOpt.draw) {
              Object.entries(initSearch).map(([key, value]) => {
                this.search[key] = fb.search[key] || suzao.deepClone(value)
              })
            }
            this.items = fb.data.items.map(this.processItem)
          }
          this.total = fb.data.total
          this.$nextTick(() => {
            suzao.observer.call(suzao, this.channel)
          })
        } else if (fb.need_login) {
          this.goLogin()
        } else if (fb.status === 0) {
          this.empty = 2
        } else if (fb.code === 5007) {
          this.$message({
            type: 'error',
            message: fb.msg,
            customClass: 'z-index-max'
          })
          window.openMemberInterest()
        }
        suzao.scrollTop()
        this.loading = false
      },
      // 处理数据
      processItem(item) {
        const newItem = {
          ...item
        }
        if (item.szMarketV2) {
          const price = []
          if (Number(item.szMarketV2.rmb)) {
            price.push(`含税CNY${item.szMarketV2.rmb}/吨`)
          }
          if (Number(item.szMarketV2.usd)) {
            price.push(`USD ${item.szMarketV2.usd}/吨`)
          }
          newItem.unit_price = price.length ? price.join(',') : '价格询购'
          newItem.companyname = item.szMarketV2.companyname
          newItem.cellphone = item.szMarketV2.cellphone
          newItem.isExclusive = item.szMarketV2.isExclusive
          newItem.enterpriseId = item.szMarketV2.enterpriseId
          newItem.plasticFav = item.szMarketV2.plasticFav === 'undefined' ? 0 : item.szMarketV2.plasticFav
          newItem.enterpriseFav = item.szMarketV2.enterpriseFav === 'undefined' ? 0 : item.szMarketV2.enterpriseFav
          newItem.collapse = 0
        }
        return newItem
      },
      // 重置搜索
      resetSearchFilter() {
        this.search = { mfrs: [], species: [], enterprise: [] }
        this.selected = { mid: '', cid: '', enterpriseId: '' }
      },
      autoComplete(key, cb) {
        if (key && key.length < 2) {
          return
        }
        this.cb = cb
        this.searchKey = key
        fetch('/vendor/autoCompleteV3', {
          method: 'POST',
          headers: { 'Client-Type': 2 },
          body: suzao.parseFormData({ key: key, scene: 'merchant' })
        }).then(request => request.json())
          .then((fb) => {
            if (key === app.resultKey || !(fb.data && fb.data.length)) {
              cb([])
              app.cb = null
            } else {
              const items = fb.data.map(item => ({ value: item.title }))
              cb(items)
            }
          }).catch(error => {
            console.error('Error:', error);
          });
      },
      handleSearch(key) {
        if (key) {
          this.searchKey = key
        }
        this.currentPage = 1
        this.resetSearchFilter()
        if (this.searchKey) {
          this.params['key'] = this.searchKey
        } else {
          delete this.params['key']
        }
        this.getData()
        const strURLSearchParams = Object.keys(this.params).length ? `?${suzao.objectToQueryString(this.params)}` : ''
        history.pushState({}, '物性表 - 商城', location.pathname + strURLSearchParams)
      },
      removeSelected(key) {
        this.selected[key] = ''
        this.searchOpt = {
          draw: 1,
          cond: 1
        }
        this.getData()
      },
      // 切换一页多少条
      handleSizeChange(val) {
        this.pageSize = val
        this.currentPage = 1
        this.getData()
      },
      // 切到某一页
      handleCurrentChange(val) {
        this.currentPage = val
        this.getData()
      },
      // 获取广告
      getByShare(key) {
        if (this.$refs.right) {
          const i = parseInt((parseInt(getComputedStyle(this.$refs.right).height, 10) + 15) / 198, 10) || 2
          this.requestData(19, i, key)
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
      // 收藏
      async favAdd(item) {
        // 提前返回检查
        if (item.plasticFav && item.enterpriseFav) {
          return;
        }
        const allSettled = []
        if (!item.plasticFav) {
          allSettled.push(this.addFavorite(7, item.uuid, 'plasticFav'))
        }
        if (!item.enterpriseFav) {
          allSettled.push(this.addFavorite(3, item.enterpriseId, 'enterpriseFav'))
        }
        try {
          let i = 0
          const results = await Promise.allSettled(allSettled);
          results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
              const { field, favId } = result.value;
              // item[field] = favId;
              if (field === 'plasticFav') {
                this.items = this.items.map(it => {
                  if (item.uuid === it.uuid) {
                    it[field] = favId;
                  }
                  return it
                })
              }
              if (field === 'enterpriseFav') {
                this.items = this.items.map(it => {
                  if (item.enterpriseId === it.enterpriseId) {
                    it.enterpriseFav = favId
                  }
                  return it
                })
              }
              i++
            } else if (result.status === 'rejected') {
              this.$message({
                type: 'error',
                message: `收藏失败: ${result.reason}`,
                customClass: 'z-index-max'
              })
            }
          });
          if (i === allSettled.length) {
            this.$message({
              type: 'success',
              message: '收藏成功',
              customClass: 'z-index-max'
            })
          }
        } catch (error) {
          console.error('收藏操作发生错误:', error);
        }
      },
      async addFavorite(type, id, field) {
        try {
          const response = await fetch('/member/favAdd', {
            method: 'POST',
            headers: { 'Client-Type': 2 },
            body: suzao.parseFormData({ type, id })
          });
          if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
          }
          const res = await response.json();
          if (res.status) {
            return { field, favId: res.id };
          } else {
            throw new Error(res.errors && res.errors.join(',') || '收藏失败');
          }
        } catch (error) {
          console.error(`${field}收藏失败:`, error.message);
          throw error; // 重新抛出以便外部处理
        }
      },
      // 取消收藏
      favDelete(item) {
        // item.enterpriseFav
        fetch('/member/favDelete', {
          method: 'POST',
          headers: { 'Client-Type': 2 },
          body: suzao.parseFormData({ ids: [item.enterpriseFav] })
        }).then(request => request.json())
          .then(res => {
            if (res.status) {
              // item.enterpriseFav = 0
              this.items = this.items.map(it => {
                if (item.enterpriseId === it.enterpriseId) {
                  it.enterpriseFav = 0
                }
                return it
              })
              this.$message({
                type: 'success',
                message: '取消收藏成功',
                customClass: 'z-index-max'
              })
            } else {
              this.$message({
                type: 'error',
                message: '取消收藏失败',
                customClass: 'z-index-max'
              })
              console.error(res.errors.join(','));
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '取消收藏失败',
              customClass: 'z-index-max'
            })
            console.error('Error:', error);
          });
      },
      // 获取按钮操作
      getButtonNavigation() {
        const params = new URLSearchParams({
          nameCodes: ['pc_quoted_price', 'apply_for']
        });
        fetch(`/core/merchant/getButtonNavigation?${params}`, {
          method: 'GET',
          headers: { 'Client-Type': 2 }
        }).then(response => response.json())
          .then(({ code, data }) => {
            if (code === 101 && data.length) {
              this.btnContent = data.filter(item => item.status)
              return
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      },
      toMerchantRegistration(item) {
        if (_SZ_HAS_LOGIN) {
          this.uploadClick({
            buttonName: '发布报价',
            type: 30001
          })
          window.open('/page/merchantRegistration')
        } else {
          window.open('/login?refer=/page/merchantRegistration')
        }
      },
      toExclusive(item) {
        const tel = item.value || `400 869 1788`
        this.uploadClick({
          buttonName: '申请独家',
          type: 30002
        })
        this.$alert(`申请独家请联系客服: <a href="tel:${tel}">${tel}</a>`, '客服热线', {
          dangerouslyUseHTMLString: true,
          lockScroll: false,
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: '确定',
          cancelButtonClass: 'suzao-btn'
        }).catch(action => { });
      },
    },
    filters: {
      filter_formatPhone(value) {
        return value.replace(/^(.*)(\d{3})(\d{4})(\d{4})$/g, '$1 $2 $3 $4')
      }
    },
    created() {
      this.init()
    },
    mounted() {
      window.addEventListener('pushState', () => {
        this.channel = suzao.getChannel()
      })
      this.channel = suzao.getChannel()
    }
  })
})
