addEventListener('load', () => {
  const renderer = new marked.Renderer()
  const unchanged = new marked.Renderer()

  const mathsExpression = expr => {
    const reg = /\$\$([^$]+)\$\$/g
    const reg2 = /\$([^$]+)\$/g

    return expr
      .replace(reg, (match, content) => {
        try {
          return katex.renderToString(content, {
            displayMode: true,
            output: 'html'
          })
        } catch (error) {
          return match
        }
      })
      .replace(reg2, (match, content) => {
        try {
          return katex.renderToString(content, {
            displayMode: false
          })
        } catch (error) {
          return match
        }
      })
  }

  // renderer.code = (code, lang, escaped)=> {
  //   const math = code
  //   if (['katex', 'latex'].includes(lang)) {
  //     math = mathsExpression(code)
  //   }
  //   return unchanged.code(math, lang, escaped);
  // };

  renderer.codespan = text => {
    const math = mathsExpression(text)
    return unchanged.codespan(math)
  }
  // renderer.inlineText = (text) =>{
  //   const math = mathsExpression(text)
  //   if (math) {
  //     return math
  //   }
  //   return unchanged.inlineText(text);
  // };
  renderer.blockquote = text => {
    const math = mathsExpression(text)
    return unchanged.blockquote(math)
  }
  // renderer.heading = (text, level, raw) =>{
  //   return unchanged.heading(text, level, raw)
  // }
  // renderer.list = (body, ordered, start) =>{
  //   return unchanged.list(body, ordered, start)
  // }
  renderer.listitem = (text, task, checked) => {
    const math = mathsExpression(text)
    return unchanged.listitem(math, task, checked)
  }
  renderer.paragraph = text => {
    const math = mathsExpression(text)
    return unchanged.paragraph(math)
  }

  const options = {
    renderer: renderer,
    // gfm: true, // 允许 Git Hub标准的markdown.
    // pedantic: false, // 不纠正原始模型任何的不良行为和错误（默认为false）
    // sanitize: false, // 对输出进行过滤（清理），将忽略任何已经输入的html代码（标签）
    // tables: true, // 允许支持表格语法（该选项要求 gfm 为true）
    // breaks: false, // 允许回车换行（该选项要求 gfm 为true）
    // smartLists: true, // 使用比原生markdown更时髦的列表
    // smartypants: false, // 使用更为时髦的标点
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      // if (['katex', 'latex'].includes(lang)) {
      //   return mathsExpression(code)
      // }
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, {
        language
      }).value
    }
  }

  marked.setOptions(options)

  // 操作反馈
  Vue.component('chat-feedback', {
    props: {
      item: {
        type: Object
      }
    },
    inject: [
      'backBottom',
      'renderStart',
      'renderEnd',
      'openShowCorrect',
      'handleSearch',
      'openBecomeDialog',
      'questionAgain',
      'copyText',
      'openList'
    ],
    data() {
      return {
        foldingState: false
      }
    },
    created() {
      this.renderStart()
    },
    mounted() {
      this.init()
    },
    computed: {
      lickActive() {
        return this.item.isLike
      },
      dissActive() {
        return this.item.isDiss
      },
      contentClassName() {
        return this.item.className + ' ' + this.item.ansResultType
      }
    },
    methods: {
      init() {
        this.backBottom()
        this.renderEnd()
      },
      // 重试
      eventRetry(item) {
        this.questionAgain(item.ansId, item.conId)
      },
      // 复制
      eventCopy(item) {
        const divElement = this.$refs['more' + item.ansId].nextSibling
        if (!divElement || !window.getSelection) return
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(divElement)
        selection.removeAllRanges()
        selection.addRange(range)
        document.execCommand('copy')
        // 取消选中区域
        selection.empty()

        this.$message({
          type: 'success',
          message: '复制成功'
        })
      },
      // 点赞
      eventLike(ansId) {
        // if (this.lickActive || this.dissActive) return
        const that = this
        $axios({
          url: '/core/dm/botAPI/likeOrDis',
          method: 'post',
          data: { ansId: this.item.ansId, operateType: 1 }
        })
          .then(res => {
            if (res.code === 101) {
              if (that.lickActive) {
                that.item.isLike = false
              } else {
                that.item.isLike = true
                that.item.isDiss = false
              }
            } else {
              that.$message.error(res.msg)
            }
          })
          .catch(console.error)
      },
      // 点踩
      eventDislikes(ansId) {
        if (this.dissActive) {
          const that = this
          $axios({
            url: '/core/dm/botAPI/likeOrDis',
            method: 'post',
            data: { ansId: this.item.ansId, operateType: 2 }
          })
            .then(res => {
              if (res.code === 101) {
                if (that.dissActive) {
                  that.item.isDiss = false
                } else {
                  that.item.isDiss = true
                  that.item.isLike = false
                }
              } else {
                that.$message.error(res.msg)
              }
            })
            .catch(console.error)
        } else {
          this.openShowCorrect(ansId)
        }
      },
      changeList(item) {
        this.foldingState = !this.foldingState
        this.openList(item.ansId, item.conId)
      },
      toLink(item) {
        const url = '/plastic/search?view=4'
        const params = {
          ansId: item.ansId || '',
          convId: item.convId || '',
          queryContent: item.queryContent || '',
          ansResultType: item.ansResultType || '',
          uuid: item.uuid || ''
        }
        return url + '&' + new URLSearchParams(params).toString()
      }
    },
    template: `
      <div :class="contentClassName" :ref="\'more\' + item.ansId">
        <div class="operate-btn retry" @click="eventRetry(item)"><i class="iconfont icon-icon_zhongshi"></i> 重试</div>
        <div v-if="item.ansId" class="operate-btn copy" @click="eventCopy(item)"><i class="el-icon-document-copy"></i> 复制</div>
        <div v-if="item.ansId" :class="{\'operate-btn\':true, active: lickActive, like:true}" @click="eventLike(item.ansId)"><i class="el-icon-check"></i> 对</div>
        <div v-if="item.ansId" :class="{\'operate-btn\':true, active: dissActive, dislikes:true}" @click="eventDislikes(item.ansId)"><i class="el-icon-close"></i> 错</div>
        <div class="right-flex-end">
          <div class="operate-btn become" v-if="item.ansResultType === \'ENTERPRISE\'" @click="openBecomeDialog(item)"><i class="iconfont el-icon-edit"></i> 申请成为商家</div>
          <a v-if="![\'ENTERPRISE\',\'REPLACE01\'].includes(item.ansResultType) && item.total > item.length" class="operate-btn" target=\'_blank\' :href="toLink(item)">
            查看更多<span class="color">{{item.total}}条</span>相关内容<i class="iconfont el-icon-arrow-right"></i>
          </a>
          <div v-if="[\'REPLACE01\'].includes(item.ansResultType) && item.total > 6" class="operate-btn text" :class="{foldingState:foldingState}" @click="changeList(item)">
            <div class="open">查看更多 <i class="el-icon-arrow-down"></i></div>
            <div class="close">收起 <i class="el-icon-arrow-up"></i></div>
          </div>
        </div>
      </div>
      `
  })

  // 基本渲染
  Vue.component('chat-display', {
    props: {
      item: {
        type: Object
      }
    },
    computed: {
      htmlString() {
        return this.item.htmlString
      },
      loading() {
        return this.item.transitionLoading
      }
    },
    inject: ['backBottom', 'backBottom2', 'renderStart', 'renderEnd', 'handleSearch'],
    created() {
      this.renderStart()
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.backBottom()
        this.renderEnd()
      },
      search(text) {
        const that = this
        this.backBottom2()
        setTimeout(() => {
          that.handleSearch({
            key: text,
            queryType: that.item.ansId ? 4 : 2
          })
        }, 300)
      }
    },
    template: `<div :class="loading? \'cursor \' + item.className : item.className" v-html="htmlString"></div>`
  })

  // 初始
  Vue.component('chat-init', {
    props: {
      item: {
        type: Object
      }
    },
    computed: {
      textList() {
        return this.item.text
      }
    },
    data() {
      return {
        text: [],
        titleTip: ''
      }
    },
    inject: ['backBottom', 'backBottom2', 'renderStart', 'renderEnd', 'handleSearch', 'myRandom'],
    created() {
      this.renderStart()
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.toggle()
        this.updated()
        this.backBottom()
        this.renderEnd()
      },
      toggle() {
        this.text = this.myRandom(this.textList, 4)
      },
      updated() {
        let i = 0
        let startTime = null
        const time = 128
        const titleTip = this.item.titleTip
        const frame = timestamp => {
          if (!startTime) startTime = timestamp
          const progress = timestamp - startTime

          if (progress > time && i <= titleTip.length) {
            this.titleTip += titleTip.slice(i - 1, i)
            i++
            startTime = timestamp
          }
          if (i <= titleTip.length) {
            requestAnimationFrame(frame)
          }
        }
        requestAnimationFrame(frame)
      },
      search(text) {
        const that = this
        this.backBottom2()
        setTimeout(() => {
          that.handleSearch({
            key: text,
            queryType: that.item.ansId ? 4 : 2
          })
        }, 300)
      }
    },
    template: `
      <div :class="item.className">
        <div class="tip-content" :style="item.colorString">
          <div class="new" v-if="item.titleTip">{{titleTip}}</div>
          <div v-if="item.title">{{item.title}}</div>
          <a v-if="item.btn && item.btn.url && item.btn.content" :href="item.btn.url" target="_blank" class="learn-more">{{item.btn.content}}</a>
        </div>
        <div class="recommend-content">
          <div class="tip"><div>{{item.tip}}</div><div class="operate-btn" @click="toggle"><i class="iconfont icon-icon_zhongshi"></i> 换一换</div></div>
          <div class="box"><p class="text" v-for="it in text"><span @click="search(it)">{{it}}</span></p></div>
        </div>
      </div>
      `
  })

  // 推荐列表
  Vue.component('chat-recommend', {
    props: {
      item: {
        type: Object
      }
    },
    computed: {
      text() {
        return this.item.text
      }
    },
    inject: ['backBottom', 'backBottom2', 'renderStart', 'renderEnd', 'handleSearch'],
    created() {
      this.renderStart()
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.backBottom()
        this.renderEnd()
      },
      search(text) {
        const that = this
        this.backBottom2()
        setTimeout(() => {
          that.handleSearch({
            key: text,
            queryType: that.item.ansId ? 4 : 2
          })
        }, 300)
      }
    },
    template: `
      <div :class="item.className">
        <div class="tip" v-if="item.tip">{{item.tip}}</div>
        <p class="text" v-for="it in text"><span @click="search(it)">{{it}}</span></p>
      </div>
      `
  })

  // form表单
  Vue.component('chat-form', {
    props: {
      item: {
        type: Object
      }
    },
    data() {
      return {
        randomKey: Math.random()
      }
    },
    inject: ['backBottom', 'renderStart', 'renderEnd', 'replaceFormList', 'memberIndustry'],
    created() {
      this.renderStart()
      if (this.item.industry) {
        this.item.industry = []
      }
      if (this.item.company) {
        this.item.company = ''
      }
      if (this.item.name) {
        this.item.name = ''
      }
      this.randomKey = Math.random()
    },
    computed: {
      industryAll() {
        return this.$parent.memberIndustry.concat()
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.backBottom()
        this.renderEnd()
      },
      submitForm() {
        const that = this
        this.$refs['chatForm' + this.item.ansId].validate(valid => {
          if (!valid) return
          if (!that.item.industry.length && !that.item.company && !that.item.name) return
          const formData = new FormData()
          if (that.item.industry.length) {
            formData.append('industry', that.item.industry.join(','))
          }
          if (that.item.company) {
            formData.append('company', that.item.company)
          }
          if (that.item.name) {
            formData.append('name', that.item.name)
          }
          axios({
            url: '/member/fillInfo',
            method: 'post',
            data: formData,
            params: { scene: 'apply' }
          })
            .then(res => {
              if (res.data && res.data.status === 1) {
                // 删除本组件
                that.$message({
                  type: 'success',
                  message: '保存成功!'
                })
                that.replaceFormList()
              }
            })
            .catch(console.error)
        })
      },
      itemQuerySearch(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        if (queryString.length < 2) {
          return
        }
        const formData = new URLSearchParams()
        formData.append('key', queryString)
        axios({
          url: '/vendor/autocompleteAddress',
          method: 'post',
          data: formData,
          params: { act: 'company' }
        })
          .then(res => {
            if (res.status === 200) {
              const data = res.data
              if (data.status === 1) {
                if (data.data.length === 0) {
                  return cb([])
                }
                const arr = data.data.map(item => {
                  return {
                    value: item
                  }
                })
                return cb(arr)
              }
            }
            return cb([])
          })
          .catch(error => {
            cb([])
          })
      }
    },
    template: `
      <div class="form-content">
        <div class="title">
          ${CHAT_TEXT.formTitle}
        </div>
        <div class="tip">
          ${CHAT_TEXT.formTip}
        </div>
        <el-row :gutter="30" type="flex">
          <el-form :model="item" :ref="\'chatForm\' + item.ansId" :key="randomKey">
            <el-col :span="12">
              <el-form-item v-if="item.name !== false" prop="name">
                <el-input v-model="item.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="item.industry" prop="industry">
                <el-select v-model="item.industry" filterable placeholder="请输入应用行业" clearable default-first-option allow-create multiple collapse-tags>
                  <el-option v-for="(it, ind) in industryAll" :key="ind" :label="it" :value="it"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="item.company !== false" prop="company">
                <el-autocomplete v-model="item.company" :fetch-suggestions="itemQuerySearch" :trigger-on-focus="false" placeholder="请输入公司"></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <el-button type="primary" class="color-btn" @click="submitForm">确认</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
     `
  })

  // 制造商
  Vue.component('chat-business', {
    props: {
      item: {
        type: Object
      }
    },
    computed: {
      list() {
        return this.item.list
      }
    },
    inject: ['backBottom', 'renderStart', 'renderEnd'],
    filters: {
      label_translate(value) {
        if (value === 1) {
          return '代理商'
        }
        if (value === 2) {
          return '生产厂家'
        }
      },
      max_mfrs(value) {
        if (value.length > 3) {
          value.length = 3
          return value.join('·') + '...'
        } else {
          return value.join('·')
        }
      },
      gender_type(value) {
        if (value === 1) {
          return '先生'
        }
        if (value === 0) {
          return '女士'
        }
        return ''
      }
    },
    created() {
      this.renderStart()
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.backBottom()
        this.renderEnd()
      },
      linkFormat(it) {
        const params = {
          view: 4
        }
        params.ansId = this.item.ansId
        params.convId = this.item.convId

        if (it.id) params.eid = it.id
        if (it.mid) params.mid = it.mid
        if (it.cid) params.cid = it.cid
        return '/plastic/search?' + new URLSearchParams(params).toString()
      }
    },
    template: `
      <div :class="item.className">
        <div class="tip">
          ${CHAT_TEXT.business}
        </div>
        <ul class="ul">
          <li class="li" v-for="it in list">
            <a :href="linkFormat(it)" class="box" target="_blank">
              <div class="title"><span class="name"><span v-if="it.type === 1">{{it.mfrsSet|max_mfrs}}&nbsp;</span>{{ it.type | label_translate }}</span> <i class="icon el-icon-arrow-right"></i></div>
              <div class="text">{{it.companyName}}</div>
              <div class="text">{{it.surname}} {{it.gender | gender_type}}</div>
              <div class="text"><span class="formatPhone" data-sensors-click :data-phone="suzao.formatPhone(it.cellphone)"><i class="iconfont icon-icon_dianhua"></i>查看电话</span></div>
              <div class="text">{{it.contactEmail}}</div>
            </a>
          </li>
        </ul>
      </div>
      `
  })

  // 对比
  Vue.component('chat-compare', {
    props: {
      item: {
        type: Object
      }
    },
    inject: ['backBottom', 'renderStart', 'renderEnd'],
    created() {
      this.renderStart()
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.backBottom()
        this.renderEnd()
      },
      linkFormat(code) {
        return '/plastic/compareV2?code=' + code
      }
    },
    template: ` 
      <div :class="item.className">
        <div class="tip">
          ${CHAT_TEXT.compare}
        </div>
        <a :href="linkFormat(item.code)" class="operate-btn" target="_blank"><img class="icon-pk" src="/frontend/assets/ai/pk.png?ver=2024030401"> 查看对比结果</a>
      </div>
      `
  })

  // 测试仪
  Vue.component('chat-commodity', {
    props: {
      item: {
        type: Object
      }
    },
    computed: {
      list() {
        return this.item.commodityVOList
      }
    },
    inject: ['backBottom', 'renderStart', 'renderEnd'],
    filters: {},
    created() {
      this.renderStart()
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.backBottom()
        this.renderEnd()
      },
      linkFormat(it) {
        if (!it.uuid) return ''
        const params = {
          id: it.uuid
        }
        params.ansId = this.item.ansId
        params.convId = this.item.convId

        return '/plastic/detail?' + new URLSearchParams(params).toString()
      }
    },
    template: `
      <div :class="item.className">
        <div class="tip">{{item.ansShowTips}}</div>
        <div class="content">
          <ul class="ul">
            <li class="li" v-for="it in list">
              <a :href="linkFormat(it)" class="box" target="_blank">
                <div class="pic"><img v-if="it.picUrl" class="img" :src="it.picUrl"></div>
                <div class="con">
                  <div v-if="it.companyName" class="title"><span v-if="it.companyType" class="tip">{{ it.companyType }}</span><span class="company">{{ it.companyName }}</span></div>
                  <div v-if="it.name" class="name">{{it.name}}</div>
                  <div v-if="it.seller" class="seller">{{it.seller}}</div>
                  <div v-if="it.email" class="email">{{it.email}}</div>
                  <div v-if="it.cellphone" class="text"><span class="formatPhone" data-sensors-click :data-phone="suzao.formatPhone(it.cellphone)"><i class="iconfont icon-icon_dianhua"></i>查看电话</span></div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
      `
  })

  // 替代
  Vue.component('chat-replace', {
    props: {
      item: {
        type: Object
      }
    },
    computed: {
      htmlString() {
        return this.item.htmlString
      },
      loading() {
        return this.item.transitionLoading
      }
    },
    inject: ['backBottom', 'backBottom2', 'renderStart', 'renderEnd', 'handleSearch'],
    created() {
      this.renderStart()
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.backBottom()
        this.renderEnd()
      },
      firstItemLine(item) {
        if (item.firstItemLine) {
          const compareObj = { uuid: item.lineUuId }
          let htmlString = ''
          item.firstItemLine.map(it => {
            if (it.itemValue) {
              compareObj[it.itemLabel] = it.itemValue
              htmlString += `<span class="${it.itemLabel}">${it.itemValue}</span>`
            }
          })
          return htmlString
        }
        return item
      },
      search(item) {
        const that = this
        this.backBottom2()
        let htmlString = ''
        if (item.firstItemLine) {
          item.firstItemLine.map(it => {
            if (it.itemValue) {
              htmlString += `${it.itemValue}`
            }
          })
        }
        setTimeout(() => {
          that.handleSearch({
            key: `找${htmlString}的替代材料`,
            queryType: 6,
            uuid: item.lineUuId
          })
        }, 300)
      }
    },
    template: `
      <div :class="item.className">
        <div class="tip">为了帮您推荐更精准的替代材料，请按提示选择完善的材料信息。</div>
        <div class="tip">您要找的是以下哪个牌号的替代材料，请选择：</div>
        <ul :class="{ul:true,open: item.foldingState}">
          <li class="li" v-for="(it,index) in item.ansLines" :key="index" @click="search(it)">{{index + 1}}. <span v-html="firstItemLine(it)"><span></li>
        </ul>
      </div>
      `
  })

  // 替代对比
  Vue.component('chat-replace-compare', {
    props: {
      item: {
        type: Object
      }
    },
    computed: {},
    inject: ['backBottom', 'renderStart', 'renderEnd', 'openReplaceDialog'],
    created() {
      this.renderStart()
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.backBottom()
        this.renderEnd()
      },
      firstItemLine(item) {
        if (item.firstItemLine) {
          return `${item.firstItemLine.zhname} ${item.firstItemLine.name} ${item.firstItemLine.sp_name} ${item.firstItemLine.p_base_gradeno}`
        }
        return item
      }
    },
    template: `
      <div :class="item.className" @click="openReplaceDialog(item)">
        点击查看<span class="title" v-html="firstItemLine(item)"></span>与替代牌号物性对比表
      </div>
      `
  })

  // 配料
  Vue.component('chat-formula', {
    props: {
      item: {
        type: Object
      }
    },
    computed: {},
    inject: ['backBottom', 'renderStart', 'renderEnd'],
    created() {
      this.renderStart()
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.backBottom()
        this.renderEnd()
      }
    },
    template: `
      <div :class="item.className">
        <div class="tip">{{item.ansShowTips || "材料配方"}}</div>
          <div v-for="(formulas,index) in item.formulas" class="formulas" :key="index">
        <div class="title"><span>{{formulas.name}}</span></div>
        <el-table :data="formulas.items" border size="mini">
          <el-table-column prop="name" label="材料种类"></el-table-column>
          <el-table-column prop="dataPlasticList" label="材料名称">
          <template slot-scope="{row}">
            <div v-for="dataPlastic in row.dataPlasticList" class="plastic" :key="dataPlastic.id"><el-link :href="'/plastic/detail?id=' + dataPlastic.uuid" target="_blank">{{dataPlastic.gradeno}}</el-link></div>
          </template>
          </el-table-column>
          <el-table-column prop="ratio" label="配比%">
            <template slot-scope="{row}">{{row.ratio||0}}%</template>
          </el-table-column>
        </el-table>
      </div>
      `
  })
})
