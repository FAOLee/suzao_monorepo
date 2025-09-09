addEventListener('load', () => {
  new Vue({
    el: '#memberRedemption',
    data() {
      // 兑换码已过期 // 兑换码有误
      return {
        form: {
          exchangeCode: ''
        },
        rules: {
          exchangeCode: [{ required: true, message: '兑换码必填', trigger: 'input' }]
        }
      }
    },
    created() {},
    methods: {
      exchangeVip() {
        const formData = new FormData()
        formData.append('exchangeCode', this.form.exchangeCode)
        return new Promise((resolve, reject) => {
          fetch('/core/vipTrade/exchangeVip', {
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            },
            method: 'POST',
            body: formData
          })
            .then(response => response.json())
            .then(resolve)
            .catch(reject)
        })
      },
      submitForm() {
        this.$refs['formRef'].validate(async valid => {
          if (valid) {
            const { code, msg } = await this.exchangeVip()
            if (code === 101) {
              this.$message({
                type: 'success',
                message: msg
              })
              this.form.exchangeCode = ''
              return
            }
            this.handleApiError(msg)
          } else {
            return false
          }
        })
      },
      handleApiError(errorMessage) {
        this.$refs.formRef.validateField('exchangeCode', errors => {
          if (!errors) {
            this.$refs.formRef.fields.forEach(field => {
              if (field.prop === 'exchangeCode') {
                field.validateMessage = errorMessage
                field.validateState = 'error'
              }
            })
          }
        })
      }
    }
  })
})
