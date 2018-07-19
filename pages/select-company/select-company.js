const network = require('../../common/newwork.js')
Page({
  data: {
    multiArray: [],
    multiIndex: [0, 0, 0, 0],
    step: 0,
    mobile: '',
    name: ''
  },
  onLoad: function (options) {
    this.setData({
      mobile: options.mobile
    })
    this.getOrganize()
  },
  getOrganize() {
    network.POST('/organize/getOrganizeList').then(res => {
      // if (res.data.length === 0) {
      //   return
      // }
      let data = res.data
      let organizeList = [...data]
      let organizeValues = data.map((item) => { return item.infoValue })
      this.setData({
        multiArray: [organizeValues, [], []],
        organizeList,
        organizeValues
      })
      let defaultCode = this.data.organizeList[0].infoId
      if (defaultCode) {
        this.getOneCompany(defaultCode)
      }
    })
  },
  getOneCompany(code) {
    this.setData({
      currnetOrganizeKey: code
    })
    network.POST('/company/getCompanyList', {
      parentId: 0,
      organizeId: code
    }).then(res => {
      // if (res.data.length === 0) {
      //   return
      // }
      let data = res.data
      let oneCompanyList = [...data]
      let oneCompanyValues = data.map((item) => { return item.infoValue })
      this.setData({
        multiArray: [this.data.organizeValues, oneCompanyValues, []],
        oneCompanyList,
        oneCompanyValues
      })
      var defaultCode = this.data.oneCompanyList[0].infoId
      if (defaultCode) {

        this.getTwoCompany(defaultCode)
      }
    })
  },
  getTwoCompany(code) {
    this.setData({
      currnetOneCompanyKey: code
    })
    network.POST('/company/getCompanyList', {
      parentId: code,
      organizeId: this.data.currnetOrganizeKey
    }).then(res => {
      // if (res.data.length === 0) {
      //   return
      // }
      let data = res.data
      let twoCompanyList = [...data]
      let twoCompanyValues = data.map((item) => { return item.infoValue })

      this.setData({
        multiArray: [this.data.organizeValues, this.data.oneCompanyValues, twoCompanyValues, []],
        twoCompanyList,
        twoCompanyValues
      })
      var defaultCode = this.data.twoCompanyList[0].infoId
      if (defaultCode) {
        this.getSale(defaultCode)
      }
    })
  },
  getSale(code) {
    this.setData({
      currnetTwoCompanyKey: code
    })
    network.POST('/saleDepartment/getSaleDepartmentList', {
      companyId: code
    }).then(res => {
      // if (res.data.length === 0) {
      //   return
      // }
      let data = res.data
      let saleList = [...data]
      let saleValues = data.map((item) => { return item.infoValue })
      this.setData({
        multiArray: [this.data.organizeValues, this.data.oneCompanyValues, this.data.twoCompanyValues, saleValues],
        saleList,
        saleValues
      })
    })
  },
  columnchange(e) {
    var column = e.detail.column
    var data = {
      multiIndex: JSON.parse(JSON.stringify(this.data.multiIndex)),
      multiArray: JSON.parse(JSON.stringify(this.data.multiArray))
    }
    data.multiIndex[column] = e.detail.value
    switch (column) {
      case 0:
        let currentOrganizeKey = this.data.organizeList[e.detail.value].infoId
        if (currentOrganizeKey != this.data.currentOrganizeKey) {
          this.getOneCompany(currentOrganizeKey)
        }

        data.multiIndex[1] = 0
        break;

      case 1:
        let currnetOneCompanyKey = this.data.oneCompanyList[e.detail.value].infoId
        if (currnetOneCompanyKey != this.data.currnetOneCompanyKey) {
          this.getTwoCompany(currnetOneCompanyKey)
        }
        data.multiIndex[2] = 0
        break;
      case 2:
        let currnetTwoCompanyKey = this.data.twoCompanyList[e.detail.value].infoId
        if (currnetTwoCompanyKey != this.data.currnetTwoCompanyKey) {
          this.getSale(currnetTwoCompanyKey)
        }
        data.multiIndex[3] = 0
        break;
    }
    this.setData(data)
  },
  pickchange(e) {
    if (this.data.saleList && this.data.saleList.length > 0) {
      this.setData({
        step: 1,
        multiIndex: e.detail.value
      })
    }
  },
  mobileInputEvent(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  nameInputEvent (e) {
    this.setData({
      name: e.detail.value
    })
  },
  confirmChange() {
    var storeCode = this.data.saleList[this.data.multiIndex.length - 1].infoId
  },
  register () {
    if (this.data.name === '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }
    if (this.data.saleList && this.data.saleList.length > 0 && this.data.step === 1) {
      wx.showLoading({
        title: 'loading',
        mask: true
      })
      wx.login({
        success: (res) => {
          network.POST('/wechat/getOpenIdByCode', {
            loginCode: res.code
          }).then(res => {
            wx.hideLoading()
            if (res.statusCode === 200) {
              let returnData = res.data.split(',')
              return network.POST('/agentMember/bindSaleDepartment', {
                openId: returnData[0],
                sessionKey: returnData[1],
                mobile: this.data.mobile,
                agentMemberName: this.data.name,
                saleDepartmentId: this.data.saleList[this.data.multiIndex[3]].infoId
              })
            } else {
              wx.showToast({
                title: res.msg,
              })
            }
          }).then(res => {
            wx.hideLoading()
            if (res.statusCode == 200) {
              wx.setStorageSync('isBinding', true)
              wx.setStorageSync('token', res.data)
              wx.showToast({
                title: '注册成功'
              })
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/index/index',
                  fail: (err) => {
                    console.log(err)
                  }
                })
              }, 2000)
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          }).catch(err => {
            wx.hideLoading()
          })
        }
      })
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '请选择营业部',
        icon: 'none'
      })
    }
  }
})