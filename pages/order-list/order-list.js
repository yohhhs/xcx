const network = require('../../common/newwork.js')
Page({
  data: {
    currentType: '',
    orderList: []
  },
  onLoad (options) {
    this.setData({
      currentType: options.type
    })
  },
  onShow: function () {
    this.getOrderList()
  },
  getOrderList () {
    network.POST('/purchaseOrder/getPurchaseOrderList', {
      agentMemberId: wx.getStorageSync('token'),
      orderState: this.data.currentType
    }).then(res => {
      if (res.statusCode === 200) {
        this.setData({
          orderList: res.data
        })
      }
    })
  },
  changeOrderType (e) {
    this.setData({
      currentType: e.currentTarget.dataset.type
    })
    this.getOrderList()
  },
  goOrderDetail (e) {
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../order-type-detail/order-type-detail?purchaseOrderId=' + this.data.orderList[index].purchaseOrderId
    })
  }
})