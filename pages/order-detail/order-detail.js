const network = require('../../common/newwork.js')
Page({
  data: {
    orderDetail: null,
    isPay: false
  },
  onLoad: function (options) {
    this.setData({
      orderDetail: JSON.parse(options.orderData)
    })
  },
  confirmPay () {
    console.log(111)
    this.setData({
      isPay: true
    })
    wx.showLoading({
      mask: true
    })
    let orderList = this.data.orderDetail.orderList
    let ids = []
    orderList.forEach(item => {
      ids.push(item.purchaseOrderId)
    })
    network.POST('/wxPay/wxPay', {
      agentMemberId: wx.getStorageSync('token'),
      purchaseOrderIds: ids.toString(),
      totalMoney: '0.1'
    }).then(res => {
      if (res.statusCode === 200) {
        console.log(res)
        // wx.requestPayment({
        //   'timeStamp': '',
        //   'nonceStr': '',
        //   'package': '',
        //   'signType': 'MD5',
        //   'paySign': '',
        //   'success': function (res) {
        //   },
        //   'fail': function (res) {
        //   }
        // })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  }
})