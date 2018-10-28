const app = getApp()
const network = require('../../common/newwork.js')
Page({
  data: {
    giftList: [],
    specialList: [],
    pageNo: 1,
    noMore: false
  },
  onLoad() {
    // wx.navigateTo({
    //   url: '../add-address/add-address',
    // })
    wx.showShareMenu()
    this.getGoodsSpecialList()
    this.getGiftList()
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
          }).then(res => {
            if (res.statusCode === 200) {
              wx.setStorageSync('token', res.data.memberId)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          })
        } else {
          wx.showToast({
            title: '登录失败！',
            icon: 'none'
          })
        }
      }
    })
  },
  getGiftList() {
    network.POST('/goods/getGoodsList', {
      pageNo: this.data.pageNo,
      pageSize: 10
    }).then(res => {
      wx.hideLoading()
      if (res.statusCode === 200) {
        if (res.data.list.length > 0) {
          let list = this.data.giftList
          list.push(...res.data.list)
          this.setData({
            giftList: list,
            pageNo: this.data.pageNo + 1
          })
        } else {
          this.setData({
            noMore: true
          })
        }
      } else {
        wx.showToast({
          title: '请求失败~',
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '请求失败~',
        icon: 'none'
      })
    })
  },
  getGoodsSpecialList () {
    network.POST('/goodsSpecial/getGoodsSpecialList').then(data => {
      if (data.statusCode === 200) {
        this.setData({
          specialList: data.data
        })
      }
    })
  },
  goShopDetail(event) {
    let purchaseGoodsId = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../shop-detail/shop-detail?purchaseGoodsId=' + purchaseGoodsId
    })
  },
  addCart(event) {
    network.POST('/member/checkMobile', {
      memberId: wx.getStorageSync('token')
    }).then(res => {
      if (res.statusCode === 200 && res.data) {
        let goodsId = event.currentTarget.dataset.id
        let count = event.currentTarget.dataset.count
        wx.showLoading({
          title: '正在加入购物车',
          mask: true
        })
        network.POST('/shoppingCart/addShoppingCart', {
          memberId: wx.getStorageSync('token'),
          goodsId,
          count
        }).then(data => {
          wx.hideLoading()
          if (data.statusCode === 200) {
            wx.showToast({
              title: '加入成功',
              icon: 'success',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'none'
            })
          }
        })
      } else {
        wx.redirectTo({
          url: '../bind-phone/bind-phone',
        })
      }
    })
  },
  onReachBottom() {
    if (this.data.noMore) {
      return
    }
    wx.showLoading({
      title: '玩命加载中'
    })
    this.getGiftList()
  }
})
