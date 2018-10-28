// pages/add-address/add-address.js
const network = require('../../common/newwork.js')
const cityData = require('../../common/cityData.js')
Page({
  data: {
    name: '',
    mobile: '',
    postCode: '',
    provinceCode: '',
    provinceName: '',
    cityCode: '',
    cityName: '',
    districtCode: '',
    districtName: '',
    addressDetail: '',
    isDefault: false,
    cityArray: [],
    districtList: [],
    cityList: [],
    cityIndex: [0, 0, 0],
    confirmValues: null
  },
  onShow () {
    this.initCity()
  },
  nameChange (e) {
    this.setData({
      name: e.detail.value
    })
  },
  phoneChange (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  postcodeChange (e) {
    this.setData({
      postCode: e.detail.value
    })
  },
  defaultChange (e) {
    if (e.detail.value.length === 1) {
      this.setData({
        isDefault: true
      })
    } else {
      this.setData({
        isDefault: false
      })
    }
  },
  addressDetailChange (e) {
    this.setData({
      addressDetail: e.detail.value
    })
  },
  initCity () {
    let provinceList = []
    cityData.forEach(item => {
      provinceList.push(item.name)
    })
    this.setData({
      cityArray: [provinceList, [], []]
    })
    this.setCity()
  },
  setCity () {
    let cityList = []
    cityData[this.data.cityIndex[0]].children.forEach(item => {
      cityList.push(item.name)
    })
    let cityArray = Array.from(this.data.cityArray)
    cityArray.splice(1, 1, cityList)
    this.setData({
      cityArray
    })
    this.setDistrict()
  },
  setDistrict () {
    let districtList = []
    cityData[this.data.cityIndex[0]].children[this.data.cityIndex[1]].children.forEach(item => {
      districtList.push(item.name)
    })
    let cityArray = Array.from(this.data.cityArray)
    cityArray.splice(2, 1, districtList)
    this.setData({
      cityArray
    })
  },
  pickchange (e) {
    let values = e.detail.value
    this.setData({
      confirmValues: [cityData[values[0]].code, cityData[values[0]].children[values[1]].code, cityData[values[0]].children[values[1]].children[values[2]].code],
      provinceCode: cityData[values[0]].code,
      provinceName: cityData[values[0]].name,
      cityCode: cityData[values[0]].children[values[1]].code,
      cityName: cityData[values[0]].children[values[1]].name,
      districtCode: cityData[values[0]].children[values[1]].children[values[2]].code,
      districtName: cityData[values[0]].children[values[1]].children[values[2]].name
    })
  },
  columnchange (e) {
    let cityIndex = Array.from(this.data.cityIndex)
    switch (e.detail.column) {
      case 0:
        cityIndex = [e.detail.value, 0, 0]
        this.setData({
          cityIndex
        })
        this.setCity()
        break;
      case 1:
        cityIndex[1] = e.detail.value
        cityIndex[2] = 0
        this.setData({
          cityIndex
        })
        this.setDistrict()
        break;
      case 2:
        cityIndex[2] = e.detail.value
        this.setData({
          cityIndex
        })
        break;
    }
  },
  saveAddress () {
    if (this.data.name === '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
    }
    if (this.data.mobile === '') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
    }
    if (!this.data.confirmValues) {
      wx.showToast({
        title: '请选择省市区',
        icon: 'none'
      })
    }
    if (this.data.addressDetail === '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      })
    }
    wx.showLoading({
      title: '保存中...',
      mask: true
    })
    network.POST('/memberAddress/addAddress', {
      memberId: wx.getStorageSync('token'),
      name: this.data.name,
      mobile: this.data.mobile,
      provinceCode: this.data.provinceCode,
      provinceName: this.data.provinceName,
      cityCode: this.data.cityCode,
      cityName: this.data.cityName,
      districtCode: this.data.districtCode,
      districtName: this.data.districtName,
      addressDetail: this.data.addressDetail,
      postCode: this.data.postCode,
      isDefault: this.data.isDefault ? 1: 0
    }).then(res => {
      wx.hideLoading()
      if (res.statusCode === 200) {
        wx.navigateBack()
        wx.showToast({
          title: '保存成功',
        })
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    })
  }
})