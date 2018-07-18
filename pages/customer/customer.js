const network = require('../../common/newwork.js')
Page({
  data: {
    customerList: null
  },
  onLoad: function (options) {
    network.POST('/giftRecord/getGiftRecordList', {
      pageNo: 1,
      pageSize: 10,
      agentMemberId: wx.getStorageSync('token')
    }).then(res => {
      if (res.statusCode === 200) {
        this.setData({
          customerList: res.data.list
        })
      }
    })
  },
  lookCustomerList() {
    wx.navigateTo({
      url: '../customer-list/customer-list'
    })
  }
})