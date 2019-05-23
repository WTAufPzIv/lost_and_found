const ajax = require('../../utils/ajax.js')
const app = getApp()
Page({
  data: {
    screenHeight: 0,
    statusBarHeight: 0,
    title:'',
    address:'',
    time:'',
    describe:'',
    avatar:"",
    nickname:'',
    phone:'',
    lunbo:[],
    id:0,
    type:''
  },
  onLoad: function (e) {
    var flag = wx.getStorageSync('key') || ''
    if(flag == ''){
      wx.showToast({
        title: '非法获取',
        image:'../../img/warning.png'
      })
    }
    else{
      this.setData({
        key:flag
      })
    }
    if(this.data.describe == ''){
      this.setData({
        describe:'(无更多描述)'
      })
    }
    this.setData({
      id:e.id,
      type:e.type
    })
  },
  onReady: function () {
    var that = this
    console.log(wx.getSystemInfoSync().windowHeight)
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
    wx.showLoading({
      title: '加载中',
    })
    console.log(that.data.id)
    ajax.request({
      method:'POST',
      url: that.data.type == 'lost' ? 'lost/one' :'find/one',
      data: that.data.type == 'lost' ?{
        lostId:that.data.id,
        key:that.data.key
      }:{
          findId: that.data.id,
          key: that.data.key
      },
      success:function(res){
        wx.hideLoading();
        console.log(res)
        if(res.code == 200){
          that.setData({
            lunbo:res.data.imageUrlList,
            title:res.data.subject,
            address:res.data.address,
            time: res.data.date,
            describe:res.data.detail,
            phone: res.data.contactInformation,
            nickname:res.data.nickName,
            avatar: res.data.userImageUrl
          })
        }
      }
    })
  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  },
  contact:function(){
    var flag;
    var that = this;
    wx.showActionSheet({
      itemList: [ '电话联系'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
          flag = res.tapIndex
        }
        if (flag == 0) {
          wx.makePhoneCall({
            phoneNumber: that.data.phone //仅为示例，并非真实的电话号码
          })
        }
      }
    });
   
    // wx.makePhoneCall({
    //   phoneNumber: this.data.phone //仅为示例，并非真实的电话号码
    // })
  },
  previewImg: function (e) {
    console.log(e.currentTarget.id);
    var index = e.currentTarget.id;
    var imgArr = this.data.lunbo;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})