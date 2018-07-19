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
  },
  confirmPay(e) {
    let index = e.currentTarget.dataset.index
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    network.POST('/wxPay/wxPay', {
      agentMemberId: wx.getStorageSync('token'),
      purchaseOrderIds: this.data.orderList[index].purchaseOrderId,
      totalMoney: this.data.orderList[index].totalMoney
    }).then(res => {
      wx.hideLoading()
      if (res.statusCode === 200) {
        console.log(res)
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.packageStr,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': (res) => {
            wx.showToast({
              title: '支付成功',
              duration: 1000
            })
            this.orderList()
          },
          'fail': res => {
            if (res.errMsg == 'requestPayment:fail cancel') {
              wx.showToast({
                title: '支付取消',
                icon: 'none',
                duration: 1000
              })
            } else {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 1000
              })
            }
            this.setData({
              isPay: false
            })
          },
          'complete': res => {
            if (res.errMsg == 'requestPayment:fail cancel') {
              wx.showToast({
                title: '支付取消',
                icon: 'none',
                duration: 1000
              })
            }
            this.setData({
              isPay: false
            })
          }
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        this.setData({
          isPay: false
        })
      }
    }).catch(err => {
      wx.hideLoading()
    })
  }
})