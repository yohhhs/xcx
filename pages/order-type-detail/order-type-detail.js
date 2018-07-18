const network = require('../../common/newwork.js')
Page({
  data: {
    orderDetail: null
  },
  onLoad: function (options) {
    network.POST('/purchaseOrder/getPurchaseOrderDetail', {
      agentMemberId: wx.getStorageSync('token'),
      purchaseOrderId: options.purchaseOrderId
    }).then(res => {
      if (res.statusCode === 200) {
        this.setData({
          orderDetail: res.data
        })
      }
    })
  }
})