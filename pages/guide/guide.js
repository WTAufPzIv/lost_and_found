const app = getApp()
Page({
  data:{
    screenHeight:0,
    newUser:true,
    screenHeight1:0,
    filter:0,
    secretDis:'none'
  },
  onLoad:function(e){
    var that = this
    var key = wx.getStorageSync('key') || ''
    if (key !== '') {
      this.setData({
        newUser: false
      })
      app.login({
        callback:function(){
            setTimeout(function(){
              wx.switchTab({
                url: '../lost/lost',
              })
             },2000)
        }
      })
      
    //   setTimeout(function(){
    //   wx.switchTab({
    //     url: '../lost/lost',
    //   })
    // },2000)
    }
    else{
      this.setData({
        newUser:true
      })

    }
    this.setData({
      screenHeight: wx.getSystemInfoSync().windowHeight,
      screenHeight1: wx.getSystemInfoSync().windowHeight,
    },()=>{
      var k = that;
      setTimeout(function(){
        that.setData({
          screenHeight1: k.data.screenHeight*0.66,
        })
      },500)
    })
  },
 go:function(){
   if(this.data.newUser){
     this.setData({
       filter:10,
       secretDis:'flex'
     })
    //  wx.switchTab({
    //    url: '../lost/lost',
    //  })
   }
 },
  handleEventListener: function (e) {
    //将组件B传递的num通过e.detail.agree来获取
    console.log(e.detail.agree)
    if (e.detail.agree){
       wx.switchTab({
       url: '../lost/lost',
     })
    }
    else{
      this.setData({
        secretDis:'none',
        filter:0
      })
    }
  }
})