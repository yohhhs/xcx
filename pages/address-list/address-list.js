const network = require('../../common/newwork.js')
Page({
  data: {
    addressList: [],
    hasClick: 0
  },
  onLoad: function (options) {
    let hasClick = options.hasClick
    if (hasClick == 1) {
      this.setData({
        hasClick
      })
    }
  },
  onShow: function () {
    this.getAddressList()
  },
  getAddressList () {
    network.POST('/memberAddress/getMemberAddressList', {
      memberId: wx.getStorageSync('token')
    }).then(res => {
      if (res.statusCode === 200) {
        this.setData({
          addressList: res.data
        })
      }
    })
  },
  goAddAddress () {
    wx.navigateTo({
      url: '../add-address/add-address',
    })
  },
  goEditAddress (event) {
    let index = event.currentTarget.dataset.index
    wx.navigateTo({
      url: '../edit-address/edit-address?addressItem=' + JSON.stringify(this.data.addressList[index])
    })
  },
  chooseAddress (event) {
    if (this.data.hasClick === 0) {
      return false
    }
    let index = event.currentTarget.dataset.index
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    console.log(prevPage)
    prevPage.setData({
      addressDetail: this.data.addressList[index]
    })
    wx.navigateBack()
  }
})