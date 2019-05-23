// pages/mine/bg.js
const data = require('../../../utils/back.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenHeight: 0,
    statusBarHeight: 0,
    imgdata:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
    this.setData({
      screenHeight: wx.getSystemInfoSync().windowHeight,
      imgdata: data.backImgUrl
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  select:function(e){
    console.log(e.target.id)
    wx.setStorageSync('bg', e.target.id)
    wx.navigateBack({
      delt: 1
    })
  },
  back:function(){
    wx.navigateBack({
      delt:1
    })
  }
})