// pages/give-auth/give-auth.js
Page({
  data: {
  
  },
  getUserInfo (detail) {
    if (detail.detail.userInfo) {
      console.log(detail.detail.userInfo.nickName)
      wx.setStorageSync('nickName', detail.detail.userInfo.nickName)
      wx.setStorageSync('avatar', detail.detail.userInfo.avatarUrl)
      wx.showToast({
        title: '授权成功',
        icon: 'none'
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../index/index'
        })
      }, 1500)
    } else {
      wx.showToast({
        title: '请授权否则无法使用',
        icon: 'none'
      })
    }
  },
})