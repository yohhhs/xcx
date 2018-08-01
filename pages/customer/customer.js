const network = require('../../common/newwork.js')
Page({
  data: {
    customerList: [],
    pageNo: 1,
    noMore: false
  },
  onShow: function (options) {
    this.setData({
      customerList: [],
      pageNo: 1
    })
    this.getList()
  },
  getList () {
    network.POST('/giftRecord/getGiftRecordList', {
      pageNo: this.data.pageNo,
      pageSize: 10,
      agentMemberId: wx.getStorageSync('token')
    }).then(res => {
      wx.hideLoading()
      if (res.statusCode === 200) {
        if (res.data.list.length === 0) {
          this.setData({
            noMore: true
          })
          return
        }
        let list = this.data.customerList
        list.push(...res.data.list)
        this.setData({
          customerList: list
        })
      }
    })
  },
  lookCustomerList(e) {
    let data = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '../customer-list/customer-list?customer=' + JSON.stringify(data)
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
    this.getList()
  }
})