addEventListener('load', () => {
  Vue.component('compare-warp-replace', {
    props: {
      compareList: {
        default: () => [],
        type: Array
      }, // 对比
      compareMax: {
        default: 5,
        type: Number
      },
      active: {
        default: () => {},
        type: Object
      }
    },
    data() {
      return {
        hrefCompare: '', // 对比链接
        compareCoordinate: { x: 0, y: 0 },
        checkList: []
      }
    },
    watch: {
      checkList: {
        handler(newVal, oldVal) {
          if (newVal.length >= 1) {
            this.openCompareDialog()
          } else {
            this.hrefCompare = ''
          }
        },
        immediate: true,
        deep: true
      }
    },
    computed: {
      drawerData() {
        return this.compareList.map(this.transformation)
      },
      outViewsShow() {
        return !Boolean(this.hrefCompare)
      }
    },
    methods: {
      transformation(obj) {
        // const firstItemLine = { uuid: obj.lineUuId }
        // if (obj.firstItemLine) {
        //   obj.firstItemLine.map(item => {
        //     firstItemLine[item.itemLabel] = item.itemValue
        //   })
        // }
        // return firstItemLine
        if (obj.firstItemLine) return obj.firstItemLine
        return obj
      },
      // 对比弹窗
      openCompareDialog() {
        const formData = new FormData()
        const params = {}
        const active = this.active
        formData.append('id', active.uuid + ',' + this.checkList.join(','))
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
        })
      },
      closeCompareDialog() {
        this.$emit('close-replace-dialog', '')
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
            isDragging = true && that.active && !e.target.classList.contains('icon')
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
    <div class="compare-warp-replace" v-drag ref="compareWarp">
      <div class="compare-table" v-if='active.uuid'>
        <div class="header"><span>物性对比</span> <i class="el-icon-close" @click='closeCompareDialog'></i></div>
        <div class="compare-content">      
          <div class="el-checkbox-group">
            <el-checkbox :value="true">
              <span v-if="active.firstItemLine.zhname" class="zhname">{{active.firstItemLine.zhname}}</span>
              <span v-if="active.firstItemLine.name" class="name">{{active.firstItemLine.name}}</span>
              <span v-if="active.firstItemLine.sp_name" class="sp_name">{{active.firstItemLine.sp_name}}</span>
              <span v-if="active.firstItemLine.p_base_gradeno" class="p_base_gradeno">{{active.firstItemLine.p_base_gradeno}}</span>
            </el-checkbox>
          </div>
          <div class="checkbox-title">替代牌号</div>
          <el-checkbox-group v-if="drawerData" v-model="checkList" :max="compareMax - 1">
            <el-checkbox v-for="it in drawerData" :key="it" :label="it.uuid">
              <span v-if="it.zhname" class="zhname">{{it.zhname}}</span>
              <span v-if="it.name" class="name">{{it.name}}</span>
              <span v-if="it.sp_name" class="sp_name">{{it.sp_name}}</span>
              <span v-if="it.p_base_gradeno" class="p_base_gradeno">{{it.p_base_gradeno}}</span>
            </el-checkbox>
          </el-checkbox-group>
          <div class="compare-footer">
            <el-popover
              v-if="outViewsShow"
              class="db"
              placement="top-start"
              content="请选择2个以上牌号"
              width="260"
              trigger="hover">
              <el-button class="btn btnLink" :underline="false" slot="reference">请选择2个以上牌号</el-button>
            </el-popover>            
            <el-link v-else :underline="false" :href="hrefCompare" :disabled="checkList.length < 1" class="btn btnLink" target='_blank'>对比({{ checkList.length + 1}})</el-link>
          </div>
        </div>
      </div>
    </div>
    `
  })
})
