//index.js
//获取应用实例
const app = getApp()
const network = require('../../common/newwork.js')
Page({
  data: {
    giftList: null,
    isRequest: false,
    token: ''
  },
  onLoad() {
  },
  onShow () {
    let token = wx.getStorageSync('token')
    let isBingding = wx.getStorageSync('isBinding')
    let isRequest = this.data.isRequest

    if (token && isBingding) {
      this.setData({
        token
      })
      if (!isRequest) {
        this.getGiftList()
      } 
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
  addCart(event) {
    let purchaseGoodsId = event.currentTarget.dataset.id
    let agentMemberId = this.data.token

    wx.showLoading({
      title: '正在加入购物车',
      mask: true
    })
    network.POST('/shoppingCart/addShoppingCart', {
      params: {
        agentMemberId,
        purchaseGoodsId,
        count: 1
      },
      success(res) {
        wx.hideLoading()
        wx.showToast({
          title: '加入成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  getUser(e) {
    console.log(e)
  },
  getGiftList () {
    let self = this
    let agentMemberId = self.data.token

    network.POST('/purchaseGoods/getPurchaseGoodsList', {
      params: {
        agentMemberId
      },
      success(res) {
        self.setData({
          giftList: res.data,
          isRequest: true
        })        
      }
    })
  }
})
