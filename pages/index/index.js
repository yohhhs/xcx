//index.js
//获取应用实例
const app = getApp()
const network = require('../../common/newwork.js')
Page({
  data: {
    giftList: [],
    isRequest: false
  },
  onLoad() {
    // wx.login({
    //   success: function (res) {
    //     wx.setClipboardData({
    //       data: res.code,
    //       success: function (res) {
    //         console.log(1)
    //       }
    //     })
    //     console.log(res)
    //   }
    // });
    return;
    let token = wx.getStorageSync('token')
    if (token) {
      if (!isRequest) {
        this.getGiftList()
      }
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
    }
    // network.POST('/sms/send', {
    //   params: {
    //     mobile: '18482130206',
    //     smsType: 2
    //   },
    //   success () {
    //     console.log(1)
    //   }
    // })
  },
  onShow () {
    return
    let token = wx.getStorageSync('token')
    if (token) {

    } else {
      wx.navigateTo({
        url: '../login/login'
      })
    }
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
  },
  getGiftList () {
    let self = this
    network.POST('/giftRecord/getGiftRecordList', {
      params: {
        pageNo,
        pageSize,
        agentMemberId
      },
      success(res) {
        self.setData({
          giftList: res.list,
          isRequest: true
        })        
      }
    })
  }
})
