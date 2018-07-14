//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onLoad() {
    let token = wx.getStorageSync('token')
    if (token) {

    } else {
      wx.navigateTo({
        url: '../login/login'
      })
    }
    // wx.request({
    //   url: 'https://www.topasst.com/web/sms/send', //仅为示例，并非真实的接口地址
    //   data: {
    //     mobile: '18482130206',
    //     smsType: 2
    //   },
    //   method: 'POST',
    //   header: {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })
  },
  goShopDetail() {
    wx.navigateTo({
      url: '../shop-detail/shop-detail'
    })
  },
  addCart() {
    wx.showLoading({
      title: '正在加入购物车',
      mask: true
    })

    setTimeout(function(){
      wx.hideLoading()
      wx.showToast({
        title: '加入成功',
        icon: 'success',
        duration: 2000
      })
    },2000)
  },
  getuser(e) {
    console.log(e)
  }
})
