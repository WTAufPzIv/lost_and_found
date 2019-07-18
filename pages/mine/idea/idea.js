const ajax = require('../../../utils/ajax.js')
Page({
  data: {
    screenHeight: 0,
    statusBarHeight: 0,
    text: '',
    connect: '',
    key: ''
  },
  onLoad: function() {
    var flag = wx.getStorageSync('key') || ''
    if (flag !== '') {
      this.setData({
        key: flag
      })
    }
    var that = this;
    this.setData({
      screenHeight: wx.getSystemInfoSync().windowHeight,
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
  },
  back: function() {
    wx.navigateBack({
      delt: 1
    })
  },
  changeText: function(e) {
    this.setData({
      text: e.detail.value
    })
  },
  changeConnect: function(e) {
    this.setData({
      connect: e.detail.value
    })
  },
  updata: function() {
    var that = this
    if (this.data.key == '') {
      wx.showToast({
        title: '请先登录',
        image: '../../../img/fail.png'
      })
    } else if (this.data.text == '' || this.data.connect == '') {
      wx.showToast({
        image: '../../../img/fail.png',
        title: '信息未完善',
      })
    } else {
      wx.showLoading({
        title: '正在提交',
      })
      ajax.request({
        url: 'feedback/send',
        data: {
          key: that.data.key,
          suggestion: that.data.text,
          contact: that.data.connect
        },
        success: function(res) {
          console.log(res)
          if (res.code == 200) {
            wx.hideLoading()
            wx.showModal({
              title: '反馈成功',
              content: '感谢您的反馈意见',
              showCancel: false,
              confirmColor: '#FFD84D',
              confirmText: '知道了',
              success: function(result) {
                if (result.confirm) {
                  wx.navigateBack({
                    delt: 1
                  })
                }
              }
            })
          }
        }
      })
    }
  }
})