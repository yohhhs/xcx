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
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    network.POST('/agentMember/login', {
      mobile,
      smsCode
    }).then(res => {
      wx.hideLoading()
      if (res.msg === '') {
        wx.setStorageSync('isBinding', true)
        wx.setStorageSync('token', res.data)
        wx.navigateBack()
      } else if (res.msg == '帐号不存在') {
        wx.setStorageSync('isBinding', false)
        wx.navigateTo({
          url: '../select-company/select-company?mobile=' + this.data.mobile
        })
      } else if (res.msg == '未绑定openid') {
        wx.setStorageSync('isBinding', false)
        wx.setStorageSync('token', res.data)
        wx.login({
          success: (res) => {
            network.POST('/wechat/getOpenIdByCode', {
              loginCode: res.code
            }).then(res => {
              if (res.statusCode === 200) {
                let returnData = res.data.split(',')
                return network.POST('/agentMember/bindOpenId', {
                  openId: returnData[0],
                  sessionKey: returnData[1],
                  agentMemberId: wx.getStorageSync('token')
                })
              }
            }).then(res => {
              if (res.statusCode == 200) {
                wx.setStorageSync('isBinding', true)
                wx.navigateBack()
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none'
                })
              }
            })
          }
        })
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