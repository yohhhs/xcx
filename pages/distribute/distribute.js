const network = require('../../common/newwork.js')
Page({
  data: {
    disList: []
  },
  onLoad () {
    network.POST('/giftRecord/getGiftRecordList', {
      pageNo: 1,
      pageSize: 10,
      agentMemberId: wx.getStorageSync('token')
    }).then(res => {
      if (res.statusCode === 200) {
        this.setData({
          disList: res.data.list
        })
      }
    })
  },
  sendGift(e) {
    let index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确认后将会呈现活动二维码，并且从剩余数量中扣除1份礼品',
      success: function (res) {
        if (currentGift.totalGoodsCount === currentGift.sendGoodsCount) {
          wx.showToast({
            title: '数量不足',
            icon: 'none',
            duration: 2000
          })
          return
        }
        let currentGift = this.data.disList[index]
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
  }
})