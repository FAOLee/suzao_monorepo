import { CountUp } from '/js/countUp.min.js'
import Swiper from '/js/lib/swiper/swiper-bundle.esm.browser.min.js'
// import becomeForm from '/frontend/js/components/becomeForm.js'

addEventListener('load', () => {
  const attractingMerchants = new Vue({
    el: '#attracting-merchants',
    data() {
      const ver = `?ver=2025053001`
      const src = `/frontend/assets/page/attracting-merchants/`
      return {
        tabList: [
          {
            label: '代理商入驻',
            value: 'settled'
          },
          {
            label: '材料智能助手APP',
            value: 'app'
          }
        ],
        params: suzao.paramObj(),
        tab: 'settled',
        banner: null,
        paginationIndex: 0,
        swiper: null,
        settled: {
          name: 'settled',
          btn: {
            text: '了解入驻政策',
            href: 'tel:400-869-1788'
          },
          banner: {
            wap: `${src}banner-wap.png${ver}`,
            pc: `${src}banner.png${ver}`
          },
          'image-text1': {
            top: '入驻优势',
            title: `数字化精准营销 <span></span>触达海量品牌终端、制造企业`,
            text: '塑造运用先进的人工智能数字技术，帮助企业解开专业的流量密码，为材料供应商实现精准曝光，借助让用户无营销感知的营销方式获取更多订单机会，精准触达买卖双方，打破企业获客难困境。',
            bgImg: `${src}image-bg1.png${ver}`,
            image: [
              { className: 'image-top-1', src: `${src}image1-top-1.png${ver}` },
              { className: 'image-top-2', src: `${src}image1-top-2.png${ver}` },
              { className: 'image-top-3', src: `${src}image1-top-3.png${ver}` },
              { className: 'image-left-1', src: `${src}image1-left-1.png${ver}` },
              { className: 'image-left-2', src: `${src}image1-left-2.png${ver}` },
              { className: 'image-left-3', src: `${src}image1-left-3.png${ver}` },
              { className: 'image-right-1', src: `${src}image1-right-1.png${ver}` },
              { className: 'image-right-2', src: `${src}image1-right-2.png${ver}` },
              { className: 'image-right-3', src: `${src}image1-right-3.png${ver}` },
              { className: 'image-bottom-1', src: `${src}image1-bottom-1.png${ver}` }
            ]
          },
          'section-full': {
            title: '大厂家，大品牌，在塑造',
            p: '知名化工品牌，在塑造应有尽有',
            con: [
              {
                className: 'line_odd',
                img: `${src}loop-scrolling1.png${ver}`
              },
              {
                className: 'line_even',
                img: `${src}loop-scrolling2.png${ver}`
              },
              {
                className: 'line_odd',
                img: `${src}loop-scrolling3.png${ver}`
              },
              {
                className: 'line_even',
                img: `${src}loop-scrolling4.png${ver}`
              }
            ]
          },
          banner2: {
            title: '平台用户涵盖100多个行业',
            ul: [
              {
                className: 'col4',
                text: '改性厂'
              },
              {
                className: 'col4',
                text: '注塑厂'
              },
              {
                className: 'col4',
                text: '化工厂'
              },
              {
                className: 'col4',
                text: '板材'
              },
              {
                className: 'col4',
                text: '色母粒'
              },
              {
                className: 'col4',
                text: '汽车'
              },
              {
                className: 'col4',
                text: '智能穿戴'
              },
              {
                className: 'col4',
                text: '家电'
              },
              {
                className: 'col4',
                text: '电子电器'
              },
              {
                className: 'col4',
                text: '医疗器械'
              },
              {
                className: 'col4',
                text: '新能源'
              },
              {
                className: 'col4',
                text: '照明'
              },
              {
                className: 'col4',
                text: '食品包装'
              },
              {
                className: 'col4',
                text: '通讯'
              },
              {
                className: 'col4',
                text: '锂电'
              },
              {
                className: 'col4',
                text: '美妆'
              },
              {
                className: 'col4',
                text: '模具'
              },
              {
                className: 'col4',
                text: '航空航天'
              },
              {
                className: 'col4',
                text: '母婴用品'
              },
              {
                className: 'col4',
                text: '体育用品'
              },
              {
                className: 'col4',
                text: '医药'
              },
              {
                className: 'col4',
                text: '电线电缆'
              },
              {
                className: 'col4',
                text: '建筑建材'
              },
              {
                className: 'col4',
                text: '胶粘剂'
              },
              {
                className: 'col1',
                text: '生物降解、光伏、管材、厨房用品、包装耗材等企业用户'
              }
            ],
            bgImg: `${src}image-bg2.png${ver}`
          },
          list: {
            title: '典型的终端品牌用户',
            p: '更多应用行业的工程师、研发人员、采购人员，都在用塑造！',
            con: [
              { bgImg: `${src}list1.png${ver}` },
              { bgImg: `${src}list2.png${ver}` },
              { bgImg: `${src}list3.png${ver}` },
              { bgImg: `${src}list4.png${ver}` },
              { bgImg: `${src}list5.png${ver}` },
              { bgImg: `${src}list6.png${ver}` },
              { bgImg: `${src}list7.png${ver}` },
              { bgImg: `${src}list8.png${ver}` }
            ]
          },
          banner3: { title: '材料推荐算法，行业精准算法', p: '快速匹配行业用户，实现人找料，料找人', bgImg: `${src}image-bg3.png${ver}` },
          'image-text2': {
            title: `商家SAAS系统<span></span>产品、行业、用户等数据分析`,
            li: ['产品曝光量', '用户行业分布', '用户区域分布', '用户角色分类'],
            p: '专业数据，驱动商业决策',
            bgImg: `${src}image-bg4.png${ver}`
          },
          banner5: {
            title: `全时段营销<span></span>不遗漏每一个商机`,
            p1: '物性表与商家联系方式一体化展示，方便用户一键联系。',
            p2: '365天*24小时不间断营销，持续曝光，吸引更多目标客户群体',
            bgImg: `${src}image-bg5.png${ver}`
          },
          banner6: {
            wap: `${src}banner2-wap.png${ver}`,
            pc: `${src}banner2.png${ver}`,
            title: `入驻招募对象：<span></span>广告商、改性厂、代理商`,
            p: `新的一年，最新的入驻政策 转换轨道，<span></span>抢占2025先机！就在此刻！`,
            contact: '财富热线 400-869-1788'
          }
        },
        app: {
          name: 'app',
          btn: {
            text: '下载APP',
            href: '/mobile/sharePlasticDownZh?from=h5'
          },
          banner: {
            wap: `${src}banner-wap-app.png${ver}`,
            pc: `${src}banner-app.png${ver}`,
            text: '材料智能助手APP',
            title: '让客户没有难选的材料',
            downImg: `${src}app-download.png${ver}`
          },
          'image-text1': {
            title: `材料智能助手APP`,
            text: '全球领先的材料智能助手APP，结合先进的AI大模型技术，让客户没有难选的材料！我们不仅仅是一个材料选材工具，更是一个全方位的技术支持体系，从设计、选选材、制造到应用阶段，我们都将为客户提供专业，细致的技术支持。',
            bgImg: `${src}app1.png${ver}`
          },
          'image-text2': {
            title: `200000+全球塑料物性表`,
            li: ['全球1000+知名制造商品牌', '覆盖400+材料种类', '物性对比表免费下载'],
            bgImg: `${src}app2.png${ver}`
          },
          'image-text4': {
            title: `改性配方编辑器`,
            text: `对于改性塑料工程师，精确的材料配比和成本控制是关键。<span class='span'></span>我们的“改性塑料比重成本计算器”是您的完美解决方案：`,
            li: ['配方比重速算', '配方成本快速计算', '竞品配方逆向解析'],
            bgImg: `${src}app4.png${ver}`
          },
          'image-text5': {
            logoSrc: `/frontend/assets/share-logo.png${ver}`,
            logoTitle: CHAT_TEXT.app,
            slogan: CHAT_TEXT.slogan
          },
          swiper: {
            title: `智能精准搜索`,
            text: '助力材料技术研发应用',
            imgArr: [`${src}app-swiper-1.png${ver}`, `${src}app-swiper-2.png${ver}`, `${src}app-swiper-3.png${ver}`]
          }
        },
        loading: true
      }
    },
    methods: {
      init() {
        // this.initSwiper('#rndSwiper1')
        // this.initSwiperThumbs()
        this.initSwiper('#appSwiper')
        if (this.$refs.refBecomeForm) this.$refs.refBecomeForm.geTypeList()
      },
      tabChange(value) {
        this.loading = true
        if (value) {
          const isTab = this.tabList.find(item => {
            return item.value === value
          })
          if (isTab) {
            this.tab = value
            this.banner = this[value].banner
          }
          if (value === 'settled') {
            setTimeout(this.countUp)
          }
          suzao.changeURLStatic({ tab: value })
        }
        this.loading = false
      },
      openSettledDialog(becomeForm) {
        // 弹窗
        // if (window.openSettledDialog) {
        //   window.openSettledDialog(becomeForm)
        // }
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
      countUp() {
        // 数字滚动
        const numDom = document.querySelectorAll('.data-num')
        for (let i = 0; i < numDom.length; i++) {
          const dom = numDom[i]
          new CountUp(dom.id, dom.getAttribute('data-num'), {
            duration: 1
          }).start()
        }
      },
      initSwiper(id) {
        const swiper = new Swiper(id, {
          loop: true,
          autoplay: true, //可选选项，自动滑动
          noSwiping: false,
          pagination: {
            el: '.swiper-pagination'
          }
        })
      },
      initSwiperThumbs() {
        const that = this
        this.swiper = new Swiper('#rndSwiper2', {
          loop: true,
          autoplay: true, //可选选项，自动滑动
          noSwiping: false,
          pagination: {
            el: '.swiper-pagination'
          },
          on: {
            transitionStart(swiper) {
              that.paginationIndex = swiper.realIndex
            }
          }
        })
      },
      swiperSlideToLoop(index) {
        if (this.swiper) this.swiper.slideToLoop(index)
      }
    },
    created() {
      this.tabChange(this.params.tab || 'settled')
    },
    mounted() {
      this.init()
      this.backToTop()
    }
  })
})
