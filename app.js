//app.js
var jsondata = require("./utils/first.js") 
const ajax = require('./utils/ajax.js')
App({
  login:function(){
    var userInfo = wx.getStorageSync('userInfo')
    wx.login({
      success(res) {
        if (res.code) {
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
            }
          })
        }
      }
    })
  },
  play:function(){
    var that = this;
    setInterval(function () {
      console.log('定时器')
      that.login();
    }, 300000)
  },
  onLaunch: function () {
    var that = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var key = wx.getStorageSync('key') || ''
    if(key !== ''){
      this.login();
      console.log('定时器')
      setInterval(function(){
        console.log('定时器')
        that.login();
      },300000)
    }
    // var fir = jsondata.isFirst.isFirst
    // console.log(fir)
    // if(fir){
    //   wx.navigateTo({
    //     url: 'pages/guide/guide',
    //   })
    // }
    // else{
    //   wx.switchTab({
    //     url: 'pages/lost/lost',
    //   })
    // }

    // 登录
    // wx.login({
    //   success: function(){
       
    //   }
    // })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log(666)
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null
  }
})