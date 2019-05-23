Page({ 
  data: {
    screenHeight: 0,
    statusBarHeight: 0,
    text: ''
  },
  onLoad: function () {
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
  back: function () {
    wx.navigateBack({
      delt: 1
    })
  },
  secret:function(){
    wx.navigateTo({
      url: './secret/secret',
    })
  }
})