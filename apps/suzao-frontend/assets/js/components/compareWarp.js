addEventListener('load', () => {
  Vue.component('compare-warp', {
    props: {
      compareList: {
        default: () => [],
        type: Array
      }, // 对比
      compareMax: {
        default: 5,
        type: Number
      }
    },
    data() {
      return {
        compareDialog: false, // 对比框
        hrefCompare: '', // 对比链接
        compareCoordinate: { x: 0, y: 0 }
      }
    },
    watch: {
      compareList: {
        handler(newVal, oldVal) {
          localStorage.setItem('compareList', JSON.stringify(newVal))
          if (newVal.length >= 2) {
            this.openCompareDialog()
          } else {
            this.hrefCompare = ''
          }
          this.toggleCompareWarp(Boolean(newVal.length))
        },
        immediate: true,
        deep: true
      }
    },
    computed: {
      drawerData() {
        return this.compareList.map(item => {
          const tmp = item.split('|')
          return { name: tmp[1], uuid: tmp[0] }
        })
      },
      outViewsShow() {
        return !Boolean(this.hrefCompare)
      }
    },
    methods: {
      // 对比弹窗
      openCompareDialog() {
        const formData = new FormData()
        const params = {}
        const adv_compare_id = []
        const idArr = this.compareList.map(item => {
          const splitArr = item.split('|')
          if (splitArr[2]) adv_compare_id.push(splitArr[2])
          return splitArr[0]
        })
        if (adv_compare_id.length) {
          params['adv_compare_id'] = [...new Set(adv_compare_id)].join(',')
        }

        formData.append('id', idArr.join(','))
        axios({
          url: '/plastic/getCompareCode',
          method: 'post',
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: formData
        }).then(({ data }) => {
          if (data.status === 1 && data.data.can_view === 1) {
            params['code'] = data.data.code
            this.hrefCompare = '/plastic/compareV2?' + new URLSearchParams(params).toString()
          }

          if (data.code === 5007) {
            this.$message({
              type: 'error',
              message: '物性对比为付费功能，' + data.msg,
              customClass: 'z-index-max'
            })
            window.openMemberInterest()
          }
        })
      },
      // 删除对比
      removeCompare(idx) {
        this.$emit('remove-compare', idx)
      },
      // 对比大小切换
      toggleCompareWarp: function (flag) {
        this.compareDialog = flag
        if (this.$refs.compareWarp) {
          this.$refs.compareWarp.style.transition = 'transform 0.4s, width 0.4s'
          if (flag) {
            this.$refs.compareWarp.style.transform = 'translate(' + this.compareCoordinate.x + 'px, ' + this.compareCoordinate.y + 'px)'
          } else {
            this.$refs.compareWarp.style.removeProperty('transform')
          }
          setTimeout(() => {
            this.$refs.compareWarp.style.transition = 'none'
          }, 400)
        }
      }
    },
    directives: {
      drag: {
        // 指令的定义
        inserted(el, binding, VNode) {
          var initialMouseX = 0
          var initialMouseY = 0
          var initialTranslateX = 0
          var initialTranslateY = 0
          var isDragging = false
          const that = VNode.context // component => this  || binding.def // parent
          el.addEventListener('mousedown', e => {
            isDragging = true && that.compareDialog && !e.target.classList.contains('icon')
            initialMouseX = e.clientX
            initialMouseY = e.clientY

            var transformMatrix = getComputedStyle(el).transform
            if (transformMatrix !== 'none') {
              var matrixValues = transformMatrix.match(/matrix.*\((.+)\)/)[1].split(', ')
              initialTranslateX = parseFloat(matrixValues[4])
              initialTranslateY = parseFloat(matrixValues[5])
            }

            el.style.cursor = 'grabbing'
          })

          document.addEventListener('mousemove', e => {
            if (!isDragging) return
            var offsetX = e.clientX - initialMouseX
            var offsetY = e.clientY - initialMouseY
            var newX = initialTranslateX + offsetX
            var newY = initialTranslateY + offsetY
            that.compareCoordinate = { x: newX, y: newY }
            el.style.transform = 'translate(' + newX + 'px, ' + newY + 'px)'
          })

          document.addEventListener('mouseup', () => {
            isDragging = false
            el.style.cursor = 'grab'
          })

          document.addEventListener('mouseleave', () => {
            isDragging = false
            el.style.cursor = 'grab'
          })
        }
      }
    },
    template: `
    <div class="compare-warp" v-drag ref="compareWarp" v-show="compareList.length">
      <div class="compare-table" v-if='compareDialog'>
        <div class="header"><span>物性对比</span> <i class="el-icon-close" @click='toggleCompareWarp(false)'></i></div>
        <el-table :data="drawerData" :show-header="false" style="width: 100%">
          <el-table-column prop="name"></el-table-column>
          <el-table-column width='32' class-name="delete">
            <template slot-scope="scope">
              <i class="icon el-icon-delete" @click="removeCompare(scope.$index)"></i>
            </template>
          </el-table-column>
        </el-table>
        <div class="compare-footer">
          <el-button @click="removeCompare()">清空</el-button>
          <el-link class="btn btnLink" v-if="outViewsShow" :underline="false" disabled>对比</el-link>
          <el-link class="btn btnLink" v-else :underline="false" :href="hrefCompare" :disabled="compareList.length < 2" target='_blank'>对比</el-link>
        </div>
      </div>
      <div class="compare-thumbnail" @click='toggleCompareWarp(true)' v-else>
        对比 <span class="num">{{compareList.length}}</span>
      </div>
    </div>
    `
  })
})
