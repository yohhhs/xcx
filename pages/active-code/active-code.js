Page({
  data: {
    codeDetail: null
  },
  onLoad: function (options) {
    this.setData({
      codeDetail: JSON.parse(options.codeData)
    })  
  }
})