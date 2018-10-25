const network = require('../../common/newwork.js')
Page({
  data: {
    giftNumber: 1,
    detail: null,
    purchaseGoodsId: ''
  },
  onLoad: function (options) {
    this.setData({
      purchaseGoodsId: options.purchaseGoodsId
    })
    network.POST('/goods/getGoodsDetail', {
      goodsId: options.purchaseGoodsId
    }).then(res => {
      this.setData({
        detail: res.data
      })
    })
  },
  numberDel () {
    if (this.data.giftNumber > 1) {
      let giftNumber = this.data.giftNumber - 1
      this.setData({
        giftNumber
      })
    }
  },
  numberAdd () {
    let giftNumber = this.data.giftNumber + 1
    console.log(giftNumber)
    this.setData({
      giftNumber
    }) 
  },
  giftNumberChange (e) {
    let number = e.detail.value
    if (/^\+?[1-9][0-9]*$/.test(number)) {
      if ((number + '')[0] !== '0') {
        this.setData({
          giftNumber: number
        })
      } else {
        this.setData({
          giftNumber: 1
        })
      }
    } else {
      this.setData({
        giftNumber: 1
      })
    }
  },
  joinCart () {
    wx.showLoading({
      title: '正在加入购物车',
      mask: true
    })
    network.POST('/shoppingCart/addShoppingCart', {
      agentMemberId: wx.getStorageSync('token'),
      purchaseGoodsId: this.data.purchaseGoodsId,
      count: this.data.giftNumber
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '加入成功',
        icon: 'success',
        duration: 200
      })
      wx.switchTab({
        url: '/pages/shoppingcart/shoppingcart',
      })
    })
  }
})