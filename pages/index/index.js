//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onLoad() {
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
  }
})
