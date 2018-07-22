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
    // wx.navigateTo({
    //   url: '../send-gift/send-gift',
    // })
    // return
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
  goShopDetail(event) {
    let purchaseGoodsId = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../shop-detail/shop-detail?purchaseGoodsId=' + purchaseGoodsId
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
      agentMemberId,
      purchaseGoodsId,
      count: 1
    }).then(data => {
      wx.hideLoading()
      wx.showToast({
        title: '加入成功',
        icon: 'success',
        duration: 2000
      })
    })
  },
  getUser(e) {
    console.log(e)
  },
  getGiftList () {
    let agentMemberId = this.data.token
    network.POST('/purchaseGoods/getPurchaseGoodsList', {
      agentMemberId
    }).then(res => {
      this.setData({
        giftList: res.data,
        isRequest: true
      })
    })
  }
})
