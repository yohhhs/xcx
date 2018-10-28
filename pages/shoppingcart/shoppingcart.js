const network = require('../../common/newwork.js')
Page({
  data: {
    shoppingNumber: 0,
    countPrice: 0,
    isSelectAll: false,
    cartList: [],
    orderList: [],
    confirmHidden: true,
    currentIndex: -1,
    currentCount: 1
  },
  onShow () {
    this.getCartList()
    this.setData({
      isSelectAll: false,
      orderList: [],
      cartList: [],
      shoppingNumber: 0,
      countPrice: 0
    })
  },
  getCartList () {
    network.POST('/shoppingCart/getShoppingCartList', {
      memberId: wx.getStorageSync('token')
    }).then(res => {
      if (res.statusCode === 200) {
        this.setData({
          cartList: res.data
        })
        this.selectAll()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '请求失败',
        icon: 'none'
      })
    })
  },
  checkboxChange (e) {
    this.setData({
      orderList: e.detail.value
    })
    if (e.detail.value.length === this.data.cartList.length) {
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
    let cartList = this.data.cartList
    if (this.data.isSelectAll) {
      let orderList = []
      cartList.forEach(item => {
        item.checked = true
        orderList.push(item.shoppingCartId)
      })
      this.setData({
        orderList
      })
      this.countNumberAndPrice()
    } else {
      cartList.forEach(item => {
        item.checked = false
      })
      this.setData({
        shoppingNumber: 0,
        countPrice: 0,
        orderList: []
      })
    }
    this.setData({
      cartList
    })
  },
  countNumberAndPrice () {
    let shoppingNumber = 0
    let countPrice = 0
    this.data.orderList.forEach(selectItem => {
      let items = this.data.cartList.find(item => {
        return item.shoppingCartId === selectItem
      })
      if (items) {
        shoppingNumber += items.count * 1
        countPrice = (countPrice * 100 + items.salePrice * 100 * items.count) / 100
      }
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
  },
  numberDel(e) {
    let index = e.currentTarget.dataset.index
    if (this.data.cartList[index].count > this.data.cartList[index].minQuantity) {
      this.setData({
        currentIndex: index,
        currentCount: this.data.cartList[index].count - 1
      })
      this.updateCart()
    }
  },
  numberAdd(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: index,
      currentCount: this.data.cartList[index].count + 1
    })
    this.updateCart()
  },
  changeNumber(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      confirmHidden: false,
      currentIndex: index,
      currentCount: this.data.cartList[index].count
    })
  },
  giftNumberChange(e) {
    let number = e.detail.value * 1
    if (/^\+?[1-9][0-9]*$/.test(number)) {
      if ((number + '')[0] !== '0' && number >= this.data.minQuantity) {
        this.setData({
          currentCount: number
        })
      } else {
        this.setData({
          currentCount: this.data.cartList[this.data.currentIndex].minQuantity
        })
      }
    } else {
      this.setData({
        currentCount: this.data.cartList[this.data.currentIndex].minQuantity
      })
    }
  },
  modalNumberDel () {
    if (this.data.currentCount > this.data.cartList[this.data.currentIndex].minQuantity) {
      this.setData({
        currentCount: this.data.currentCount - 1
      })
    }
  },
  modalNumberAdd () {
    this.setData({
      currentCount: this.data.currentCount + 1
    })
  },
  updateCart () {
    let memberId = wx.getStorageSync('token')
    let shoppingCartId = this.data.cartList[this.data.currentIndex].shoppingCartId
    let count = this.data.currentCount
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    network.POST('/shoppingCart/updateShoppingCart', {
      memberId,
      shoppingCartId,
      count
    }).then(res => {
      let changeItem = 'cartList[' + this.data.currentIndex + '].count'
      this.setData({
        [changeItem]: count
      })
      this.countNumberAndPrice()
      wx.hideLoading()
    })
  },
  cancel () {
    this.setData({
      confirmHidden: true
    })
  },
  confirm () {
    this.updateCart()
    this.setData({
      confirmHidden: true
    })
  },
  deleteCart (e) {
    let index = e.currentTarget.dataset.index
    wx.showModal({
      title: '删除',
      content: '确定删除商品？',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: 'loading',
            mask: true
          })
          network.POST('/shoppingCart/deleteShoppingCart', {
            memberId: wx.getStorageSync('token'),
            shoppingCartId: this.data.cartList[index].shoppingCartId
          }).then(res => {
            if (res.statusCode === 200) {
              let cartList = this.data.cartList
              cartList.splice(index, 1)
              this.setData({
                cartList
              })
              this.countNumberAndPrice()
            }
            wx.hideLoading()
          })
        }
      }
    })
  },
  goPay () {
    if (this.data.orderList.length === 0) {
      wx.showToast({
        title: '无结算商品',
        icon: 'none',
        duration: 2000
      })
    } else {
      let orderData = []
      this.data.orderList.forEach(selectItem => {
        let items = this.data.cartList.find(item => {
          return item.shoppingCartId === selectItem
        })
        if (items) {
          orderData.push(items)
        }
      })
      wx.navigateTo({
        url: '../edit-order/edit-order?orderData=' + JSON.stringify(orderData)
      })
    }
  },
  goDetail(event) {
    let purchaseGoodsId = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../shop-detail/shop-detail?purchaseGoodsId=' + purchaseGoodsId
    })
  }
})