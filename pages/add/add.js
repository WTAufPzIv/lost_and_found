const jsondata = require('../../utils/classname.js')
const ajax = require('../../utils/ajax.js')
const upload = require('../../utils/upload.js')

Page({
  data: {
    screenHeight:0,
    statusBarHeight: 0,
    leftColor:'',
    rightColor:'',
    classNames:[],
    classIndex:0,
    img:[],
    ifFull:'flex',
    tip:'捡到',
    tip1:'失主',
    school:'',
    title:'',
    address:'',
    time:'',
    phone:'',
    more:'',
    key:'',
    type:'',
    id:0,
    mode:'add'
  },
  onLoad:function(e){
    var school = wx.getStorageSync('school') ||  ''
    var key = wx.getStorageSync('key') || ''
    this.setData({
      school:school,
      key:key,
      title: e.title || '',
      address: e.address || '',
      time: e.time || '',
      phone: e.phone || '',
      more: e.detail || '',
      id: e.id || 0,
      mode: e.mode || 'add'
    })
    
    // var flag = e.img || '[]'
    // console.log(flag)
    // this.setData({
    //   img: JSON.parse(flag)
    // })
    if(e.addClass == 'left'){
      this.setData({
        leftColor:'#FFD84D',
        rightColor: 'white',
        tip: '捡到',
        tip1: '失主',
        type:'lost'
      })
    }
    else{
      this.setData({
        rightColor: '#FFD84D',
        leftColor: 'white',
        tip: '丢失',
        tip1: '别人',
        type: 'find'
      })
    }
    this.setData({
      screenHeight: wx.getSystemInfoSync().windowHeight
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res.statusBarHeight);
        that.setData({
          statusBarHeight: res.statusBarHeight
        })
      }
    })
    this.setData({
      classNames:jsondata.classList
    })
  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  },
  lost:function(){
    if(this.data.mode == 'set'){
      wx.showModal({
        title: '编辑启示',
        content: '编辑状态下无法修改板块',
        confirmColor:'#FFD84D',
        showCancel:false
      })
    }
    else{
      this.setData({
        leftColor: 'white',
        rightColor: '#FFD84D',
        tip: '丢失',
        tip1: '别人',
        type: 'find'
      })
    }
  },
  found: function () {
    if (this.data.mode == 'set') {
      wx.showModal({
        title: '编辑启示',
        content: '编辑状态下无法修改板块',
        confirmColor: '#FFD84D',
        showCancel: false
      })
    }
    else{
      this.setData({
        leftColor: '#FFD84D',
        rightColor: 'white',
        tip: '捡到',
        tip1: '失主',
        type: 'lost'
      })
    }
    
  },
  bindClassNameChange: function (e) {
    var that = this;
    console.log('picker city 发生选择改变，携带值为', e.detail.value);
    var val = e.detail.value
    this.setData({
      classIndex: e.detail.value,
    })
  },
  chooseimg:function(){
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res)
        var flag = that.data.img
        for (var i in res.tempFilePaths){
          flag.push(res.tempFilePaths[i])
        }
        that.setData({
          img:flag
        })
        if (that.data.img.length == 3) {
          that.setData({
            ifFull: 'none'
          })
        }
        else if (that.data.img.length > 3){
          wx.showToast({
            title: '最多选三张图片',
          })
          var qwe = []
          // qwe.slice(0,2)
          for(var i = 0; i < 3; i++){
            qwe[i] = that.data.img[i]
          }
          that.setData({
            img:qwe,
            ifFull: 'none'
          })
        }
      }
    })
  },
  fix:function(){
    wx.showModal({
      title: '发布规定',
      content: '1.严禁发布任何违法、反动、诈骗、不实、造谣等内容\r\n2.禁止在本平台发布无意义的灌水启示\r\n3.严禁利用本平台做其他违反法律法规的行为',
      showCancel:false,
      confirmText:'知道了',
      confirmColor:"#FFD84D"
    })
  },
  changeTitle:function(e){
    this.setData({
      title:e.detail.value
    })
  },
  changeAddress:function(e){
    this.setData({
      address: e.detail.value
    })
  },
  changeTime:function(e){
    this.setData({
      time: e.detail.value
    })
  },
  changePhone:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  changeMore:function(e){
    this.setData({
      more: e.detail.value
    })
  },
  updata:function(){
    var that = this
    if(this.data.school == ''){
      wx.showToast({
        title: '请先绑定学校',
        image:'../../img/warning.png'
      })
    }
    else{
      if (this.data.title == '' || this.data.address == '' || this.data.time == '' || this.data.phone == '') {
        wx.showToast({
          title: '请填写完整信息',
          image: '../../img/warning.png'
        })
      }
      else {
        if(this.data.type == 'lost'){
          if(this.data.mode == 'add'){
            if (this.data.img.length == 0) {
              wx.showModal({
                title: '未上传图片',
                content: '为了更详细描述物品，建议至少上传一张图片',
                confirmText: '仍然上传',
                confirmColor: '#FFD84D',
                success: function (res) {
                  if (res.confirm) {
                    that.config();
                  }
                }
              })
            }
            else {
              this.config();
            }
          }
          else if (this.data.mode == 'set'){
            if (this.data.img.length == 0) {
              wx.showModal({
                title: '未上传图片',
                content: '您未选择图片，系统将会保留之前的图片',
                confirmText: '继续上传',
                confirmColor: '#FFD84D',
                success: function (res) {
                  if (res.confirm) {
                    that.config2();
                  }
                }
              })
            }
            else {
              this.config2();
            }
          }
        }
        else if (this.data.type == 'find'){
          if (this.data.mode == 'add') {
            if (this.data.img.length == 0) {
              wx.showModal({
                title: '未上传图片',
                content: '为了更详细描述物品，建议至少上传一张图片',
                confirmText: '仍然上传',
                confirmColor: '#FFD84D',
                success: function (res) {
                  if (res.confirm) {
                    that.config1();
                  }
                }
              })
            }
            else {
              this.config1();
            }
          }
          else if (this.data.mode == 'set') {
            if (this.data.img.length == 0) {
              wx.showModal({
                title: '未上传图片',
                content: '您未选择图片，系统将会保留之前的图片',
                confirmText: '继续上传',
                confirmColor: '#FFD84D',
                success: function (res) {
                  if (res.confirm) {
                    that.config3();
                  }
                }
              })
            }
            else {
              this.config3();
            }
          }
        }
      }
    }
  },
  config1:function(){
    wx.showLoading({
      title: '发布中',
    })
    console.log(this.data)
    var that = this
    var className = this.data.classNames[this.data.classIndex]
    if (this.data.more == '') {
      this.setData({
        more: '(无详细信息)'
      })
    }
    ajax.request({
      method: "POST",
      url: 'find/add',
      data: {
        subject: that.data.title,
        detail: that.data.more,
        address: that.data.address,
        school: that.data.school,
        category: className,
        contactInformation: that.data.phone,
        date: that.data.time,
        key: that.data.key
      },
      success: res => {
        if (this.data.img.length > 0) {
          var arr = []
          for (var i = 0; i < that.data.img.length; i++) {
            arr[i] = (function (num) {
              upload.upload({
                method: 'POST',
                url: 'find/upload',
                filepath: that.data.img[num],
                key: that.data.key,
                imgid: res.data.imageId,
                success: function (result) {
                  console.log(result)
                  console.log(num)
                  if (num == that.data.img.length - 1) {
                    wx.hideLoading();
                    wx.showToast({
                      title: '发布成功'
                    });
                    wx.navigateBack({
                      delt: 1
                    })
                  }
                }
              })
            })(i)//给匿名函数传参解决闭包问题
          }
        }
        else {
          wx.hideLoading();
          wx.showToast({
            title: '发布成功'
          });
          wx.navigateBack({
            delt: 1
          })
        }
      }
    })
  },

  config:function(){
    wx.showLoading({
      title: '发布中...',
    })
    console.log(this.data)
    var that = this
    var className = this.data.classNames[this.data.classIndex]
    if (this.data.more == '') {
      this.setData({
        more: '(无详细信息)'
      })
    }
    ajax.request({
      method: "POST",
      url: 'lost/add',
      data: {
        subject: that.data.title,
        detail: that.data.more,
        address: that.data.address,
        school: that.data.school,
        category: className,
        contactInformation: that.data.phone,
        date: that.data.time,
        key: that.data.key
      },
      success: res => {
        if(this.data.img.length > 0){
          var arr = []
          for (var i = 0; i < that.data.img.length; i++) {
            arr[i] = (function (num) {
              upload.upload({
                method: 'POST',
                url: 'lost/upload',
                filepath: that.data.img[num],
                key: that.data.key,
                imgid: res.data.imageId,
                success: function (result) {
                  console.log(result)
                  console.log(num)
                  if (num == that.data.img.length - 1) {
                    wx.hideLoading();
                    wx.showToast({
                      title: '发布成功'
                    });
                    wx.navigateBack({
                      delt: 1
                    })
                  }
                }
              })
            })(i)//给匿名函数传参解决闭包问题
          }
        }
        else{
          wx.hideLoading();
          wx.showToast({
            title: '发布成功'
          });
          wx.navigateBack({
            delt: 1
          })
        }
      }
    })
  },
  config2: function () {
    wx.showLoading({
      title: '发布中...',
    })
    console.log(this.data)
    var that = this
    var className = this.data.classNames[this.data.classIndex]
    if (this.data.more == '') {
      this.setData({
        more: '(无详细信息)'
      })
    }
    ajax.request({
      method: "POST",
      url: 'lost/update',
      data: {
        lostId:that.data.id,
        subject: that.data.title,
        detail: that.data.more,
        address: that.data.address,
        school: that.data.school,
        category: className,
        contactInformation: that.data.phone,
        date: that.data.time,
        key: that.data.key,
        hasImages:that.data.img.length == 0?0:1
      },
      success: res => {
        if (this.data.img.length > 0) {
          var arr = []
          for (var i = 0; i < that.data.img.length; i++) {
            arr[i] = (function (num) {
              upload.upload({
                method: 'POST',
                url: 'lost/upload',
                filepath: that.data.img[num],
                key: that.data.key,
                imgid: res.data.imageId,
                success: function (result) {
                  console.log(result)
                  console.log(num)
                  if (num == that.data.img.length - 1) {
                    wx.hideLoading();
                    wx.showToast({
                      title: '发布成功'
                    });
                    wx.navigateBack({
                      delt: 1
                    })
                  }
                }
              })
            })(i)//给匿名函数传参解决闭包问题
          }
        }
        else {
          wx.hideLoading();
          wx.showToast({
            title: '发布成功'
          });
          wx.navigateBack({
            delt: 1
          })
        }
      }
    })
  },
  config3: function () {
    wx.showLoading({
      title: '发布中...',
    })
    console.log(this.data)
    var that = this
    var className = this.data.classNames[this.data.classIndex]
    if (this.data.more == '') {
      this.setData({
        more: '(无详细信息)'
      })
    }
    ajax.request({
      method: "POST",
      url: 'find/update',
      data: {
        findId: that.data.id,
        subject: that.data.title,
        detail: that.data.more,
        address: that.data.address,
        school: that.data.school,
        category: className,
        contactInformation: that.data.phone,
        date: that.data.time,
        key: that.data.key,
        hasImages: that.data.img.length == 0 ? 0 : 1
      },
      success: res => {
        if (this.data.img.length > 0) {
          var arr = []
          for (var i = 0; i < that.data.img.length; i++) {
            arr[i] = (function (num) {
              upload.upload({
                method: 'POST',
                url: 'find/upload',
                filepath: that.data.img[num],
                key: that.data.key,
                imgid: res.data.imageId,
                success: function (result) {
                  console.log(result)
                  console.log(num)
                  if (num == that.data.img.length - 1) {
                    wx.hideLoading();
                    wx.showToast({
                      title: '发布成功'
                    });
                    wx.navigateBack({
                      delt: 1
                    })
                  }
                }
              })
            })(i)//给匿名函数传参解决闭包问题
          }
        }
        else {
          wx.hideLoading();
          wx.showToast({
            title: '发布成功'
          });
          wx.navigateBack({
            delt: 1
          })
        }
      }
    })
  },
  deleteImg:function(e){
    console.log(e.target.id)
    var arr = this.data.img
    arr.splice(e.target.id,1)
    console.log(arr)
    this.setData({
      img:arr
    })
  }
})