const network = require('../../common/newwork.js')
Page({
  data: {
    userDetail: null
  },
  onShow: function () {
      network.POST('/agentMember/getAgentMember', {
          agentMemberId: wx.getStorageSync('token')
      }).then(res => {
        console.log(res)
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
  changeSale () {}
})