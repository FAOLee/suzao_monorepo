addEventListener('load', () => {
  Vue.component('become-form', {
    props: {
      formData: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      const validatePhone = function (rule, value, callback) {
        var landlineRegex = /^(0\d{2,3})-?(\d{7,8})$/
        var phoneRegex = /^1(\d{10})$/
        if (landlineRegex.test(value) || phoneRegex.test(value)) {
          callback()
        } else {
          callback(new Error('请填写正确的号码'))
        }
      }
      return {
        // 申请成为商家
        becomeRules: {
          name: [
            {
              required: true,
              trigger: 'blur',
              message: '请填写姓名'
            }
          ],
          phone: [
            {
              required: true,
              trigger: 'blur',
              message: '请填写电话号码'
            },
            {
              trigger: 'blur',
              validator: validatePhone
            }
          ]
        },
        initBecomeType: [],
        hasExtra: {},
        initBecomeForm: {
          name: '',
          phone: '',
          companyName: '',
          type: 22,
          typeName: '',
          dealerBrand: '',
          enterpriseType: 1 // 1.代理商 2.研发系统
        },
        becomeForm: {},
        loading: false
      }
    },
    watch: {
      'becomeForm.enterpriseType': {
        handler(newVal, oldVal) {
          if (newVal === 2) {
            this.initBecomeForm.type = 20
            this.becomeForm.type = 20
          } else if (newVal === 1) {
            this.initBecomeForm.type = 22
            this.becomeForm.type = 22
          }
        },
        immediate: true
      }
    },
    computed: {
      becomeType() {
        return this.initBecomeType.filter(item => {
          if (this.becomeForm.enterpriseType === 2 && item.id === 22) {
            return false
          }
          return item
        })
      }
    },
    created() {
      this.init()
    },
    methods: {
      init(becomeForm) {
        if (becomeForm && Object.prototype.toString.call(becomeForm) === '[object Object]') {
          this.becomeForm = Object.assign({}, this.initBecomeForm, becomeForm)
        } else {
          this.initData()
        }
      },
      initData() {
        this.becomeForm = Object.assign({}, this.initBecomeForm, this.formData)
      },
      geTypeList() {
        return new Promise((resolve, reject) => {
          if (this.initBecomeType.length) {
            return resolve()
          }
          fetch('/core/enterprise/geTypeList')
            .then(response => response.json())
            .then(({ code, data }) => {
              if (code === 101) {
                this.initBecomeType = data.filter(item => {
                  if (item.isDefault) {
                    this.initBecomeForm.type = item.id
                  }
                  if (item.hasExtra === 1) {
                    this.hasExtra[item.id] = item.plainText
                  }
                  return item
                })
                resolve()
              }
              reject()
            })
            .catch(error => {
              reject(error)
            })
        })
      },
      becomeOnSubmit() {
        this.$refs.becomeForm.validate(valid => {
          if (!valid) return
          var data = {}
          if (this.becomeForm.type !== 0 || (this.becomeForm.type === 0 && !this.becomeForm.typeName)) {
            // 1.不是其他 2.其他但是没有填
            this.becomeType.find(item => {
              if (item.id === this.becomeForm.type) {
                this.becomeForm.typeName = item.typeName
                return item
              }
            })
          }
          Object.entries(this.becomeForm).forEach(([key, value]) => {
            if (value !== '') {
              data[key] = value
            }
          })
          this.loading = true
          fetch('/core/enterprise/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then(response => response.json())
            .then(({ code }) => {
              this.loading = false
              if (code === 101) {
                this.$message({
                  type: 'success',
                  message: '提交成功'
                })
                this.$emit('submit', true)
                this.closeBecomeDialog()
              }
            })
            .catch(error => {
              this.loading = false
              console.error('Error:', error)
            })
        })
      },
      itemQuerySearch(queryString, cb) {
        // 调用 callback 返回建议列表的数据
        if (queryString.length < 2) {
          return cb([])
        }
        var formData = new URLSearchParams()
        formData.append('key', queryString)
        fetch('/vendor/autocompleteAddress?act=company', {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(({ status, data }) => {
            if (status === 1) {
              if (data.length === 0) {
                return cb([])
              }
              var arr = data.map(item => {
                return {
                  value: item
                }
              })
              return cb(arr)
            }
            return cb([])
          })
          .catch(error => {
            console.error('Error:', error)
            return cb([])
          })
      },
      closeBecomeDialog() {
        this.initData()
        this.$refs.becomeForm && this.$refs.becomeForm.clearValidate()
      }
    },
    template: `
      <el-form ref="becomeForm" :model="becomeForm" :rules="becomeRules">
        <el-form-item prop='name'>
          <el-input type="text" v-model="becomeForm.name" placeholder='请输入姓名'></el-input>
        </el-form-item>
        <el-form-item prop='phone'>
          <el-input type="text" v-model="becomeForm.phone" placeholder='请输入电话号码'></el-input>
        </el-form-item>
        <el-form-item prop='companyName'>
          <el-autocomplete style="width:100%" v-model="becomeForm.companyName" :fetch-suggestions="itemQuerySearch" :trigger-on-focus="false" placeholder="请输入公司名称"></el-autocomplete>
        </el-form-item>
        <el-form-item prop='type'>
          <el-radio-group v-model="becomeForm.type">
            <el-radio v-for='item in becomeType' :label="item.id" :key='item.id'>{{item.typeName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop='dealerBrand' v-if='becomeForm.type===22'>
          <el-input type="text" v-model="becomeForm.dealerBrand" :placeholder='hasExtra[22]'></el-input>
        </el-form-item>
        <el-form-item prop='typeName' v-if='becomeForm.type===0'>
          <el-input type="text" v-model="becomeForm.typeName" :placeholder='hasExtra[0]'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%"  class="suzao-btn" type="primary" :disabled="loading" @click="becomeOnSubmit">
            <slot>提交</slot>
          </el-button>
        </el-form-item>
      </el-form>
    `
  })
})
