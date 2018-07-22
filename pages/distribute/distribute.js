const network = require('../../common/newwork.js')
Page({
  data: {
    disList: [],
    pageNo: 1,
    noMore: false
  },
  onShow () {
    this.getGiftList()
  },
  getGiftList () {
    network.POST('/giftRecord/getGiftRecordList', {
      pageNo: this.data.pageNo,
      pageSize: 20,
      agentMemberId: wx.getStorageSync('token')
    }).then(res => {
      wx.hideLoading()
      if (res.statusCode === 200) {
        let list = this.data.disList
        if (res.data.list.length === 0) {
          this.setData({
            noMore: true
          })
          return
        }
        list.push(...res.data.list)
        this.setData({
          disList: list
        })
      }
    })
  },
  sendGift(e) {
    let index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确认后将会呈现活动二维码，并且从剩余数量中扣除1份礼品',
      success: res => {
        let currentGift = this.data.disList[index]
        if (currentGift.totalGoodsCount === currentGift.sendGoodsCount) {
          wx.showToast({
            title: '数量不足',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if (res.confirm) {
          let sendCount = 'disList[' + index + '].sendGoodsCount'
          let codeData = {
            img: currentGift.qrCode,
            activeName: currentGift.activityName,
            goodsName: currentGift.goodsName,
            count: currentGift.totalGoodsCount - currentGift.sendGoodsCount - 1
          }
          this.setData({
            [sendCount]: currentGift.sendGoodsCount - 1
          })
          wx.navigateTo({
            url: '../active-code/active-code?codeData=' + JSON.stringify(codeData),
          })
        }
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
    this.setData({
      pageNo: this.data.pageNo + 1
    })
    this.getGiftList()
  }
})