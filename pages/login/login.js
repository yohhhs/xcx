const network = require('../../common/newwork.js')
Page({
  data: {
    mobile: '',
    code: '',
    verifyCodeTime: '获取验证码',
    buttonDisable: false
  },
  mobileInputEvent (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  codeInputEvent (e) {
    this.setData({
      code: e.detail.value
    })
  },
  verifyCodeEvent (e) {
    if (this.data.buttonDisable) return false;
    let mobile = this.data.mobile;
    let regMobile = /^1\d{10}$/;
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
      mobile,
      smsType: 1
    }).then(res => {
      wx.showToast({
        icon: 'success',
        title: '发送成功'
      })
    })
  },
  goNext () {
    let mobile = this.data.mobile;
    let regMobile = /^1\d{10}$/;
    let smsCode = this.data.code;
    
    if (!regMobile.test(mobile)) {
      wx.showToast({
        icon: 'none',
        title: '手机号有误！'
      })
      return false;
    }
    if (smsCode === '') {
      wx.showToast({
        icon: 'none',
        title: '请输入验证码'
      })
      return false;
    }
    network.POST('/agentMember/login', {
      mobile,
      smsCode
    }).then(res => {
      wx.setStorageSync('token', res.data)
      if (res.msg === '') {
        wx.setStorageSync('isBinding', true)
        wx.navigateBack()
      } else {
        wx.setStorageSync('isBinding', false)
      }
    })
  }
})