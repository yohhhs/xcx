const network = require('../../common/newwork.js')
Page({
  data: {
    orderDetail: null
  },
  onLoad: function (options) {
    this.setData({
      orderDetail: JSON.parse(option.orderData)
    })
  }
})