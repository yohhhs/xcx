const network = require('../../common/newwork.js')
Page({
  data: {
    userDetail: null,
    userAvatar: '',
    notPayOrder: 0,
    notSendOrder: 0,
    notReceiveOrder: 0
  },
  onLoad () {
    this.setData({
      userAvatar: wx.getStorageSync('avatar'),
      userName: wx.getStorageSync('nickName')
    })
  },
  onShow: function () {
    network.POST('/member/getMemberInfo', {
      memberId: wx.getStorageSync('token')
    }).then(res => {
      if (!res.data.mobile) {
        wx.redirectTo({
          url: '../bind-phone/bind-phone',
        })
      }
      this.setData({
          userDetail: res.data
      })
    })
    network.POST('/purchaseOrder/getOrderCount', {
      memberId: wx.getStorageSync('token')
    }).then(res => {
      if (res.statusCode === 200) {
        this.setData({
          notPayOrder: res.data.countState1,
          notSendOrder: res.data.countState2,
          notReceiveOrder: res.data.countState3 + res.data.countState5 
        })
      }
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
  },
  goAddressList () {
    wx.navigateTo({
      url: '../address-list/address-list',
    })
  }
})