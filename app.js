//app.js
var jsondata = require("./utils/first.js")
const ajax = require('./utils/ajax.js')
App({
  login: function(parm) {
    var userInfo = wx.getStorageSync('userInfo')
    var that = this
    wx.login({
      success(res) {
        if (res.code) {
          var t = that
          console.log(userInfo)
          ajax.request({
            method: 'POST',
            url: 'user/register',
            data: {
              code: res.code,
              nickName: userInfo.nickName,
              imageUrl: userInfo.avatarUrl === '' ? 'https://fv215b183.cn:88/default.jpg' : userInfo.avatarUrl,
            },
            success: result => {
              wx.setStorageSync('key', result.data.key)
              parm.callback();
            }
          })
        }
      }
    })
  },
  play: function() {
    var that = this;
    setInterval(function() {
      console.log('定时器')
      that.login({
        callback: function() {}
      });
    }, 1800000)
  },
  onLaunch: function() {
    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var key = wx.getStorageSync('key') || ''
    if (key !== '') {
      this.login({
        callback: function() {}
      });
      console.log('定时器')
      setInterval(function() {
        console.log('定时器')
        that.login({
          callback: function() {}
        });
      }, 1800000)
    }
  },
  globalData: {
    userInfo: null
  }
})