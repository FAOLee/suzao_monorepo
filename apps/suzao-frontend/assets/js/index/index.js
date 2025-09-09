var app = new Vue({
  el: '#app',
  data: {
    tipList: [],
    aiHomeQueryList: [],
    search: '',
    num: 6, // 每页6个
    tableData: [],
    loading: false
  },
  created: function () {
    this.init()
  },
  methods: {
    init: function () {
      if (this.loading) return
      var that = this
      this.loading = true
      this.getAiHomeQueryList().then(function () {
        that.formatList(that.aiHomeQueryList)
        that.loading = false
      })
    },
    // 聊天联想
    querySearch: function (queryString, cb) {
      // 调用 callback 返回建议列表的数据
      $axios({
        url: '/core/dm/botAPI/getSearchSuggest',
        method: 'get',
        params: {
          queryKey: queryString
        }
      })
        .then(function (res) {
          if (res.code === 101) {
            var data = res.data.map(function (item) {
              return {
                value: item
              }
            })
            cb(data)
          } else {
            cb([])
          }
        })
        .catch(function (error) {
          cb([])
        })
    },
    getAiHomeQueryList: function () {
      return new Promise((resolve, reject) => {
        var that = this
        this.aiHomeQueryList = []
        $axios({
          url: '/core/dm/botAPI/aiHomeQuery',
          method: 'get'
        })
          .then(function (res) {
            if (res.code === 101) {
              res.data.forEach(function (item) {
                if (item.type === 1) {
                  that.aiHomeQueryList.push(item.content)
                } else if (item.type === 4) {
                  that.tipList.push(item.content)
                }
              })
            }
            resolve()
          })
          .catch(function (error) {
            reject(error)
          })
      })
    },
    handleSelect: function (text) {
      // 跳转到登录
      location.href = '/login?refer=' + encodeURIComponent('/plastic/ai?question=' + text)
    },
    formatList: function (data) {
      var that = this
      // 格式化数据
      // 每6条一页 共多少页
      this.tableData = []
      if (data.length === 0) {
        return
      }
      data.forEach(function (item, index) {
        if (index % 6 === 0) {
          that.tableData.push([])
        }
        var i = Math.floor(index / 6)
        that.tableData[i].push(item)
      })
    }
  }
})
