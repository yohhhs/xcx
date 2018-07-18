const network = require('../../common/newwork.js')
Page({
  data: {
    saleDepartmentName: '',
    multiArray: [],
    multiIndex: [0, 0, 0, 0],
    step: 0,
  },
  onLoad: function (options) {
    this.setData({
      saleDepartmentName: options.saleDepartmentName
    })
    this.getOrganize()
  },
  getOrganize() {
    if (res.data.length === 0) {
      return
    }
    network.POST('/organize/getOrganizeList').then(res => {
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
    if (res.data.length === 0) {
      return
    }
    this.setData({
      currnetOrganizeKey: code
    })
    network.POST('/company/getCompanyList', {
      parentId: 0,
      organizeId: code
    }).then(res => {
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
    if (res.data.length === 0) {
      return
    }
    this.setData({
      currnetOneCompanyKey: code
    })
    network.POST('/company/getCompanyList', {
      parentId: code,
      organizeId: this.data.currnetOrganizeKey
    }).then(res => {
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
    if (res.data.length === 0) {
      return
    }
    this.setData({
      currnetTwoCompanyKey: code
    })
    network.POST('/saleDepartment/getSaleDepartmentList', {
      companyId: code
    }).then(res => {
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
    data.multiIndex[column] = e.detail.value;
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
  confirmChange () {
    if (this.data.saleList && this.data.saleList.length > 0 && this.data.step === 1) {
      network.POST('/agentMember/changeSaleDepartment', {
        agentMemberId: wx.getStorageSync('token'),
        saleDepartmentId: this.data.saleList[this.data.multiIndex[3]].infoId
      }).then(res => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '修改成功'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }
  }
})