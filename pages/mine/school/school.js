const provincedata = require('../../../utils/province.js')
const schooldata = require('../../../utils/school.js')
const ajax = require('../../../utils/ajax.js')
Page({
  data: {
    screenHeight: 0,
    statusBarHeight: 0,
    school:'未选择',
    province:[],
    schoolList:[],
    pIndex:0,
    sIndex:0,
    provinceValue:'选择省份',
    schoolValue:'选择学校',
    key:''
  },
  onLoad: function (e) {
    this.setData({
      province:provincedata.province,
      key:e.key
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
  back:function(){
    wx.navigateBack({
      delt:1
    })
  },
  changeprovince:function(e){
    console.log(e.detail.value)
    var that = this;
    this.setData({
      pIndex:e.detail.value,
      schoolValue:'选择学校',
      school:'未选择'
    },()=>{
      var i = that.data.pIndex
      var flag = that.data.province
      var that2 = that
      that.setData({
        provinceValue:flag[i],
      },()=>{
        that2.setData({
          schoolList: schooldata.schoolList[i].list
        })
        // console.log(flag[i])
        // console.log(schooldata.schoolList[i].list)
      })
    })
  },
  changeschool:function(e){
    var that = this
    this.setData({
      sIndex:e.detail.value
    },()=>{
      var i = that.data.sIndex
      var flag = that.data.schoolList;
      that.setData({
        schoolValue:flag[i],
        school: flag[i]
      })
    })
  },
  save:function(){
    var that = this
    if(this.data.school == '未选择'){
      wx.showToast({
        title: '未正确选择学校',
        image:'../../../img/fail.png'
      })
    }
    else{
      var flag = wx.getStorageSync('userInfo') || ''
      if(flag == ''){
        wx.showModal({
          title: '未登陆',
          content: '请现在个人页面微信授权后再绑定学校',
          showCancel:false,
          confirmText:'知道了'
        })
      }
      else{
        wx.showLoading({
          title: '保存修改...',
        })
        ajax.request({
          method: 'POST',
          url: 'user/changeSchool',
          data: {
            school: that.data.school,
            key: this.data.key
          },
          success: res => {
            if (res.code == 200) {
              wx.hideLoading()
              wx.showToast({
                title: '学校已保存'
              })
              setTimeout(function () {
                // 子页面向父页面传值
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];
                prevPage.setData({
                  school: that.data.school
                })
                wx.setStorageSync('school', that.data.school)
                wx.navigateBack({
                  delt: 1
                })
              }, 500)
            }
          }
        })
      }
    }
  }
})