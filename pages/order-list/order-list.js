const network = require('../../common/newwork.js')
Page({
  data: {
    currentType: '',
    orderList: [],
    noMore: false,
    pageNo: 1
  },
  onLoad (options) {
    this.setData({
      currentType: options.type
    })
  },
  onShow: function () {
    this.setData({
      pageNo: 1,
      orderList: []
    })
    this.getOrderList()
  },
  getOrderList () {
    network.POST('/purchaseOrder/getPurchaseOrderList', {
      agentMemberId: wx.getStorageSync('token'),
      orderState: this.data.currentType,
      pageNo: this.data.pageNo,
      pageSize: 10
    }).then(res => {
      wx.hideLoading()
      if (res.statusCode === 200) {
        if (res.data.list.length === 0) {
          this.setData({
            noMore: true
          })
          return
        }
        let list = this.data.orderList
        list.push(...res.data.list)
        this.setData({
          orderList: list
        })
      }
    })
  },
  changeOrderType (e) {
    this.setData({
      currentType: e.currentTarget.dataset.type,
      pageNo: 1,
      noMore: false,
      orderList: []
    })
    this.getOrderList()
  },
  goOrderDetail (e) {
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../order-type-detail/order-type-detail?purchaseOrderId=' + this.data.orderList[index].purchaseOrderId
    })
  },
  confirmCancel (e) {
    let index = e.currentTarget.dataset.index
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    network.POST('/purchaseOrder/cancelPurchaseOrder', {
      agentMemberId: wx.getStorageSync('token'),
      purchaseOrderId: this.data.orderList[index].purchaseOrderId
    }).then(res => {
      wx.hideLoading()
      if (res.statusCode === 200) {
        wx.showToast({
          title: '取消成功',
          duration: 1000
        })
        this.getOrderList()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    }).catch(err => {
      wx.hideLoading()
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
  },
  onReachBottom() {
    if (this.data.noMore) {
      return
    }
    wx.showLoading({
      title: '玩命加载中'
    })
    this.setData({
      pageNo: this.data.pageNo + 1
    })
    this.getOrderList()
  }
})