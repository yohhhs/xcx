const network = require('../../common/newwork.js')
Page({
  data: {
    userDetail: null
  },
  onShow: function () {
      network.POST('/agentMember/getAgentMember', {
          agentMemberId: wx.getStorageSync('token')
      }).then(res => {
          this.setData({
              userDetail: res.data
          })
      })
  },
  changeTel () {
    wx.navigateTo({
      url: '../vali-phone/vali-phone?mobile=' + this.data.userDetail.mobile
    })
  },
  changeSale () {
    wx.navigateTo({
      url: '../change-sale/change-sale?saleDepartmentName=' + this.data.userDetail.saleDepartmentName
    })
  },
  goOrderList (e) {
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../order-list/order-list?type=' + type
    })
  },
  goSendGift () {
    wx.navigateTo({
      url: '../send-gift/send-gift',
    })
  }
})