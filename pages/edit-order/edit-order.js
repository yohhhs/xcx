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
    this.getDefaultAddress()
  },
  getDefaultAddress () {
    network.POST('/memberAddress/getMemberDefaultAddress', {
      memberId: wx.getStorageSync('token')
    }).then(res => {
      if (res.statusCode === 200) {
        this.setData({
          addressDetal: res.data
        })
      }
    })
  },
  goAddressList () {
    wx.navigateTo({
      url: '../address-list/address-list',
    })
  }
})