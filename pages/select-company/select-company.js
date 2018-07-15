// pages/select-company/select-company.js
const network = require('../../common/newwork.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [],  // 三维数组数据
    multiIndex: [0, 0, 0], // 默认的下标
    step: 0, // 默认显示请选择
  },
  onLoad: function (options) {
    this.getProvince()  // 页面加载后就调用函数 获取省级数据
  },
  getProvince() { // 获取省
    let self = this
    network.POST('/organize/getOrganizeList', {
      params: {},
      success(res) {
        let data = res.data
        var provinceList = [...data] // 放在一个数组里面
        var provinceArr = data.map((item) => { return item.infoValue }) // 获取数据里面的value值，就是只用数据的名称 
        self.setData({
          multiArray: [provinceArr, [], []], // 更新三维数组 更新后长这样 [['江苏省', '福建省'],[],[]]
          provinceList,   // 省级原始数据
          provinceArr    // 省级所有的名称
        })
        var defaultCode = self.data.provinceList[0].infoId  // 使用第一项当作参数获取市级数据
        if (defaultCode) {
          self.setData({
            currnetProvinceKey: defaultCode  // 保存在当前的省级key
          })
          self.getCity(defaultCode)  // 获取市级数据
        }
      }
    })
  },
  getCity(code) { // 获取市级数据
    let self = this
    self.setData({
      currnetProvinceKey: code  // 保存当前选择的市级code
    })
    network.POST('/company/getCompanyList', {
      params: {
        parentId: 0,
        organizeId: code
      },
      success(res) {
        let data = res.data
        // if (data.length === 0) {
        //   data.push({
        //     infoId: '',
        //     infoValue: '暂无数据'
        //   })
        // }
        var cityArr = data.map((item) => { return item.infoValue })
        var cityList = [...data]
        self.setData({
          multiArray: [self.data.provinceArr, cityArr, []],  // 更新三维数组 更新后长这样 [['江苏省', '福建省'], ['徐州市'], []]
          cityList,  // 保存下市级原始数据
          cityArr  // 市级所有的名称
        })
        var defaultCode = self.data.cityList[0].infoId  // 用第一个获取门店数据
        if (defaultCode) {
          self.setData({
            currnetCityKey: defaultCode  // 存下当前选择的城市key
          })
          self.getStore(defaultCode) // 获取门店数据
        }
      }
    })
  },
  getStore(code) {
    let self = this
    self.setData({
      currnetCityKey: code // 更新当前选择的市级key
    })
    network.POST('/saleDepartment/getSaleDepartmentList', {
      params: {
        companyId: code
      },
      success(res) {
        let data = res.data
        var storeList = [...data]
        var storeArr = data.map((item) => { return item.infoValue })
        self.setData({
          multiArray: [self.data.provinceArr, self.data.cityArr, storeArr],  
          storeList,  // 保存下门店原始数据
          storeArr    // 保存下门店名称，可以不保存
        })
      }
    })
  },
  columnchange(e) {  // 滚动选择器 触发的事件
  let self = this
    var column = e.detail.column  // 当前改变的列
    var data = {
      multiIndex: JSON.parse(JSON.stringify(self.data.multiIndex)),
      multiArray: JSON.parse(JSON.stringify(self.data.multiArray))
    }
    console.log(e.detail)
    data.multiIndex[column] = e.detail.value;  // 第几列改变了就是对应multiIndex的第几个，更新它
    switch (column) { // 处理不同的逻辑
      case 0:   // 第一列更改 就是省级的更改
        var currentProvinceKey = self.data.provinceList[e.detail.value].infoId
        if (currentProvinceKey != self.data.currnetProvinceKey) {  // 判断当前的key是不是真正的更新了
          self.getCity(currentProvinceKey)  // 获取当前key下面的市级数据
        }

        data.multiIndex[1] = 0  // 将市默认选择第一个
        break;

      case 1:  // 市发生变化
        var currentCitykey = self.data.cityList[e.detail.value].infoId
        if (currentCitykey != self.data.currnetCityKey) {  // 同样判断
          self.getStore(currentCitykey)   // 获取门店
        }
        data.multiIndex[2] = 0  // 门店默认为第一个
        break;
    }
    self.setData(data)  // 更新数据
  },
  pickchange(e) {
    this.setData({
      step: 1,  // 更新，用来选择用户选中的门店
      multiIndex: e.detail.value  // 更新下标字段
    })
  },

  submit() {  // 保存的时候 获取当前选择门店的key 丢给后端开发即可
    var storeCode = this.data.storeList[this.data.multiIndex.length - 1].key
  }
})