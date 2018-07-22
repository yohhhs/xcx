const network = require('../../common/newwork.js')
Page({
  data: {
    customerDetail: '',
    cusList: []
  },
  onLoad (options) {
    this.setData({
      customerDetail: JSON.parse(options.customer)
    })
    this.getCustomerList()
  },
  openExtend (e) {
    let index = e.currentTarget.dataset.index
    let current = this.data.cusList[index]
    if (!current.isOpen) {
      if (!current.isRequest) {
        this.getMemberList(current.memberId, index)
      }
    }
    let isOpen = `cusList[${index}].isOpen`
    this.setData({
      [isOpen]: !current.isOpen
    })
  },
  getCustomerList () {
    network.POST('/member/getMemberList', {
      agentMemberId: wx.getStorageSync('token'),
      memberType: 1,
      giftId: this.data.customerDetail.giftRecordId
    }).then(res => {
      let cusList = res.data
      cusList.forEach(item => {
        item.isOpen = false
        item.isRequest = false
        item.children = []
      })
      this.setData({
        cusList
      })
    })
  },
  getMemberList(parentId, index) {
    network.POST('/member/getMemberList', {
      agentMemberId: wx.getStorageSync('token'),
      memberType: 2,
      giftId: this.data.customerDetail.giftRecordId,
      parentId
    }).then(res => {
      let children = `cusList[${index}].children`
      let isRequest = `cusList[${index}].isRequest`
      this.setData({
        [children]: res.data,
        [isRequest]: true
      })
    })
  },
  callUser (e) {
    let tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
})