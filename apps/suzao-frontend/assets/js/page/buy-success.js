addEventListener('load', () => {
  const orderNo = suzao.paramObj('orderNo')
  new Vue({
    el: '#merchant-registration',
    data() {
      return {
        urlOrderList: '/member#/order-list',
        url: '/page/merchantRegistration',
        href: ''
      }
    },
    created() {
      this.href = orderNo ? `${this.url}?orderNo=${orderNo}` : `${this.url}`
    }
  })
})
