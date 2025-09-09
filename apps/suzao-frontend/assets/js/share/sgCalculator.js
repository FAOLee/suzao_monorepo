addEventListener('load', () => {
  function $fetch({ url, method, headers, body }) {
    return fetch(url, {
      method,
      headers: headers || {
        'X-Requested-With': 'XMLHttpRequest'
      },
      body
    }).then(response => response.json())
  }
  const app = new Vue({
    el: '#app',
    data() {
      return {
        historyItems: [],
        itemCount: 8
      }
    },
    created() {
      this.getData()
    },
    methods: {
      async getData() {
        const sp_str = suzao.paramObj('sp_str')
        if (sp_str) {
          try {
            const { data = [] } = await $fetch({
              url: '/member/getShareSgHistory?sp_str=' + sp_str,
              method: 'GET'
            })
            if (data.length) {
              this.historyItems = data.map(v => {
                v.log = JSON.parse(v.log)
                v.log.items = JSON.parse(v.log.items)
                var ratio = 0
                v.log.items.map(function (va) {
                  ratio += va.ratio
                  // if ((va.stuff + '').indexOf('$') === -1) {
                  //   va.stuff = app.stuffIdx[va.stuff]
                  // } else {
                  //   va.stuff = va.stuff.split('$')[0]
                  // }
                })
                v.log.ratio = ratio
                return v
              })
            }
          } catch (error) {
            console.error(error)
            location.href = '/'
          }
        }
      }
    }
  })
})
