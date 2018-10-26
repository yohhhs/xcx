const network = require('../../common/newwork.js')
Page({
  data: {
    addressList: []
  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.getAddressList()
  },
  getAddressList () {
    network.POST('/memberAddress/getMemberAddressList', {
      memberId: wx.getStorageSync('token')
    }).then(res => {
      if (res.statusCode === 200) {
        this.setData({
          addressList: res.data
        })
      }
    })
  },
  goAddAddress () {
    wx.navigateTo({
      url: '../add-address/add-address',
    })
  }
})