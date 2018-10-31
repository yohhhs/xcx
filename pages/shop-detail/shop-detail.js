const network = require('../../common/newwork.js')
Page({
  data: {
    giftNumber: 1,
    detail: null,
    purchaseGoodsId: '',
    minNumber: 1
  },
  onLoad: function (options) {
    this.setData({
      purchaseGoodsId: options.purchaseGoodsId
    })
    network.POST('/goods/getGoodsDetail', {
      goodsId: options.purchaseGoodsId
    }).then(res => {
      this.setData({
        detail: res.data,
        minNumber: res.data.minQuantity,
        giftNumber: res.data.minQuantity
      })
    })
  },
  onShow () {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '../give-auth/give-auth'
          })
        }
      }
    })
    wx.login({
      success: (res) => {
        if (res.code) {
          network.POST('/wechat/registerByCode', {
            loginCode: res.code
          }).then(data => {
            wx.setStorageSync('token', data.data.memberId)
          })
        } else {
          wx.showToast({
            title: '登录失败！' + res.errMsg,
            icon: 'none'
          })
        }
      }
    })
  },
  numberDel () {
    if (this.data.giftNumber > this.data.minNumber) {
      let giftNumber = this.data.giftNumber - 1
      this.setData({
        giftNumber
      })
    }
  },
  numberAdd () {
    let giftNumber = this.data.giftNumber + 1
    this.setData({
      giftNumber
    }) 
  },
  giftNumberChange (e) {
    let number = e.detail.value
    if (/^\+?[1-9][0-9]*$/.test(number)) {
      if ((number + '')[0] !== '0' && number >= this.data.minNumber) {
        this.setData({
          giftNumber: number
        })
      } else {
        this.setData({
          giftNumber: this.data.minNumber
        })
      }
    } else {
      this.setData({
        giftNumber: this.data.minNumber
      })
    }
  },
  joinCart () {
    network.POST('/member/checkMobile', {
      memberId: wx.getStorageSync('token')
    }).then(res => {
      if (res.statusCode === 200 && res.data) {
        wx.showLoading({
          title: '正在加入购物车',
          mask: true
        })
        network.POST('/shoppingCart/addShoppingCart', {
          memberId: wx.getStorageSync('token'),
          goodsId: this.data.purchaseGoodsId,
          count: this.data.giftNumber
        }).then(res => {
          wx.hideLoading()
          wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 200
          })
        })
      } else {
        wx.navigateTo({
          url: '../bind-phone/bind-phone',
        })
      }
    })
  },
  goIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goCart() {
    wx.switchTab({
      url: '/pages/shoppingcart/shoppingcart',
    })
  },
  onShareAppMessage (res) {
    return {
      title: this.data.detail.goodsName,
      imageUrl: 'https://www.topasst.com/images/' + this.data.detail.indexImage
    }
  }
})