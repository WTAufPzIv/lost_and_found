const imgdata = require('../../utils/back.js')
const ajax = require('../../utils/ajax.js')
var app = getApp()
Page({
  data: {
    screenHeight: 0,
    statusBarHeight: 0,
    avatar:'../../img/avatar.jpeg',
    nickname:'RhmB-WT',
    school:'未选择学校',
    background:'',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo:{},
    key:'',
    bg:0
  },
  onLoad: function () {
    var that  = this
    console.log('页面载入')
    var key = wx.getStorageSync('key') || ''
    var school = wx.getStorageSync('school') || ''
    var info = wx.getStorageSync('userInfo') || {}
    if(key == ''){
      wx.setStorageSync('bg', 0)
      this.setData({
        hasUserInfo:false,
        bg: 0
      })
    }
    else{
      var bgIndex = wx.getStorageSync('bg')
      this.setData({
        hasUserInfo: true,
        userInfo:info,
        key:key,
        bg:bgIndex
      })
    }
    if(school == ''){
      this.setData({
        school: "未选择学校"
      })
    }
    else{
      this.setData({
        school: school
      })
    }
    this.setData({
      background: imgdata.backImgUrl[that.data.bg]
    })
    var that = this;
    this.setData({
      screenHeight: wx.getSystemInfoSync().windowHeight,
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
  },
  onShow:function(){
    var that = this
    var flag = wx.getStorageSync('bg')
    this.setData({
      bg:flag
    },()=>{
      that.setData({
        background: imgdata.backImgUrl[flag]
      })
    })
  },
  mypost:function(){
    if(this.data.key == '' || this.data.school == '未选择学校'){
      wx.showModal({
        title: '信息未完善',
        content: '授权登录和选择学校后才能进行下一步操作哦',
        showCancel:false,
        confirmColor:"#FFD84D"
      })
    }
    else{
      wx.navigateTo({
        url: 'mypost/mypost',
      })
    }
  },
  school:function(){
    wx.navigateTo({
      url: 'school/school?key='+this.data.key
    })
  },
  idea:function(){
    wx.navigateTo({
      url: 'idea/idea',
    })
  },
  about:function(){
    wx.navigateTo({
      url: 'about/about',
    })
  },
  getUserInfo: function (e) {
    var that = this
    console.log(e)
    if (e.detail.errMsg == "getUserInfo:ok"){
      app.globalData.userInfo = e.detail.userInfo
      // console.log(e)
      wx.showLoading({
        title: '登陆中',
      })
      wx.login({
        success(res) {
          if (res.code) {
            console.log(res.code)
            ajax.request({
              method:'POST',
              url:'user/register',
              data:{
                code: res.code,
                nickName:e.detail.userInfo.nickName,
                imageUrl: e.detail.userInfo.avatarUrl == '' ? 'https://fv215b183.cn:88/default.jpg':e.detail.userInfo.avatarUrl,
              },
              success:result=>{
                console.log(result)
                  if(result.code == 200){
                    wx.setStorageSync('userInfo', e.detail.userInfo)
                    wx.setStorageSync('key', result.data.key)
                    that.setData({
                      userInfo: e.detail.userInfo,
                      hasUserInfo: true
                    })
                    that.setData({
                      key: result.data.key
                    })
                    app.play();
                    wx.hideLoading()
                  }
                  else{
                    wx.hideLoading()
                    wx.showToast({
                      title: '登陆失败',
                      image:'../../img/fail.png'
                    })
                  }
              },
              fail:result=>{
                console.log(result)
                if (result.errMsg == 'request:fail timeout'){
                  wx.hideLoading();
                  wx.showToast({
                    title: '请求超时',
                    image:'../../img/fail.png'
                  })
                }
              }
            })
          }
        }
      })
    }
    else{
      wx.showToast({
        title: '登陆失败',
        image:'../../img/fail.png'
      })
    }
      
  },
  goBg:function(){
    wx.navigateTo({
      url: 'bg/bg',
    })
  }
})