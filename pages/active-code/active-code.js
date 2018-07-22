Page({
  data: {
    codeDetail: null
  },
  onLoad: function (options) {
    console.log(JSON.parse(options.codeData))
    this.setData({
      codeDetail: JSON.parse(options.codeData)
    })  
  }
})