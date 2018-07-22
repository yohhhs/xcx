const network = require('../../common/newwork.js')
Page({
  data: {
    pageNo: 1,
    renderSendGift: [],
    defaultSendGift: {},
    noMore: false
  },
  onLoad: function (options) {
    this.getSendList()
  },
  getSendList () {
    network.POST('/giftRecord/getGiftSendRecordList', {
      agentMemberId: wx.getStorageSync('token'),
      pageSize: 20,
      pageNo: this.data.pageNo
    }).then(res => {
      wx.hideLoading()
      let list = res.data.list
      if (list.length === 0) {
        this.setData({
          noMore: true
        })
        return
      }
      let listObj = this.data.defaultSendGift
      let giftList = []
      list.forEach(item => {
        if (!listObj[item.dateStr.split(' ')[0]]) {
          listObj[item.dateStr.split(' ')[0]] = []
        }
        listObj[item.dateStr.split(' ')[0]].push(item)
      })
      for (let k in listObj) {
        giftList.push({
          name: k,
          len: listObj[k].length,
          children: listObj[k]
        })
      }
      this.setData({
        renderSendGift: giftList,
        defaultSendGift: listObj
      })
    })
  },
  onReachBottom () {
    wx.showLoading({
      title: '玩命加载中'
    })
    this.setData({
      pageNo: this.data.pageNo + 1
    })
    this.getSendList()
  }
})