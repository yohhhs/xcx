// pages/shoppingcart/shoppingcart.js
Page({

  data: {
    items: [
      { name: 'USA', value: '美国', price: 30, number: 3 },
      { name: 'CHN', value: '中国', price: 50.7, number: 6 }
    ],
    shoppingNumber: 0,
    countPrice: 0,
    isSelectAll: false,
    orderList: []
  },
  checkboxChange (e) {
    this.setData({
      orderList: e.detail.value
    })
    if (e.detail.value.length === this.data.items.length) {
      this.setData({
        isSelectAll: true
      })
    } else {
      this.setData({
        isSelectAll: false
      })
    }
    this.countNumberAndPrice()
  },
  selectAll () {
    this.setData({
      isSelectAll: !this.data.isSelectAll
    })
    let items = this.data.items
    if (this.data.isSelectAll) {
      let orderList = []
      items.forEach(item => {
        item.checked = true
        orderList.push(item.name)
      })
      this.setData({
        orderList
      })
      this.countNumberAndPrice()
    } else {
      items.forEach(item => {
        item.checked = false
      })
      this.setData({
        shoppingNumber: 0,
        countPrice: 0,
        orderList: []
      })
    }
    this.setData({
      items
    })
  },
  countNumberAndPrice () {
    let shoppingNumber = 0
    let countPrice = 0
    this.data.orderList.forEach(selectItem => {
      let items = this.data.items.find(item => {
        return item.name === selectItem
      })
      console.log(items)
      shoppingNumber += items.number * 1
      countPrice += items.price * 1
    })
    this.setData({
      shoppingNumber,
      countPrice
    })
  },
  balanceNow () {
    if (this.data.orderList.length === 0) {
      wx.showToast({
        title: '请选择结算的商品',
        icon: 'none',
        duration: 1000
      })
    }
  }
})