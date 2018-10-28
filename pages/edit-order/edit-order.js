const network = require('../../common/newwork.js')
Page({
  data: {
    orderDetail: null,
    addressDetail: null,
    totalMoney: 0,
    totalCount: 0
  },
  onLoad: function (options) {
    let orderDetail = JSON.parse(options.orderData)
    let totalMoney = 0
    let totalCount = 0
    orderDetail.forEach(item => {
      totalCount += item.count
      totalMoney = (totalMoney * 100 + item.salePrice * 100 * item.count) / 100
    })
    this.setData({
      orderDetail,
      totalCount,
      totalMoney
    })
  },
  onShow () {
    if (!this.data.addressDetail) {
      this.getDefaultAddress()
    }
  },
  getDefaultAddress () {
    network.POST('/memberAddress/getMemberDefaultAddress', {
      memberId: wx.getStorageSync('token')
    }).then(res => {
      if (res.statusCode === 200) {
        this.setData({
          addressDetail: res.data
        })
      }
    })
  },
  goAddressList () {
    wx.navigateTo({
      url: '../address-list/address-list?hasClick=1',
    })
  },
  confirmPay () {
    if (!this.data.addressDetail) {
      wx.showToast({
        title: '请添加收货地址',
        icon: 'none'
      })
      return false
    }
    wx.showLoading({
      title: '',
      mask: true
    })
    let ids = []
    this.data.orderDetail.forEach(item => {
      ids.push(item.shoppingCartId)
    })
    network.POST('/purchaseOrder/addPurchaseOrder', {
      memberId: wx.getStorageSync('token'),
      shoppingCartIds: ids.toString(),
      memberAddressId: this.data.addressDetail.memberAddressId
    }).then(res => {
      wx.hideLoading()
      if (res.statusCode === 200) {
        let orderData = JSON.stringify(res.data)
        wx.redirectTo({
          url: '../order-detail/order-detail?orderData=' + orderData
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '请求失败',
        icon: 'none'
      })
    })
  }
})