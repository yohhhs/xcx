// pages/distribute/distribute.js
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

  sendGift() {
    wx.showModal({
      title: '提示',
      content: '确认后将会呈现活动二维码，并且从剩余数量中扣除1份礼品',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../active-code/active-code',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})