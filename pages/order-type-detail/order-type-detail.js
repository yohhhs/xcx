const network = require('../../common/newwork.js')
Page({
  data: {
    orderDetail: null,
    isPay: false
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
  },
  confirmPay() {
    this.setData({
      isPay: true
    })
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    network.POST('/wxPay/wxPay', {
      agentMemberId: wx.getStorageSync('token'),
      purchaseOrderIds: this.data.orderDetail.purchaseOrderId,
      totalMoney: this.data.orderDetail.totalMoney
    }).then(res => {
      wx.hideLoading()
      if (res.statusCode === 200) {
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
            wx.navigateBack()
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