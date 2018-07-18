const network = require('../../common/newwork.js')
Page({
  data: {
      mobile: '',
      code: '',
      verifyCodeTime: '获取验证码',
      buttonDisable: false
  },
  onLoad: function (options) {
    this.setData({
        mobile: options.mobile
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
          smsType: 2
      }).then(res => {
          wx.showToast({
              icon: 'success',
              title: '发送成功'
          })
      })
  },
  goNext () {
      let mobile = this.data.mobile;
      let smsCode = this.data.code;
      if (smsCode === '') {
          wx.showToast({
              icon: 'none',
              title: '请输入验证码'
          })
          return false;
      }
      network.POST('/sms/checkSmsCode', {
          mobile,
          smsCode
      }).then(res => {
          wx.navigateTo({
              url: '../change-phone/change-phone',
          })
      })
  }
})