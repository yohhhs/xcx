// pages/give-auth/give-auth.js
Page({
  data: {
  
  },
  getUserInfo (detail) {
    if (detail.detail.userInfo) {
      wx.setStorageSync('nickName', detail.detail.userInfo.nickName)
      wx.setStorageSync('avatar', detail.detail.userInfo.avatarUrl)
      wx.switchTab({
        url: '../index/index'
      })
      wx.showToast({
        title: '授权成功',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '请授权否则无法使用',
        icon: 'none'
      })
    }
  },
})