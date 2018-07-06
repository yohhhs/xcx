// pages/shop-detail/shop-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  joinCart () {
    wx.showLoading({
      title: '正在加入购物车',
      mask: true
    })

    setTimeout(function () {
      wx.hideLoading()
      wx.showToast({
        title: '加入成功',
        icon: 'success',
        duration: 2000
      })
    }, 2000)
  }
})