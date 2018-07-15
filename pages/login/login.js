// pages/login/login.js
const network = require('../../common/newwork.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    verifyCodeTime: '获取验证码',
    buttonDisable: false
  },
  mobileInputEvent: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  verifyCodeEvent: function (e) {
    if (this.data.buttonDisable) return false;
    let mobile = this.data.mobile;
    var regMobile = /^1\d{10}$/;
    if (!regMobile.test(mobile)) {
      wx.showToast({
        icon: 'none',
        title: '手机号有误！'
      })
      return false;
    }
    let that = this;
    let c = 60;
    let intervalId = setInterval(function () {
      c = c - 1;
      that.setData({
        verifyCodeTime: c + 's后重发',
        buttonDisable: true
      })
      if (c == 0) {
        clearInterval(intervalId);
        that.setData({
          verifyCodeTime: '获取验证码',
          buttonDisable: false
        })
      }
    }, 1000)
    network.POST('/sms/send', {
      params: {
        mobile,
        smsType: 2
      },
      success () {
        console.log(1)
      }
    })
  },
  getCode () {
    console.log(this.data)
    if (this.data.phone === '') {
      wx.showToast({
        title: '加入成功',
        icon: 'success',
        duration: 2000
      })
      return false
    }
    
  }
})