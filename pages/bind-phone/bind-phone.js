const network = require('../../common/newwork.js')
Page({
  data: {
    mobile: '',
    code: '',
    verifyCodeTime: '获取验证码',
    buttonDisable: true,
    confirmDisable: true
  },
  mobileInputEvent(e) {
    // if ((e.detail.value + '').length !== 11) {
    //   return false
    // }
    let regMobile = /^1\d{10}$/
    if (regMobile.test(e.detail.value)) {
      this.setData({
        mobile: e.detail.value,
        buttonDisable: false
      })
    } else {
      this.setData({
        buttonDisable: true
      })
    }
  },
  codeInputEvent(e) {
    this.setData({
      code: e.detail.value
    })
    if ((this.data.code + '').length === 6) {
      this.setData({
        confirmDisable: false
      })
    }
  },
  verifyCodeEvent(e) {
    if (this.data.buttonDisable) return false;
    let mobile = this.data.mobile;
    let that = this;
    let c = 10;
    let regMobile = /^1\d{10}$/
    if (!regMobile.test(mobile)) {
      this.setData({
        buttonDisable: false
      })
      return false
    }
    that.setData({
      buttonDisable: true
    })
    let intervalId = setInterval(function () {
      c = c - 1;
      that.setData({
        verifyCodeTime: c + 's后重发'
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
      if (res.statusCode === 200) {
        wx.showToast({
          icon: 'success',
          title: '发送成功'
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg
        })
      }
    }).catch(err => {
      wx.showToast({
        icon: 'none',
        title: '发送失败'
      })
    })
  },
  bindPhone () {
    wx.showLoading({
      title: 'loading...',
      mask: true
    })
    network.POST('/member/bindMobile', {
      memberId: wx.getStorageSync('token'),
      mobile: this.data.mobile,
      smsCode: this.data.code
    }).then(res => {
      wx.hideLoading()
      if (res.statusCode === 200) {
        wx.navigateBack({
          delta: 1
        })
        wx.showToast({
          icon: 'success',
          title: '绑定成功'
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg
        })
      }
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: '绑定失败'
      })
    })
  }
})