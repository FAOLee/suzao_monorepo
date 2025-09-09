addEventListener('load', () => {
  // 定义一个名为 "byShare" 的新组件
  Vue.component('by-share', {
    props: {
      className: {
        type: String,
        default: 'pc'
      },
      item: {
        type: Object
      }
    },
    mounted: function() {
      this.insertCSS('/frontend/css/components/byShare.css?ver=20231225')
      this.countHighlight('view')
    },
    methods: {
      // 判断点击来源
      clickToLink(item) {
        if (item.link && item.link.indexOf('/page/technologyAndSupport?tab=advertise') > -1) {
          this.uploadClick({
            buttonName: '广告招商'
          })
        }
        this.countHighlight('click')
      },
      // 统计点击
      uploadClick(data) {
        return fetch('/core/Click/upload', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      },
      // 统计浏览
      countHighlight(type) {
        suzao.countHighlight(this.item.hash, type)
      },
      // 引入css
      insertCSS(cssHref) {
        if (document.getElementById('insertCSS')) return
        var link = document.createElement('link')
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.id = 'insertCSS'
        link.href = cssHref
        document.head.appendChild(link)
      }
    },
    template:
      '<a v-if="item.link" :class="\'by-share \' + className" :href="item.link" target="_blank" @click="clickToLink(item)">' +
      '<div class="title">{{item.title}}</div>' +
      '<div class="img">' +
      '<template v-for="(it,ind) in item.video">' +
      '<video :src="it.url" x5-playsinline="true" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" x5-video-orientation="portraint" style="object-fit: contain;" :poster="item.image[ind].url" muted autoplay loop></video>' +
      '</template>' +
      '<template v-for="it in item.image">' +
      '<img :src="it.url" :alt="item.name">' +
      '</template>' +
      '</div>' +
      '</a>' +
      '<div :class="\'by-share \' + className" v-else @click="clickToLink(item)">' +
      '<div class="title">{{item.title}}</div>' +
      '<div class="img">' +
      '<template v-for="(it,ind) in item.video">' +
      '<video :src="it.url" x5-playsinline="true" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" x5-video-orientation="portraint" style="object-fit: contain;" :poster="item.image[ind].url" muted autoplay loop></video>' +
      '</template>' +
      '<template v-for="it in item.image">' +
      '<img :src="it.url" :alt="item.title">' +
      '</template>' +
      '</div>' +
      '</div>'
  })
})
