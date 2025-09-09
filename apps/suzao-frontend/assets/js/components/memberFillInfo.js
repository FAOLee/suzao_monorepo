addEventListener('load', () => {
  // 定义一个名为 "member-fill-info" 的新组件
  Vue.component('member-fill-info', {
    props: {
      member_sup: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    inject: ['callback'],
    data: function () {
      return {
        memberIndustry: [],
        randomKey: Math.random(),
        formData: {
          industry: [],
          name: '',
          company: ''
        },
        loading: false
      }
    },
    created: function () {
      this.randomKey = Math.random()
      this.getMemberIndustry()
      // suzao.insertCSS()
    },
    methods: {
      submitForm: function () {
        var that = this
        this.$refs['refMemberFillInfo'].validate(function (valid) {
          if (!valid) return
          if (!that.formData.industry.length && !that.formData.company && !that.formData.name) return
          var formData = new FormData()
          if (that.member_sup.includes(1) && that.formData.industry.length) formData.append('industry', that.formData.industry.join(','))
          if (that.member_sup.includes(2) && that.formData.company) formData.append('company', that.formData.company)
          if (that.member_sup.includes(3) && that.formData.name) formData.append('name', that.formData.name)
          that.loading = true
          axios({
            url: '/member/fillInfo',
            method: 'post',
            data: formData,
            params: { scene: 'apply' }
          })
            .then(function (res) {
              if (res.data && res.data.status === 1) {
                that.$message({
                  type: 'success',
                  message: '保存成功!'
                })
                that.callback()
              }
            })
            .catch(function (error) {
              console.log(error)
            })
            .finally(function () {
              that.loading = false
            })
        })
      },
      itemQuerySearch: function (queryString, cb) {
        // 调用 callback 返回建议列表的数据
        if (queryString.length < 2) {
          return
        }
        var formData = new URLSearchParams()
        formData.append('key', queryString)
        axios({
          url: '/vendor/autocompleteAddress',
          method: 'post',
          data: formData,
          params: { act: 'company' }
        })
          .then(function (res) {
            if (res.status === 200) {
              var data = res.data
              if (data.status === 1) {
                if (data.data.length === 0) {
                  return cb([])
                }
                var arr = data.data.map(function (item) {
                  return {
                    value: item
                  }
                })
                return cb(arr)
              }
            }
            return cb([])
          })
          .catch(function (error) {
            cb([])
          })
      },
      // 获取行业
      getMemberIndustry: function () {
        var that = this
        if (this.memberIndustry.length) return
        axios({ url: '/vendor/getMemberIndustry' }).then(function (data) {
          if (data.data && data.data.status === 1) that.memberIndustry = data.data.data
        })
      }
    },
    template:
      '<div class="form-content">' +
      '<div class="title">' +
      CHAT_TEXT.formTitle +
      '</div>' +
      '<div class="tip">' +
      CHAT_TEXT.formTip +
      '</div>' +
      '<el-row :gutter="30" type="flex">' +
      '<el-form :model="formData" ref="refMemberFillInfo" :key="randomKey" v-loading="loading">' +
      '<el-col :span="24">' +
      '<el-form-item v-if="member_sup.includes(3)" prop="name">' +
      '<el-input v-model="formData.name" placeholder="请输入姓名"></el-input>' +
      '</el-form-item>' +
      '</el-col>' +
      '<el-col :span="24">' +
      '<el-form-item v-if="member_sup.includes(1)" prop="industry">' +
      '<el-select style="width:100%" v-model="formData.industry" filterable placeholder="请输入应用行业" clearable default-first-option allow-create multiple collapse-tags>' +
      '<el-option v-for="(it, ind) in memberIndustry" :key="ind" :label="it" :value="it"></el-option>' +
      '</el-select>' +
      '</el-form-item>' +
      '</el-col>' +
      '<el-col :span="24">' +
      '<el-form-item v-if="member_sup.includes(2)" prop="company">' +
      '<el-autocomplete style="width:100%" v-model="formData.company" :fetch-suggestions="itemQuerySearch" :trigger-on-focus="false" placeholder="请输入公司"></el-autocomplete>' +
      '</el-form-item>' +
      '</el-col>' +
      '<el-col :span="24">' +
      '<el-form-item>' +
      '<el-button type="primary" class="color-btn suzao-btn" @click="submitForm">确认</el-button>' +
      '</el-form-item>' +
      '</el-col>' +
      '</el-form>' +
      '</el-row>' +
      '</div>'
  })
})
